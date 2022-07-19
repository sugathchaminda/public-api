const { validate } = require('../schemas/validation/validationHelper');
const { incomingInvoiceS3Reference } = require('../schemas/validation/sqs-event-schema');
const { getFromS3 } = require('../utils/s3Helper');
const ValidationError = require('../errors/validationError');
const { addNamespacesToPaJson } = require('../utils/paJsonHelper');
const { createIncomingInvoice } = require('../utils/dbHelper');
const { validateUblInvoiceJsonFunction } = require('../libs/schemaValidators');
const { convertPaJsonToUblJson } = require('../utils/ublJsonHelper');
const ublNamespaceMap = require('../utils/ubl21NamespaceMap');
const {
  storeAdditionalDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3
} = require('../utils/additionalDocumentReferenceHelper');

const getInvoiceFromS3 = async (s3Reference) => {
  const s3ReferenceValidationResult = await validate(s3Reference, incomingInvoiceS3Reference);
  if (s3ReferenceValidationResult.error) {
    console.error('store-incoming-invoice#handler.run', s3ReferenceValidationResult.error);
    throw new ValidationError({
      metadata: s3ReferenceValidationResult.error
    });
  }
  const s3Invoice = await getFromS3(s3Reference.key, s3Reference.bucket);
  if (!s3Invoice?.Body) throw new Error('store-incoming-invoice#handler.run: event references body on S3 but no object body was found');
  return JSON.parse(s3Invoice.Body);
};

const parseEvent = async (eventRecord) => {
  const regNo = eventRecord.messageAttributes.regNo.stringValue;
  const payloadLocation = eventRecord.messageAttributes.payloadLocation.stringValue.toUpperCase();
  const body = JSON.parse(eventRecord.body);
  if (payloadLocation === 'S3') {
    const s3Invoice = await getInvoiceFromS3(body);
    return { invoice: s3Invoice, regNo };
  }
  return { invoice: body, regNo };
};

const createInvoice = async (invoiceWithNamespaces, regNo) => {
  const { binaryObjectReferences, invoiceJsonWithBinaryObjectReferences } = await storeAdditionalDocumentReferenceBinaryObjectsOnS3(invoiceWithNamespaces);
  try {
    return createIncomingInvoice(invoiceJsonWithBinaryObjectReferences, regNo);
  } catch (err) {
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const saveIncomingInvoice = async (event) => {
  const { invoice, regNo } = await parseEvent(event.Records[0]);

  // We assume that the invoice is passed as PA-json, but it can and can not contain namespaces. therefore we add them if missing.
  const invoiceWithNamespaces = addNamespacesToPaJson(invoice, ublNamespaceMap);
  // validate invoice
  const validInvoice = await validateUblInvoiceJsonFunction(convertPaJsonToUblJson(invoiceWithNamespaces));
  if (!validInvoice) {
    console.error('store-incoming-invoice#handler.run', 'invalid invoice received from queue');
    console.error('store-incoming-invoice#handler.run#Invoice', invoiceWithNamespaces);
    console.error('store-incoming-invoice#handler.run#errors', validateUblInvoiceJsonFunction.errors);
    throw new ValidationError({
      metadata: validateUblInvoiceJsonFunction.errors
    });
  }

  const createInvoiceInMdsDbResult = await createInvoice(invoiceWithNamespaces, regNo);
  if (createInvoiceInMdsDbResult.uuid) {
    return {
      message: 'incoming invoice stored in mdsdb',
      invoice: createInvoiceInMdsDbResult.invoice
    };
  }

  // unlikely that we should ever end up here.
  throw new Error('store-incoming-invoice#handler.run', 'unexpected error storing invoice, did not create invoice in db');
};

module.exports = { saveIncomingInvoice };
