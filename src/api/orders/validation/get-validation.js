const { clean, validate } = require('../../../schemas/validation/validationHelper');
const schema = require('../../../schemas/validation/order-schema');
const ValidationError = require('../../../errors/validationError');
const { createOrderValidationMetadata, validationTypes } = require('../../../utils/errorHelper');

async function getOrders(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit,
    offset: req.query?.offset,
    includeRead: req.query?.includeRead
  });
  const baseValidationResult = await validate(attributes, schema.getOrders);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  return req;
}

async function readOrders(req) {
  const attributes = clean({
    accountRegNo: req.params?.accountRegNo,
    contentType: req.headers?.['content-type'],
    limit: req.query?.limit
  });
  const baseValidationResult = await validate(attributes, schema.readOrders);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  return req;
}

module.exports = {
  getOrders,
  readOrders
};
