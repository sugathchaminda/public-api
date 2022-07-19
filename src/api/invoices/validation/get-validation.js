const { clean, validate } = require('../../../schemas/validation/validationHelper');
const schema = require('../../../schemas/validation/invoice-schema');
const ValidationError = require('../../../errors/validationError');
const {
  createValidationMetadata,
  validationTypes
} = require('../../../utils/errorHelper');

async function getInvoices(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit,
    offset: req.query?.offset,
    includeRead: req.query?.includeRead
  });

  const baseValidationResult = await validate(attributes, schema.getInvoices);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  return req;
}

async function readInvoices(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit
  });

  const baseValidationResult = await validate(attributes, schema.readInvoices);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  return req;
}

module.exports = {
  getInvoices,
  readInvoices
};
