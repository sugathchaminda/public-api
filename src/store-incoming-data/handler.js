const { validate } = require('../schemas/validation/validationHelper');
const { storeIncomingDataEvent } = require('../schemas/validation/sqs-event-schema');
const ValidationError = require('../errors/validationError');
const { saveIncomingInvoice } = require('./incoming-invoice-handler');
const { saveIncomingOrderResponse } = require('./incoming-order-response-handler');

const parseEvent = async (eventRecord) => {
  const messageType = eventRecord.messageAttributes.messageType.stringValue;

  return messageType;
};

exports.run = async (event) => {
  const eventValidationResult = await validate(event, storeIncomingDataEvent);

  if (eventValidationResult.error) {
    throw new ValidationError({
      metadata: eventValidationResult.error
    });
  }

  const messageType = await parseEvent(event.Records[0]);
  if (messageType === 'incomingorder' || messageType === 'outgoingorder') {
    saveIncomingOrderResponse();
  } else {
    saveIncomingInvoice();
  }
};
