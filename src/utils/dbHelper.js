const knex = require('knex')({ client: 'pg' });
const db = require('../db/dataApi');

const ValidationError = require('../errors/validationError');

const {
  getInvoiceDateFromPaJson,
  getInvoiceIdFromPaJson,
  convertPaJsonToUblXml,
  getOrderDateFromPaJson,
  getOrderIdFromPaJson
} = require('./paJsonHelper');

const { getInvoiceWithBinaryObjectReferencesOnS3 } = require('./additionalDocumentReferenceHelper');

const OUTGOINGINVOICES_TABLE_NAME = 'outgoinginvoice';
const INCOMINGINVOICES_TABLE_NAME = 'incominginvoice';
const INCOMINGORDER_RESPONSE_TABLE_NAME = 'incoming_order_response';

const beginTransaction = async () => db.beginTransaction();
const commitTransaction = async (transactionId) => db.commitTransaction({ transactionId });

const getInvoice = async (invoiceJson, accountRegNo, table) => {
  const invoiceId = getInvoiceIdFromPaJson(invoiceJson);
  if (invoiceId === undefined) throw Error('No ID property set on Invoice, cannot lookup invoice in db without key');
  const sql = knex(table)
    .where({
      owneraccount: accountRegNo,
      invoicenumber: invoiceId
    })
    .toQuery();

  const ret = await db.query(sql);
  const record = ret?.records?.[0] || null;
  if (record === null) return null;
  return { ...record, ...{ invoice: JSON.parse(record.invoice) } };
};

const getInvoiceResult = async (accountRegNo, limit, offset, query, table, select = ['*'], order = 'asc', transactionId = null) => {
  const sql = knex(table)
    .where({ ...query, ...{ owneraccount: accountRegNo } })
    .orderBy('createdAt', order)
    .select(select)
    .limit(limit)
    .offset(offset)
    .toQuery();

  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });

  return ret?.records || [];
};

const getInvoices = async (accountRegNo, limit, offset, query, contentType, table, transactionId = null) => {
  const result = await getInvoiceResult(accountRegNo, limit, offset, query, table, ['*'], 'asc', transactionId);

  const isXml = contentType.toLowerCase() === 'application/xml';

  return Promise.all(result.map(async (row) => {
    const invoiceJson = { invoice: JSON.parse(row.invoice) };

    const invoiceWithBinaryObjectReferences = await getInvoiceWithBinaryObjectReferencesOnS3(invoiceJson);

    const invoiceData = invoiceWithBinaryObjectReferences.invoiceJsonWithBinaryObjectReferences.invoice;

    const invoiceResult = isXml ? await convertPaJsonToUblXml(invoiceData) : JSON.parse(JSON.stringify(invoiceData));

    return { ...row, ...{ invoice: invoiceResult } };
  }));
};

const createErrorsArray = (owneraccount, invoicedate, invoicenumber, senderregno) => {
  const varToString = (variable) => Object.keys({ variable })[0];
  return [owneraccount, invoicedate, invoicenumber, senderregno].map((val) => {
    if (!val) {
      return `${varToString(val)} is missing in the incoming invoice`;
    }
    return undefined;
  }).filter((val) => val !== undefined);
};

const validateInvoiceParams = (owneraccount, invoicedate, invoicenumber, senderregno) => {
  if (!owneraccount || !invoicedate || !invoicenumber || !senderregno) {
    // This should not happen since this should be caught in validation layer.
    const errors = createErrorsArray(owneraccount, invoicedate, invoicenumber, senderregno);
    throw new ValidationError({
      message: errors
    });
  }
};

const validateOrderParams = (owneraccount, orderedate, ordernumber, senderregno) => {
  if (!owneraccount || !orderedate || !ordernumber || !senderregno) {
    // This should not happen since this should be caught in validation layer.
    const errors = createErrorsArray(owneraccount, orderedate, ordernumber, senderregno);
    throw new ValidationError({
      message: errors
    });
  }
};

const getInvoiceParams = (invoiceJson, accountRegNo) => {
  const owneraccount = accountRegNo;
  const invoicedate = getInvoiceDateFromPaJson(invoiceJson);
  const invoicenumber = getInvoiceIdFromPaJson(invoiceJson);
  const regno = accountRegNo;
  return {
    owneraccount,
    invoicedate,
    invoicenumber,
    regno
  };
};

const getOrderParams = (orderJson, accountRegNo) => {
  const owneraccount = accountRegNo;
  const orderdate = getOrderDateFromPaJson(orderJson);
  const ordernumber = getOrderIdFromPaJson(orderJson);
  const regno = accountRegNo;
  return {
    owneraccount,
    orderdate,
    ordernumber,
    regno
  };
};

const updateInvoice = async (existingInvoiceUUID, invoiceJson, accountRegNo, table, transactionId = null) => {
  const {
    owneraccount, invoicedate, invoicenumber, regno
  } = getInvoiceParams(invoiceJson, accountRegNo);
  validateInvoiceParams(owneraccount, invoicedate, invoicenumber, regno);

  const sql = knex(table)
    .update({
      owneraccount,
      invoicedate,
      invoicenumber,
      regno,
      invoice: JSON.stringify(invoiceJson),
      metadata: JSON.stringify({ overwrite: true }),
      updatedAt: knex.fn.now()
    })
    .where({ uuid: existingInvoiceUUID })
    .returning('*')
    .toQuery();

  const invoiceResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = invoiceResult.records[0];
  return { ...record, ...{ invoice: JSON.parse(record.invoice) } };
};

