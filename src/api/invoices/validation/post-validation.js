const {
  clean,
  validate
} = require('../../../schemas/validation/validationHelper');
const {
  convertUblXmlToUblJson,
  normalizeToUblJson
} = require('../../../utils/ublJsonHelper');
const schema = require('../../../schemas/validation/invoice-schema');
const ValidationError = require('../../../errors/validationError');

// We assume that the precompiled schema exists, if not we want to crash horribly anyway to get notified...
const { validateUblInvoiceJsonFunction } = require('../../../libs/schemaValidators');
const {
  getInvoiceIdFromPaJson,
  normalizeToPaJson,
  convertPaJsonToUblXml
} = require('../../../utils/paJsonHelper');
const { createValidationMetadata, validationTypes } = require('../../../utils/errorHelper');
const { validatePeppolXml } = require('../../../utils/peppolValidationHelper');

const validateUbl21Json = async (json) => {
  const valid = validateUblInvoiceJsonFunction(json);
  const { errors } = validateUblInvoiceJsonFunction;
  return {
    valid,
    errors
  };
};

const postInvoiceJson = async (invoice) => validateUbl21Json(normalizeToUblJson(invoice));

const postInvoiceXml = async (invoice) => {
  const ubl21JsonFromXml = await convertUblXmlToUblJson(invoice);
  return validateUbl21Json(ubl21JsonFromXml);
};

const createAttributesObject = (req) => clean({
  accountRegNo: req.params.accountRegNo,
  contentType: req.headers['content-type'],
  query: req.query,
  body: req.body
});

async function validateInvoiceRequest(req) {
  const attributes = createAttributesObject(req);

  const baseValidationResult = await validate(attributes, schema.postInvoices);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  const isXml = (invoice) => (typeof invoice === 'string' && attributes.contentType.toLowerCase() === 'application/xml');

  const invoice = attributes.body;
  const invoiceSchemaValidationResult = isXml(invoice)
    ? await postInvoiceXml(invoice)
    : await postInvoiceJson(invoice);

  if (!invoiceSchemaValidationResult.valid) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.SCHEMA, invoiceSchemaValidationResult.errors)
    });
  }

  const invoicePeppolValidationResult = isXml(invoice)
    ? await validatePeppolXml(invoice)
    : await validatePeppolXml(await convertPaJsonToUblXml(normalizeToPaJson(invoice)));

  if (!invoicePeppolValidationResult.valid) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.PEPPOL, invoicePeppolValidationResult.result)
    });
  }

  // Validation should act as a pass trough for the request if it is valid.
  return req;
}

const validateBatchInvoiceRequest = async (req) => {
  const attributes = createAttributesObject(req);

  const baseValidationResult = await validate(attributes, schema.batchInvoices);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  const invoices = attributes.body.Invoices;

  const invoicesSchemaValidationResults = await Promise.all(invoices.map(postInvoiceJson));

  const schemaErrors = invoicesSchemaValidationResults.map((result) => {
    if (!result.valid) {
      return result.errors;
    }
    return undefined;
  }).filter((errs) => errs !== undefined).flat();

  if (schemaErrors.length > 0) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.SCHEMA, schemaErrors)
    });
  }

  const xmlInvoices = await Promise.all(invoices.map((invoice) => convertPaJsonToUblXml(normalizeToPaJson(invoice))));

  const invoicePeppolValidationResults = await Promise.all(xmlInvoices.map(validatePeppolXml));
  const invalidResults = invoicePeppolValidationResults.filter((res) => !res.valid);
  const errors = invalidResults.map((res) => res.result);

  if (invalidResults.length > 0) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.PEPPOL, errors)
    });
  }

  // We need to check that the ids(invoicenumbers) of invoices are unique within the request to not get weird result when
  // adding in batch.(since the id is the update key, ie invoice in db with matching id should be updated.)

  const invoiceIDs = invoices.map(getInvoiceIdFromPaJson);
  const idsAreUnique = new Set(invoiceIDs).size === invoiceIDs.length;

  if (!idsAreUnique) {
    throw new ValidationError({
      message: 'All invoice ids in batch request must be unique'
    });
  }

  // Validation should act as a pass trough for the request if it is valid.
  return req;
};

module.exports = {
  validateInvoiceRequest,
  validateBatchInvoiceRequest
};
