const {
  getIncomingOrder,
  updateIncomingOrder,
  createIncomingOrder
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
  getQueryStringFromRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveOrder = async (order, accountRegNo, dbUuid, relaying) => sendMessageToSqs(order, accountRegNo, dbUuid, getQueueUrl(), relaying);

const createOrUpdateOrder = async (accountRegNo, orderBody, shouldUpdate, existingOrder = null, transactionId = null) => {
  const { binaryObjectReferences, orderJsonWithBinaryObjectReferences } = await storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3(orderBody);
  try {
    return shouldUpdate
      ? await updateIncomingOrder(existingOrder.uuid, orderJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createIncomingOrder(orderJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    // Cleanup s3 if we had an issue when storing in the database.
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const postOrder = async (req) => {
  try {
    const orderBody = await normalizedOrderBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const orderNumber = getOrderIdFromPaJson(orderBody);
    const existingOrder = await getIncomingOrder(orderBody, accountRegNo);
    const orderExists = !!existingOrder?.uuid;
    if (orderExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate order, ${orderNumber} request rejected!`
      }));
    }

    const orderResult = await createOrUpdateOrder(accountRegNo, orderBody, orderExists, existingOrder);
    const dbUuid = orderResult.uuid;
    const relaying = 'false';
    await sendToReceiveOrder(orderResult.order, accountRegNo, dbUuid, relaying);

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

module.exports = {
  postOrder
};
