const crypto = require('crypto');
const { ddbClient } = require('../libs/ddbClient');

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt,
    passwordHash: value
  };
};

const storeKey = async (regNo, party, created, uuid) => {
  const params = {
    TableName: `qip-${process.env.LAMBDA_STAGE}-public-api-auth-keys`,
    Item: {
      regNo: { S: regNo },
      party: { S: party },
      uuid: { S: uuid },
      createdDate: { S: created }
    }
  };

  return ddbClient.putItem(params).promise();
};

const updateKey = async (regNo, party, created, uuid) => {
  const params = {
    TableName: `qip-${process.env.LAMBDA_STAGE}-public-api-auth-keys`,
    Key: {
      regNo: { S: regNo },
      party: { S: party }
    },
    UpdateExpression: 'set #id = :u, createdDate = :d',
    ExpressionAttributeValues: {
      ':u': { S: uuid },
      ':d': { S: created }
    },
    ExpressionAttributeNames: {
      '#id': 'uuid'
    },
    ReturnValues: 'UPDATED_NEW'
  };

  return ddbClient.updateItem(params).promise();
};

const ddbKey = async (regNo, party) => {
  const params = {
    TableName: `qip-${process.env.LAMBDA_STAGE}-public-api-auth-keys`,
    Key: {
      regNo: { S: regNo },
      party: { S: party }
    }
  };
  return ddbClient.getItem(params).promise();
};

function genKey(regNo, date, salt) {
  // We use regNo + supplierId + date as "password" and "salt" it by the UUID in DynamoDB
  const passwordData = sha512(regNo + date, salt);
  return passwordData.passwordHash;
}

const validateKey = async (regNo, party, key) => {
  const ddbRet = await ddbKey(regNo, party);

  if (ddbRet.Item === undefined) {
    // No key found for regNo party combination.
    return false;
  }

  const generatedKey = genKey(regNo, ddbRet.Item.createdDate.S, ddbRet.Item.uuid.S);

  return (key === generatedKey);
};

module.exports = {
  ddbKey,
  genKey,
  validateKey,
  storeKey,
  updateKey
};
