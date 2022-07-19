const knex = require('knex')({ client: 'pg' });
const db = require('../db/dataApi');
const ValidationError = require('../errors/validationError');

const {
  getOrderDateFromPaJson,
  getOrderIdFromPaJson
} = require('./paJsonHelper');

const { getOrderWithBinaryObjectReferencesOnS3 } = require('./additionalDocumentReferenceHelper');

const OUTGOING_ORDERS_TABLE_NAME = 'outgoing_orders';
const INCOMING_ORDERS_TABLE_NAME = 'incoming_orders';

const beginTransaction = async () => db.beginTransaction();
const commitTransaction = async (transactionId) => db.commitTransaction({ transactionId });

const getOrder = async (orderJson, accountRegNo, table) => {
  const orderId = getOrderIdFromPaJson(orderJson);
  if (orderId === undefined) throw Error('No ID property set on Order, cannot lookup order in db without key');
  const sql = knex(table)
    .where({
      owner_account: accountRegNo,
      order_number: orderId
    })
    .toQuery();
  const ret = await db.query(sql);
  const record = ret?.records?.[0] || null;
  if (record === null) return null;
  return { ...record, ...{ order: JSON.parse(record.order) } };
};

const getOrderResult = async (accountRegNo, limit, offset, query, table, select = ['*'], order = 'asc', transactionId = null) => {
  const sql = knex(table)
    .where({ ...query, ...{ owner_account: accountRegNo } })
    .orderBy('createdAt', order)
    .select(select)
    .limit(limit)
    .offset(offset)
    .toQuery();
  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });
  return ret?.records || [];
};

const getOrders = async (accountRegNo, limit, offset, query, table, transactionId = null) => {
  const result = await getOrderResult(accountRegNo, limit, offset, query, table, ['*'], 'asc', transactionId);
  return Promise.all(result.map(async (row) => {
    const orderJson = { order: JSON.parse(row.order) };
    const orderWithBinaryObjectReferences = await getOrderWithBinaryObjectReferencesOnS3(orderJson);
    return { ...row, ...{ order: JSON.parse(JSON.stringify(orderWithBinaryObjectReferences.orderJsonWithBinaryObjectReferences.order)) } };
  }));
};

const createErrorsArray = (ownerAccount, orderDate, orderNumber, senderRegNo) => {
  const varToString = (variable) => Object.keys({ variable })[0];
  return [ownerAccount, orderDate, orderNumber, senderRegNo].map((val) => {
    if (!val) {
      return `${varToString(val)} is missing in the incoming order`;
    }
    return undefined;
  }).filter((val) => val !== undefined);
};

const validateOrderParams = (ownerAccount, orderDate, orderNumber, senderRegNo) => {
  if (!ownerAccount || !orderDate || !orderNumber || !senderRegNo) {
    // This should not happen since this should be caught in validation layer.
    const errors = createErrorsArray(ownerAccount, orderDate, orderNumber, senderRegNo);
    throw new ValidationError({
      message: errors
    });
  }
};

const getOrderParams = (orderJson, accountRegNo) => {
  const ownerAccount = accountRegNo;
  const orderDate = getOrderDateFromPaJson(orderJson);
  const orderNumber = getOrderIdFromPaJson(orderJson);
  const regNo = accountRegNo;
  return {
    ownerAccount,
    orderDate,
    orderNumber,
    regNo
  };
};

const updateOrder = async (existingOrderUUID, orderJson, accountRegNo, table, transactionId = null) => {
  const {
    ownerAccount, orderDate, orderNumber, regNo
  } = getOrderParams(orderJson, accountRegNo);
  validateOrderParams(ownerAccount, orderDate, orderNumber, regNo);
  const sql = knex(table)
    .update({
      owner_account: ownerAccount,
      order_date: orderDate,
      order_number: orderNumber,
      reg_no: regNo,
      order: JSON.stringify(orderJson),
      meta_data: JSON.stringify({ overwrite: true }),
      updatedAt: knex.fn.now()
    })
    .where({ uuid: existingOrderUUID })
    .returning('*')
    .toQuery();
  const orderResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = orderResult.records[0];
  return { ...record, ...{ order: JSON.parse(record.order) } };
};

