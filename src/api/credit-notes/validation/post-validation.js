const {
  clean,
  validate
} = require('../../../schemas/validation/validationHelper');
const {
  convertCreditNoteUblXmlToUblJson,
  normalizeCreditNoteToUblJson
} = require('../../../utils/ublJsonHelper');
const schema = require('../../../schemas/validation/credit-note-schema');
const ValidationError = require('../../../errors/validationError');

const { validateUblCreditNoteJsonFunction } = require('../../../libs/schemaValidators');
const {
  getCreditNoteIdFromPaJson,
  normalizeCreditNoteToPaJson,
  convertPaJsonToUblXml
} = require('../../../utils/paJsonHelper');
const { createCreditNoteValidationMetadata, validationTypes } = require('../../../utils/errorHelper');
const { validatePeppolXml } = require('../../../utils/peppolValidationHelper');

const validateCreditNoteUbl21Json = async (json) => {
  const valid = validateUblCreditNoteJsonFunction(json);
  const { errors } = validateUblCreditNoteJsonFunction;
  return {
    valid,
    errors
  };
};

const postCreditNoteJson = async (creditNote) => validateCreditNoteUbl21Json(normalizeCreditNoteToUblJson(creditNote));

const postCreditNoteXml = async (creditNote) => {
  const ubl21JsonFromXml = await convertCreditNoteUblXmlToUblJson(creditNote);
  return validateCreditNoteUbl21Json(ubl21JsonFromXml);
};

const createAttributesObject = (req) => clean({
  accountRegNo: req.params.accountRegNo,
  contentType: req.headers['content-type'],
  query: req.query,
  body: req.body
});

async function validateCreditNoteRequest(req) {
  const attributes = createAttributesObject(req);
  const baseValidationResult = await validate(attributes, schema.postCreditNotes);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  const isXml = (creditNote) => (typeof creditNote === 'string' && attributes.contentType.toLowerCase() === 'application/xml');
  const creditNote = attributes.body;
  const creditNoteSchemaValidationResult = isXml(creditNote)
    ? await postCreditNoteXml(creditNote)
    : await postCreditNoteJson(creditNote);
  if (!creditNoteSchemaValidationResult.valid) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.SCHEMA, creditNoteSchemaValidationResult.errors)
    });
  }
  const creditNotePeppolValidationResult = isXml(creditNote)
    ? await validatePeppolXml(creditNote, 'creditNote')
    : await validatePeppolXml(await convertPaJsonToUblXml(normalizeCreditNoteToPaJson(creditNote)), 'creditNote');
  if (!creditNotePeppolValidationResult.valid) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.PEPPOL, creditNotePeppolValidationResult.result)
    });
  }
  return req;
}

const validateBatchCreditNoteRequest = async (req) => {
  const attributes = createAttributesObject(req);
  const baseValidationResult = await validate(attributes, schema.batchCreditNotes);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  const creditNotes = attributes.body.CreditNotes;
  const creditNotesSchemaValidationResults = await Promise.all(creditNotes.map(postCreditNoteJson));
  const schemaErrors = creditNotesSchemaValidationResults.map((result) => {
    if (!result.valid) {
      return result.errors;
    }
    return undefined;
  }).filter((errs) => errs !== undefined).flat();

  if (schemaErrors.length > 0) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.SCHEMA, schemaErrors)
    });
  }

  const xmlCreditNotes = await Promise.all(creditNotes.map((creditNote) => convertPaJsonToUblXml(normalizeCreditNoteToPaJson(creditNote))));
  const creditNotePeppolValidationResults = await Promise.all(xmlCreditNotes.map((xmlCreditNote) => validatePeppolXml(xmlCreditNote, 'creditNote')));
  const invalidResults = creditNotePeppolValidationResults.filter((res) => !res.valid);
  const errors = invalidResults.map((res) => res.result);

  if (invalidResults.length > 0) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.PEPPOL, errors)
    });
  }
  const creditNoteIDs = creditNotes.map(getCreditNoteIdFromPaJson);
  const idsAreUnique = new Set(creditNoteIDs).size === creditNoteIDs.length;

  if (!idsAreUnique) {
    throw new ValidationError({
      message: 'All credit note ids in batch request must be unique'
    });
  }
  return req;
};

module.exports = {
  validateCreditNoteRequest,
  validateBatchCreditNoteRequest
};
