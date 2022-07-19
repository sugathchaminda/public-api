const {
  getOutgoingInvoice,
  updateOutgoingInvoice,
  createOutgoingInvoice,
  getOutgoingInvoices,
  beginTransaction,
  commitTransaction
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
  getQueryStringFromRequest,
  normalizedInvoicesFromBatchRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveInvoice = async (invoice, accountRegNo, dbUuid) => sendMessageToSqs(invoice, accountRegNo, dbUuid, getQueueUrl());

const createOrUpdateInvoice = async (accountRegNo, invoiceBody, shouldUpdate, existingInvoice = null, transactionId = null) => {
  const { binaryObjectReferences, invoiceJsonWithBinaryObjectReferences } = await storeAdditionalDocumentReferenceBinaryObjectsOnS3(invoiceBody);

  try {
    return shouldUpdate
      ? await updateOutgoingInvoice(existingInvoice.uuid, invoiceJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createOutgoingInvoice(invoiceJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    // Cleanup s3 if we had an issue when storing in the database.
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const createOrUpdateInvoices = async (invoices, existingInvoices, accountRegNo) => {
  const duplicateInvoiceIds = existingInvoices.map((invoice) => getInvoiceIdFromPaJson(invoice.invoice));

  const transaction = await beginTransaction();

  const invoiceDbResults = await Promise.all(invoices.map(async (invoice) => {
    const invoiceExists = duplicateInvoiceIds.includes(getInvoiceIdFromPaJson(invoice));
    const existingInvoice = existingInvoices.find((dbInvoice) => getInvoiceIdFromPaJson(dbInvoice.invoice) === getInvoiceIdFromPaJson(invoice));
    return createOrUpdateInvoice(accountRegNo, invoice, invoiceExists, existingInvoice, transaction.transactionId);
  }));

  const transactionStatus = await commitTransaction(transaction.transactionId);

  return { transactionStatus, invoiceDbResults };
};

const postInvoice = async (req) => {
  try {
    const invoiceBody = await normalizedInvoiceBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const invoiceNumber = getInvoiceIdFromPaJson(invoiceBody);
    const existingInvoice = await getOutgoingInvoice(invoiceBody, accountRegNo);
    const invoiceExists = !!existingInvoice?.uuid;

    if (invoiceExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate invoice, ${invoiceNumber} request rejected!`
      }));
    }

    const invoiceResult = await createOrUpdateInvoice(accountRegNo, invoiceBody, invoiceExists, existingInvoice);
    const dbUuid = invoiceResult.uuid;

    await sendToReceiveInvoice(invoiceResult.invoice, accountRegNo, dbUuid);

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

const batchInvoices = async (req) => {
  try {
    const invoices = normalizedInvoicesFromBatchRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const existingInvoices = await getOutgoingInvoices(invoices, accountRegNo) || [];
    const duplicateInvoiceIds = existingInvoices.map((invoice) => getInvoiceIdFromPaJson(invoice.invoice));

    if (existingInvoices.length > 0 && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate invoice(s), ${duplicateInvoiceIds} request rejected!`
      }));
    }

    const { invoiceDbResults } = await createOrUpdateInvoices(invoices, existingInvoices, accountRegNo);

    await Promise.all(invoiceDbResults.map(async (invoiceResult) => sendToReceiveInvoice(invoiceResult.invoice, accountRegNo, invoiceResult.uuid)));

    const invoiceIds = invoiceDbResults.map((result) => getInvoiceIdFromPaJson(result.invoice));
    const message = `invoices ${invoiceIds} sent`;

    return {
      message,
      invoice_ids: invoiceIds
    };
  } catch (err) {
    console.error('api/invoices/outgoing/service/post.js#batchInvoices', err);
    return ErrorHelper(err);
  }
};

module.exports = {
  postInvoice,
  batchInvoices
};