const updateOrderRead = async (accountRegNo, toReadOrders, limit, offset, table, transactionId = null) => {
  const sql = knex(table)
    .update({
      readAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    })
    .whereIn('id', toReadOrders)
    .where({ reg_no: accountRegNo })
    .limit(limit)
    .offset(offset)
    .returning('*')
    .toQuery();
  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });
  const result = ret?.records || [];
  return Promise.all(result.map(async (row) => {
    const orderJson = { order: JSON.parse(row.order) };
    const orderWithBinaryObjectReferences = await getOrderWithBinaryObjectReferencesOnS3(orderJson);
    return { ...row, ...{ order: JSON.parse(JSON.stringify(orderWithBinaryObjectReferences.orderJsonWithBinaryObjectReferences.order)) } };
  }));
};

const createOrder = async (orderJson, accountRegNo, table, transactionId = null) => {
  const {
    ownerAccount, orderDate, orderNumber, regNo
  } = getOrderParams(orderJson, accountRegNo);
  validateOrderParams(ownerAccount, orderDate, orderNumber, regNo);
  const sql = knex(table)
    .insert([{
      owner_account: ownerAccount,
      order_date: orderDate,
      order_number: orderNumber,
      reg_no: regNo,
      order: JSON.stringify(orderJson),
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    }])
    .returning('*')
    .toQuery();

  const orderResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = orderResult.records[0];
  return { ...record, ...{ order: JSON.parse(record.order) } };// We assume one record from query and parse to json
};

const getIncomingOrders = async (accountRegNo, limit, offset, query) => getOrders(accountRegNo, limit, offset, query, INCOMING_ORDERS_TABLE_NAME);

const getIncomingOrder = async (orderJson, accountRegNo) => getOrder(orderJson, accountRegNo, INCOMING_ORDERS_TABLE_NAME);

const createOutgoingOrder = async (orderJson, accountRegNo, transactionID = null) => createOrder(
  orderJson, accountRegNo, OUTGOING_ORDERS_TABLE_NAME, transactionID
);

const updateOutgoingOrder = async (existingOrderUUID, orderJson, accountRegNo, transactionId = null) => updateOrder(
  existingOrderUUID, orderJson, accountRegNo, OUTGOING_ORDERS_TABLE_NAME, transactionId
);

const getOutgoingOrder = async (orderJson, accountRegNo) => getOrder(orderJson, accountRegNo, OUTGOING_ORDERS_TABLE_NAME);

const getOutgoingOrders = async (orders, accountRegNo) => {
  const results = await Promise.all(orders.map(async (orderJson) => getOrder(orderJson, accountRegNo, OUTGOING_ORDERS_TABLE_NAME)));
  return results.filter((order) => order !== null);
};

const readIncomingOrders = async (accountRegNo, limit, query, transactionID = null) => getOrderResult(
  accountRegNo, limit, 0, query, INCOMING_ORDERS_TABLE_NAME, ['id'], 'asc', transactionID
);

const updateIncomingOrderRead = async (accountRegNo, toReadOrders, limit, transactionID = null) => updateOrderRead(
  accountRegNo, toReadOrders, limit, 0, INCOMING_ORDERS_TABLE_NAME, transactionID
);

const createIncomingOrder = async (orderJson, accountRegNo, transactionID = null) => createOrder(
  orderJson, accountRegNo, INCOMING_ORDERS_TABLE_NAME, transactionID
);

const updateIncomingOrder = async (existingOrderUUID, orderJson, accountRegNo, transactionId = null) => updateOrder(
  existingOrderUUID, orderJson, accountRegNo, INCOMING_ORDERS_TABLE_NAME, transactionId
);

module.exports = {
  beginTransaction,
  commitTransaction,

  getOutgoingOrder,
  getOutgoingOrders,
  updateOutgoingOrder,
  createOutgoingOrder,
  getIncomingOrders,
  getIncomingOrder,
  readIncomingOrders,
  updateIncomingOrderRead,
  createIncomingOrder,
  updateIncomingOrder
};
