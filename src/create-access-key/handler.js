const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const { genKey } = require('../utils/authUtils');
const { ddbKey, storeKey, updateKey } = require('../utils/authUtils');

/*
* This lambda can be used as a util to create access keys on aws when testing the api.
* To create an access-key invoke the function in the stage you want to test.
*
* serverless invoke --function create-access-key --stage [TARGET STAGE] --data '{"regNo": "[REGNO]", "party": "[PARTYREGNO]"}'
*
* To invoke the function you must have the aws-cli installed and have a profile with access rights to invoke the
* lambdas on the stage you want to create the access-key for.
*
* lambda could also be consumed by other services on aws that need to create access keys for the public api.
* */

exports.run = async (event) => {
  const { regNo, party } = event;

  if (!regNo || !party) return 'please provide regNo and party as: {regNo: [regno], party: [party]}';

  const created = DateTime.utc().toString();
  const uuid = uuidv4();
  const existingKey = await ddbKey(regNo, party);

  if (existingKey.Item) {
    await updateKey(regNo, party, created, uuid);
  } else {
    await storeKey(regNo, party, created, uuid);
  }

  return {
    statusCode: 200,
    body: {
      accessKey: genKey(regNo, created, uuid)
    },
    headers: {
      'Content-type': 'application/json'
    }
  };
};
