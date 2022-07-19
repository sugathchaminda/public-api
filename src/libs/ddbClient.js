const aws = require('aws-sdk');
// Set the AWS Region.
const REGION = 'eu-west-1';
aws.config.update({ region: REGION });
let config = {};
// Create an Amazon DynamoDB service client object.
if (process.env.IS_OFFLINE || process.env.LOCALSTACK_ENDPOINT) {
  const endpoint = process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566';
  config = { endpoint };
}

const ddbClient = new aws.DynamoDB(config);
module.exports = { ddbClient };
