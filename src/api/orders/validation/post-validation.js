const {
  clean,
  validate
} = require('../../../schemas/validation/validationHelper');
const {
  convertOrderUblXmlToUblJson,
  normalizeOrderToUblJson
} = require('../../../utils/ublJsonHelper');
const schema = require('../../../schemas/validation/order-schema');
const ValidationError = require('../../../errors/validationError');

const { validateUblOrderJsonFunction } = require('../../../libs/schemaValidators');
const {
  getOrderIdFromPaJson,
  normalizeOrderToPaJson,
  convertPaJsonToUblXml
} = require('../../../utils/paJsonHelper');
const { createOrderValidationMetadata, validationTypes } = require('../../../utils/errorHelper');
const { validatePeppolXml } = require('../../../utils/peppolValidationHelper');

const validateOrderUbl21Json = async (json) => {
  const valid = validateUblOrderJsonFunction(json);
  const { errors } = validateUblOrderJsonFunction;
  return {
    valid,
    errors
  };
};

const postOrderJson = async (order) => validateOrderUbl21Json(normalizeOrderToUblJson(order));

const postOrderXml = async (order) => {
  const ubl21JsonFromXml = await convertOrderUblXmlToUblJson(order);
  return validateOrderUbl21Json(ubl21JsonFromXml);
};

const createAttributesObject = (req) => clean({
  accountRegNo: req.params.accountRegNo,
  contentType: req.headers['content-type'],
  query: req.query,
  body: req.body
});

async function validateOrderRequest(req) {
  const attributes = createAttributesObject(req);
  const baseValidationResult = await validate(attributes, schema.postOrders);
  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }
  const isXml = (order) => (typeof order === 'string' && attributes.contentType.toLowerCase() === 'application/xml');
  const order = attributes.body;
  const orderSchemaValidationResult = isXml(order)
    ? await postOrderXml(order)
    : await postOrderJson(order);
  if (!orderSchemaValidationResult.valid) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.SCHEMA, orderSchemaValidationResult.errors)
    });
  }
  const orderPeppolValidationResult = isXml(order)
    ? await validatePeppolXml(order, 'order')
    : await validatePeppolXml(await convertPaJsonToUblXml(normalizeOrderToPaJson(order)), 'order');
  if (!orderPeppolValidationResult.valid) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.PEPPOL, orderPeppolValidationResult.result)
    });
  }
  return req;
}

const validateBatchOrderRequest = async (req) => {
  const attributes = createAttributesObject(req);
  const baseValidationResult = await validate(attributes, schema.batchOrders);

  if (baseValidationResult.error) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.BASE, baseValidationResult.error)
    });
  }

  const orders = attributes.body.Orders;
  const ordersSchemaValidationResults = await Promise.all(orders.map(postOrderJson));
  const schemaErrors = ordersSchemaValidationResults.map((result) => {
    if (!result.valid) {
      return result.errors;
    }
    return undefined;
  }).filter((errs) => errs !== undefined).flat();

  if (schemaErrors.length > 0) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.SCHEMA, schemaErrors)
    });
  }

  const xmlOrders = await Promise.all(orders.map((order) => convertPaJsonToUblXml(normalizeOrderToPaJson(order))));
  const orderPeppolValidationResults = await Promise.all(xmlOrders.map((xmlOrder) => validatePeppolXml(xmlOrder, 'order')));
  const invalidResults = orderPeppolValidationResults.filter((res) => !res.valid);
  const errors = invalidResults.map((res) => res.result);

  if (invalidResults.length > 0) {
    throw new ValidationError({
      metadata: createOrderValidationMetadata(validationTypes.PEPPOL, errors)
    });
  }
  const orderIDs = orders.map(getOrderIdFromPaJson);
  const idsAreUnique = new Set(orderIDs).size === orderIDs.length;

  if (!idsAreUnique) {
    throw new ValidationError({
      message: 'All order ids in batch request must be unique'
    });
  }
  return req;
};

module.exports = {
  validateOrderRequest,
  validateBatchOrderRequest
};
