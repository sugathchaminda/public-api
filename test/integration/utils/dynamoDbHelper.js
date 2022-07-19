const { ddbClient } = require('../../../src/libs/ddbClient');

const AUTH_KEY_TABLE_NAME = 'qip-local-public-api-auth-keys';

const createAuthKeyTable = async () => {
  const existingTables = (await ddbClient.listTables().promise()).TableNames;
  if (existingTables.find((table) => table === AUTH_KEY_TABLE_NAME)) {
    console.info(`table ${AUTH_KEY_TABLE_NAME} already exists in local db`);
  } else {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: 'regNo',
          AttributeType: 'S'
        },
        {
          AttributeName: 'party',
          AttributeType: 'S'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST', // NOTE only for local setup. On AWS we should probably use provisioned.
      KeySchema: [
        {
          AttributeName: 'regNo',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'party',
          KeyType: 'RANGE'
        }
      ],
      TableName: AUTH_KEY_TABLE_NAME
    };
    await ddbClient.createTable(params)
      .promise();
  }
};

module.exports = {
  createAuthKeyTable
};
