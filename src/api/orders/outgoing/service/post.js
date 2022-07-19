const {
  getOutgoingOrder,
  updateOutgoingOrder,
  createOutgoingOrder,
  getOutgoingOrders,
  beginTransaction,
  commitTransaction
} = require('../../../../utils/orderDbHelper');
const ErrorHelper = require('../../../../errors/errorHelper');
const ConflictError = require('../../../../errors/conflictError');
const { sendMessageToSqs, getQueueUrl } = require('../../../../utils/sqsHelper');
const { getOrderIdFromPaJson } = require('../../../../utils/paJsonHelper');
const {
  storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3
} = require('../../../../utils/additionalDocumentReferenceHelper');
const {
  normalizedOrderBodyFromRequest,
  getAccountRegNoFromRequest,
  getQueryStringFromRequest,
  normalizedOrdersFromBatchRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveOrder = async (order, accountRegNo, dbUuid) => sendMessageToSqs(order, accountRegNo, dbUuid, getQueueUrl());

const createOrUpdateOrder = async (accountRegNo, orderBody, shouldUpdate, existingOrder = null, transactionId = null) => {
  const { binaryObjectReferences, orderJsonWithBinaryObjectReferences } = await storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3(orderBody);
  try {
    return shouldUpdate
      ? await updateOutgoingOrder(existingOrder.uuid, orderJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createOutgoingOrder(orderJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    // Cleanup s3 if we had an issue when storing in the database.
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const createOrUpdateOrders = async (orders, existingOrders, accountRegNo) => {
  const duplicateOrderIds = existingOrders.map((order) => getOrderIdFromPaJson(order.order));
  const transaction = await beginTransaction();
  const orderDbResults = await Promise.all(orders.map(async (order) => {
    const orderExists = duplicateOrderIds.includes(getOrderIdFromPaJson(order));
    const existingOrder = existingOrders.find((dbOrder) => getOrderIdFromPaJson(dbOrder.order) === getOrderIdFromPaJson(order));
    return createOrUpdateOrder(accountRegNo, order, orderExists, existingOrder, transaction.transactionId);
  }));
  const transactionStatus = await commitTransaction(transaction.transactionId);
  return { transactionStatus, orderDbResults };
};

const postOrder = async (req) => {
  try {
    const orderBody = await normalizedOrderBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const orderNumber = getOrderIdFromPaJson(orderBody);
    const existingOrder = await getOutgoingOrder(orderBody, accountRegNo);
    const orderExists = !!existingOrder?.uuid;

    if (orderExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate order, ${orderNumber} request rejected!`
      }));
    }

    const orderResult = await createOrUpdateOrder(accountRegNo, orderBody, orderExists, existingOrder);
    const dbUuid = orderResult.uuid;
    await sendToReceiveOrder(orderResult.order, accountRegNo, dbUuid);
    const contentType = getContentTypeFromRequest(req);
    const isXml = contentType.toLowerCase() === 'application/xml';
    const message = `order ${orderNumber} sent`;

    if (isXml) {
      return `<message>${message}</message><order_id>${orderNumber}</order_id>`;
    }
    return {
      message,
      order_id: orderNumber
    };
  } catch (err) {
    console.error('api/orders/outgoing/service/post.js#postOrder', err);
    return ErrorHelper(err);
  }
};

const batchOrders = async (req) => {
  try {
    const orders = normalizedOrdersFromBatchRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const existingOrders = await getOutgoingOrders(orders, accountRegNo) || [];
    const duplicateOrderIds = existingOrders.map((order) => getOrderIdFromPaJson(order.order));

    if (existingOrders.length > 0 && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate order(s), ${duplicateOrderIds} request rejected!`
      }));
    }

    const { orderDbResults } = await createOrUpdateOrders(orders, existingOrders, accountRegNo);

    await Promise.all(orderDbResults.map(async (orderResult) => sendToReceiveOrder(orderResult.order, accountRegNo, orderResult.uuid)));

    const orderIds = orderDbResults.map((result) => getOrderIdFromPaJson(result.order));
    const message = `orders ${orderIds} sent`;

    return {
      message,
      order_ids: orderIds
    };
  } catch (err) {
    console.error('api/orders/outgoing/service/post.js#batchOrders', err);
    return ErrorHelper(err);
  }
};

module.exports = {
  postOrder,
  batchOrders
};
