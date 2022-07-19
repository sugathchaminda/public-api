const aws = require('aws-sdk');

const REGION = 'eu-west-1';
aws.config.update({ region: REGION });

const lambdaClient = new aws.Lambda();

lambdaClient.invoke();

module.exports = { lambdaClient };
