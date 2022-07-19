const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const { genKey } = require('../../../src/utils/authUtils');

const endpoint = process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566';
const config = { endpoint, region: 'eu-west-1' };
const ddb = new aws.DynamoDB(config);

const createAuthKey = async (regNo, stage) => {
  const party = regNo;
  const created = DateTime.utc().toString();
  const uuid = uuidv4();
  const params = {
    TableName: `qip-${stage}-public-api-auth-keys`,
    Item: {
      regNo: { S: regNo },
      party: { S: party },
      uuid: { S: uuid },
      createdDate: { S: created }
    }
  };

  // Call DynamoDB to add the item to the table
  await ddb.putItem(params).promise();
  return genKey(regNo, created, uuid);
};

module.exports = { createAuthKey };