const updateInvoiceRead = async (accountRegNo, toReadInvoices, limit, contentType, offset, table, transactionId = null) => {
  const sql = knex(table)
    .update({
      readAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    })
    .whereIn('id', toReadInvoices)
    .where({ regno: accountRegNo })
    .limit(limit)
    .offset(offset)
    .returning('*')
    .toQuery();

  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });

  const result = ret?.records || [];

  const isXml = contentType.toLowerCase() === 'application/xml';

  return Promise.all(result.map(async (row) => {
    const invoiceJson = { invoice: JSON.parse(row.invoice) };

    const invoiceWithBinaryObjectReferences = await getInvoiceWithBinaryObjectReferencesOnS3(invoiceJson);
    const invoiceData = invoiceWithBinaryObjectReferences.invoiceJsonWithBinaryObjectReferences.invoice;

    const invoiceResult = isXml ? await convertPaJsonToUblXml(invoiceData) : JSON.parse(JSON.stringify(invoiceData));

    return { ...row, ...{ invoice: invoiceResult } };
  }));
};

const createInvoice = async (invoiceJson, accountRegNo, table, transactionId = null) => {
  const {
    owneraccount, invoicedate, invoicenumber, regno
  } = getInvoiceParams(invoiceJson, accountRegNo);
  validateInvoiceParams(owneraccount, invoicedate, invoicenumber, regno);

  const sql = knex(table)
    .insert([{
      owneraccount,
      invoicedate,
      invoicenumber,
      regno,
      invoice: JSON.stringify(invoiceJson),
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    }])
    .returning('*')
    .toQuery();

  const invoiceResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = invoiceResult.records[0];
  return { ...record, ...{ invoice: JSON.parse(record.invoice) } };// We assume one record from query and parse to json
};

const createOrderResponse = async (orderJson, accountRegNo, table, transactionId = null) => {
  const {
    owneraccount, orderdate, ordernumber, regno
  } = getOrderParams(orderJson, accountRegNo);
  validateOrderParams(owneraccount, orderdate, ordernumber, regno);

  const sql = knex(table)
    .insert([{
      owneraccount,
      orderdate,
      ordernumber,
      regno,
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

const getIncomingInvoices = async (accountRegNo, limit, offset, query, contentType) => getInvoices(
  accountRegNo, limit, offset, query, contentType, INCOMINGINVOICES_TABLE_NAME
);

const getIncomingInvoice = async (invoiceJson, accountRegNo) => getInvoice(
  invoiceJson, accountRegNo, INCOMINGINVOICES_TABLE_NAME
);

const createOutgoingInvoice = async (invoiceJson, accountRegNo, transactionID = null) => createInvoice(
  invoiceJson, accountRegNo, OUTGOINGINVOICES_TABLE_NAME, transactionID
);
const updateOutgoingInvoice = async (existingInvoiceUUID, invoiceJson, accountRegNo, transactionId = null) => updateInvoice(
  existingInvoiceUUID, invoiceJson, accountRegNo, OUTGOINGINVOICES_TABLE_NAME, transactionId
);

const getOutgoingInvoice = async (invoiceJson, accountRegNo) => getInvoice(invoiceJson, accountRegNo, OUTGOINGINVOICES_TABLE_NAME);
const getOutgoingInvoices = async (invoices, accountRegNo) => {
  const results = await Promise.all(invoices.map(async (invoiceJson) => getInvoice(invoiceJson, accountRegNo, OUTGOINGINVOICES_TABLE_NAME)));
  return results.filter((invoice) => invoice !== null);
};

const readIncomingInvoices = async (accountRegNo, limit, query, transactionID = null) => getInvoiceResult(
  accountRegNo, limit, 0, query, INCOMINGINVOICES_TABLE_NAME, ['id'], 'asc', transactionID
);

const updateIncomingInvoiceRead = async (accountRegNo, toReadInvoices, limit, contentType, transactionID = null) => updateInvoiceRead(
  accountRegNo, toReadInvoices, limit, contentType, 0, INCOMINGINVOICES_TABLE_NAME, transactionID
);

const createIncomingInvoice = async (invoiceJson, accountRegNo, transactionID = null) => createInvoice(
  invoiceJson, accountRegNo, INCOMINGINVOICES_TABLE_NAME, transactionID
);

const createIncomingOrderResponse = async (orderJson, accountRegNo, transactionID = null) => createOrderResponse(
  orderJson, accountRegNo, INCOMINGORDER_RESPONSE_TABLE_NAME, transactionID
);

const updateIncomingInvoice = async (existingInvoiceUUID, invoiceJson, accountRegNo, transactionId = null) => updateInvoice(
  existingInvoiceUUID, invoiceJson, accountRegNo, INCOMINGINVOICES_TABLE_NAME, transactionId
);

module.exports = {
  getOutgoingInvoice,
  getOutgoingInvoices,
  updateOutgoingInvoice,
  createOutgoingInvoice,
  beginTransaction,
  commitTransaction,
  getIncomingInvoices,
  getIncomingInvoice,
  readIncomingInvoices,
  updateIncomingInvoiceRead,
  createIncomingInvoice,
  updateIncomingInvoice,
  createIncomingOrderResponse
};
