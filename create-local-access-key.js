const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const { genKey } = require('./src/utils/authUtils');

const config = { endpoint: 'http://localhost:4566', region: 'eu-west-1' };
const ddb = new aws.DynamoDB(config);

const storeKey = async (regNo, party, created, uuid, dynamoDbClient, stage) => {
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
  return dynamoDbClient.putItem(params).promise();
};

(async function main() {
  console.log('CREATING LOCAL ACCESS KEY');
  const args = process.argv.slice(2);
  const regNo = args[0];

  if (regNo === undefined) {
    console.log('USAGE: node create-local-access-key <REGNO> <PARTY> OR: npm create-local-access-key -- <REGNO> <PARTY>');
    return;
  }

  const party = args[1] || regNo;
  const created = DateTime.utc().toString();
  const uuid = uuidv4();
  await storeKey(regNo, party, created, uuid, ddb, 'local');
  const key = genKey(regNo, created, uuid);
  console.log(`ACCESS KEY: ${key}`);
}());
