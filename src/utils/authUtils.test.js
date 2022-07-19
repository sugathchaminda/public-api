const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');
const { ddbClient } = require('../libs/ddbClient');
const {
  ddbKey,
  genKey,
  validateKey,
  storeKey,
  updateKey
} = require('./authUtils');

jest.mock('../libs/ddbClient');

// 2.x version of aws-sdk uses callbacks, but they can be turned into prmosises using
// method on the class instance that is returned from the functions.
// Mock wrapper to not have to use actual aws-sdk internal classes.
class MockAWSRequest {
  constructor(result) {
    this.result = result;
  }

  promise() {
    return this.result;
  }
}

describe('ddbKey', () => {
  test('returns key if exists in db', async () => {
    const regNo = 'regno123';
    const party = regNo;
    const created = DateTime.utc().toString();
    const uuid = uuidv4();
    ddbClient.getItem.mockReturnValue(new MockAWSRequest({
      Item: {
        regNo: { S: regNo }, party: { S: party }, uuid: { S: uuid }, createdDate: { S: created }
      }
    }));
    const key = await ddbKey('123', '123');
    expect(key.Item).toBeDefined();
  });

  test('returns empty object if no key in db', async () => {
    ddbClient.getItem.mockReturnValue(new MockAWSRequest({}));
    const key = await ddbKey('123', '123');
    expect(key.Item).toBeUndefined();
  });
});

describe('genKey', () => {
  test('it generates a key', () => {
    const generatedKey = genKey('regno', DateTime.utc().toString(), uuidv4());
    expect(generatedKey).toBeDefined();
    expect(typeof generatedKey).toBe('string');
  });
});

describe('validateKey', () => {
  test('it validates to true for valid key', async () => {
    const regNo = 'regno123';
    const party = regNo;
    const created = DateTime.utc().toString();
    const uuid = uuidv4();
    ddbClient.getItem.mockReturnValue(new MockAWSRequest({
      Item: {
        regNo: { S: regNo }, party: { S: party }, uuid: { S: uuid }, createdDate: { S: created }
      }
    }));
    const key = genKey(regNo, created, uuid);
    const res = await validateKey(regNo, party, key);
    expect(res).toBe(true);
  });

  test('it validates to false for invalid key', async () => {
    const regNo = 'regno123';
    const party = regNo;
    const created = DateTime.utc().toString();
    const uuid = uuidv4();
    const otherUuid = uuidv4();
    ddbClient.getItem.mockReturnValue(new MockAWSRequest({
      Item: {
        regNo: { S: regNo }, party: { S: party }, uuid: { S: uuid }, createdDate: { S: created }
      }
    }));
    const key = genKey(regNo, created, otherUuid);
    const res = await validateKey(regNo, party, key);
    expect(res).toBe(false);
  });
});

describe('storeKey', () => {
  test('it stores a new key in the db', async () => {
    ddbClient.putItem.mockReturnValue(new MockAWSRequest('success'));
    const spy = jest.spyOn(ddbClient, 'putItem');
    await storeKey('regNo123', 'regNo123', DateTime.utc().toString(), uuidv4());
    expect(spy).toBeCalledTimes(1);
  });
});

describe('updateKey', () => {
  test('it updates an existing key in the db', async () => {
    ddbClient.updateItem.mockReturnValue(new MockAWSRequest('success'));
    const spy = jest.spyOn(ddbClient, 'updateItem');
    await updateKey('regNo123', 'regNo123', DateTime.utc().toString(), uuidv4());
    expect(spy).toBeCalledTimes(1);
  });
});
