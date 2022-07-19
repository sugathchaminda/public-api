const { sqsClient } = require('../../../src/libs/sqsClient');

const createQueue = async (name) => sqsClient.createQueue({
  QueueName: name
}).promise();

module.exports = {
  createQueue
};
