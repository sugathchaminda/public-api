const Joi = require('joi');

const storeIncomingDataEvent = () => {
  return Joi.object({
    Records: Joi.array().min(1).max(1).items({
      messageId: Joi.string(),
      receiptHandle: Joi.string(),
      attributes: Joi.object(),
      messageAttributes: Joi.object({
        regNo: Joi.object().required(),
        messageType: Joi.object().required(),
        payloadLocation: Joi.object({
          stringValue: Joi.string().valid('s3','sqs','S3', 'SQS')
        }).required(),
      }),
      body: Joi.string().required()
    })
  })
}

const incomingInvoiceS3Reference = () => {
  return Joi.object({
    bucket: Joi.string().required(),
    key: Joi.string().required()
  })
}

const incomingOrderResponseS3Reference = () => {
  return Joi.object({
    bucket: Joi.string().required(),
    key: Joi.string().required()
  })
}

module.exports = {
  storeIncomingDataEvent,
  incomingInvoiceS3Reference,
  incomingOrderResponseS3Reference
}
