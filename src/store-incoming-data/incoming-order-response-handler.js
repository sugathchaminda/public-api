const { validate } = require('../schemas/validation/validationHelper');
const { incomingOrderResponseS3Reference } = require('../schemas/validation/sqs-event-schema');
const { getFromS3 } = require('../utils/s3Helper');
const ValidationError = require('../errors/validationError');
const { addNamespacesToPaJson } = require('../utils/paJsonHelper');
const { createIncomingOrderResponse } = require('../utils/dbHelper');
const { validateUblOrderJsonFunction } = require('../libs/schemaValidators');
const { convertOrderPaJsonToUblJson } = require('../utils/ublJsonHelper');
const ublNamespaceMap = require('../utils/ubl21NamespaceMap');
const {
  storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3
} = require('../utils/additionalDocumentReferenceHelper');

const getOrderFromS3 = async (s3Reference) => {
  const s3ReferenceValidationResult = await validate(s3Reference, incomingOrderResponseS3Reference);
  if (s3ReferenceValidationResult.error) {
    console.error('incoming-order-response#handler.run', s3ReferenceValidationResult.error);
    throw new ValidationError({
      metadata: s3ReferenceValidationResult.error
    });
  }
  const s3OrderResponse = await getFromS3(s3Reference.key, s3Reference.bucket);
  if (!s3OrderResponse?.Body) throw new Error('incoming-order-response#handler.run: event references body on S3 but no object body was found');
  return JSON.parse(s3OrderResponse.Body);
};

const parseEvent = async (eventRecord) => {
  const regNo = eventRecord.messageAttributes.regNo.stringValue;
  const payloadLocation = eventRecord.messageAttributes.payloadLocation.stringValue.toUpperCase();
  const body = JSON.parse(eventRecord.body);
  if (payloadLocation === 'S3') {
    const s3Order = await getOrderFromS3(body);
    return { order: s3Order, regNo };
  }
  return { order: body, regNo };
};

const createOrderResponse = async (orderWithNamespaces, regNo) => {
  const { binaryObjectReferences, orderJsonWithBinaryObjectReferences } = await storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3(orderWithNamespaces);
  try {
    return createIncomingOrderResponse(orderJsonWithBinaryObjectReferences, regNo);
  } catch (err) {
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const saveIncomingOrderResponse = async (event) => {
  const { order, regNo } = await parseEvent(event.Records[0]);

  // We assume that the order is passed as PA-json, but it can and can not contain namespaces. therefore we add them if missing.
  const orderWithNamespaces = addNamespacesToPaJson(order, ublNamespaceMap);
  // validate order
  const validOrder = await validateUblOrderJsonFunction(convertOrderPaJsonToUblJson(orderWithNamespaces));
  if (!validOrder) {
    console.error('incoming-order-response#handler.run', 'invalid order received from queue');
    console.error('incoming-order-response#handler.run#Order', orderWithNamespaces);
    console.error('incoming-order-response#handler.run#errors', validateUblOrderJsonFunction.errors);
    throw new ValidationError({
      metadata: validateUblOrderJsonFunction.errors
    });
  }

  const createOrderResponseInMdsDbResult = await createOrderResponse(orderWithNamespaces, regNo);
  if (createOrderResponseInMdsDbResult.uuid) {
    return {
      message: 'incoming order response stored in mdsdb',
      order: createOrderResponseInMdsDbResult.order
    };
  }

  // unlikely that we should ever end up here.
  throw new Error('incoming-order-response#handler.run', 'unexpected error storing order, did not create order in db');
};

module.exports = { saveIncomingOrderResponse };
