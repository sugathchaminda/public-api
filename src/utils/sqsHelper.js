const uuid = require('uuid');
const { sqsClient } = require('../libs/sqsClient');
const { writeToS3 } = require('./s3Helper');

function getBytes(data) {
  // SQS Adds data as stringified
  return Buffer.byteLength(JSON.stringify(data), 'utf8');
}

const createMessageAttributes = (regNo, invoiceUuid, payloadLocation, relaying = 'true') => ({
  regNo: {
    DataType: 'String',
    StringValue: regNo
  },
  invoiceDBUUID: {
    DataType: 'String',
    StringValue: invoiceUuid
  },
  payloadLocation: {
    DataType: 'String',
    StringValue: payloadLocation
  },
  relaying: {
    DataType: 'String',
    StringValue: relaying
  }
});

const getMessageBody = (messageString, payloadLocation, s3key) => {
  if (payloadLocation === 'S3') {
    return JSON.stringify({
      S3: {
        key: s3key,
        bucket: process.env.S3_EINVOICE_ZIP
      }
    });
  }
  return messageString;
};

const sendMessageToSqs = async (message, regNo, invoiceUuid, queueUrl, relaying = 'true') => {
  const messageString = JSON.stringify(message);
  const payloadLocation = (getBytes(messageString) > 262144) ? 'S3' : 'SQS';
  const s3key = `sqs-${uuid.v4()}.tmp`;
  if (payloadLocation === 'S3') {
    await writeToS3(messageString, s3key, process.env.S3_EINVOICE_ZIP);
  }
  const messageBody = getMessageBody(messageString, payloadLocation, s3key);
  const messageAttributes = createMessageAttributes(regNo, invoiceUuid, payloadLocation, relaying);
  const params = {
    MessageBody: messageBody,
    MessageAttributes: messageAttributes,
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };

  return sqsClient.sendMessage(params).promise();
};

const getQueueUrl = () => {
  // NOTE this is a fix to override the SSM variable since we cannot control that per environment(that i know). Since we want to
  // use localstack on localhost, or on container name we need to be able to set the full queue url as env variable.
  if (process.env.IS_OFFLINE || process.env.LOCALSTACK_ENDPOINT) {
    return process.env.LOCAL_SQS_PUT_PUBLICAPI_QUEUE_NAME || process.env.SQS_PUT_PUBLICAPI_QUEUE_NAME;
  }
  return process.env.SQS_PUT_PUBLICAPI_QUEUE_NAME;
};

module.exports = { sendMessageToSqs, getQueueUrl };
