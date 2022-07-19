const { clean, validate } = require('../../../schemas/validation/validationHelper');
const schema = require('../../../schemas/validation/credit-note-schema');
const ValidationError = require('../../../errors/validationError');
const { createCreditNoteValidationMetadata, validationTypes } = require('../../../utils/errorHelper');

async function getCreditNotes(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit,
    offset: req.query?.offset,
    includeRead: req.query?.includeRead
  });
  const baseValidationResult = await validate(attributes, schema.getCreditNotes);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  return req;
}

async function readCreditNotes(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit
  });
  const baseValidationResult = await validate(attributes, schema.readCreditNotes);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createCreditNoteValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  return req;
}

module.exports = {
  getCreditNotes,
  readCreditNotes
};
