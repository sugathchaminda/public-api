const {
  getIncomingInvoice,
  updateIncomingInvoice,
  createIncomingInvoice
} = require('../../../../utils/dbHelper');
const ErrorHelper = require('../../../../errors/errorHelper');
const ConflictError = require('../../../../errors/conflictError');
const { sendMessageToSqs, getQueueUrl } = require('../../../../utils/sqsHelper');
const { getInvoiceIdFromPaJson } = require('../../../../utils/paJsonHelper');
const {
  storeAdditionalDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3
} = require('../../../../utils/additionalDocumentReferenceHelper');
const {
  normalizedInvoiceBodyFromRequest,
  getAccountRegNoFromRequest,
  getQueryStringFromRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveInvoice = async (invoice, accountRegNo, dbUuid, relaying) => sendMessageToSqs(invoice, accountRegNo, dbUuid, getQueueUrl(), relaying);

const createOrUpdateInvoice = async (accountRegNo, invoiceBody, shouldUpdate, existingInvoice = null, transactionId = null) => {
  const { binaryObjectReferences, invoiceJsonWithBinaryObjectReferences } = await storeAdditionalDocumentReferenceBinaryObjectsOnS3(invoiceBody);

  try {
    return shouldUpdate
      ? await updateIncomingInvoice(existingInvoice.uuid, invoiceJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createIncomingInvoice(invoiceJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    // Cleanup s3 if we had an issue when storing in the database.
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const postInvoice = async (req) => {
  try {
    const invoiceBody = await normalizedInvoiceBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const invoiceNumber = getInvoiceIdFromPaJson(invoiceBody);
    const existingInvoice = await getIncomingInvoice(invoiceBody, accountRegNo);
    const invoiceExists = !!existingInvoice?.uuid;

    if (invoiceExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate invoice, ${invoiceNumber} request rejected!`
      }));
    }

    const invoiceResult = await createOrUpdateInvoice(accountRegNo, invoiceBody, invoiceExists, existingInvoice);
    const dbUuid = invoiceResult.uuid;
    const relaying = 'false';

    await sendToReceiveInvoice(invoiceResult.invoice, accountRegNo, dbUuid, relaying);

    const contentType = getContentTypeFromRequest(req);
    const isXml = contentType.toLowerCase() === 'application/xml';

    const message = `invoice ${invoiceNumber} sent`;

    if (isXml) {
      return `<message>${message}</message><invoice_id>${invoiceNumber}</invoice_id>`;
    }
    return {
      message,
      invoice_id: invoiceNumber
    };
  } catch (err) {
    console.error('api/invoices/outgoing/service/post.js#postInvoice', err);
    return ErrorHelper(err);
  }
};

module.exports = {
  postInvoice
};
