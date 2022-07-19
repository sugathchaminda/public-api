const request = require('supertest');
const fs = require('fs');
const { createAuthKey } = require('./utils/authHelper');
const { convertUblXmlToPaJson } = require('../../src/utils/paJsonHelper');
const { clearOutgoingOrders } = require('./utils/databaseHelper');
const { paJsonWithOneAdditionalDocumentReference } = require('../mockData/paJsonOrderTestData');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '5567321899';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

const baseXmlStringOrder = fs.readFileSync('./test/mockData/xml/order/base-example.xml').toString();
const baseOrderJson = async () => convertUblXmlToPaJson(baseXmlStringOrder);
const setIdOnUblJson = (json, id) => {
  const newJson = json;
  newJson.Order['cbc:ID'][0]._ = id;
  return newJson;
};

const validOrdersXml = fs.readdirSync('./test/mockData/xml/order/').map((file) => fs.readFileSync(`./test/mockData/xml/order/${file}`).toString());

describe('Common responses', () => {
  const endpoints = [`/transaction/${regNo}/orders/outgoing/batch`, `/transaction/${regNo}/orders/outgoing`];
  test.each(endpoints)('Returns 401 when no token in headers', async (endpoint) => {
    const res = await server
      .post(endpoint)
      .set('content-type', 'application/json')
      .send({});
    expect(res.status).toBe(401);
  });

  test.each(endpoints)('Returns 401 when invalid token in headers', async (endpoint) => {
    const res = await server
      .post(endpoint)
      .set('content-type', 'application/json')
      .set('Authorization', 'dummy_token')
      .send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /transaction/{regNo}/orders/outgoing/batch', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingOrders());

  test('Returns 200 when posting valid array of orders', async () => {
    const orders = [
      setIdOnUblJson(await baseOrderJson(), '1'),
      setIdOnUblJson(await baseOrderJson(), '2')
    ];
    const accessKey = await createAuthKey(regNo, 'local');
    const reqBody = { Orders: orders };
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(reqBody);
    expect(res.status).toBe(200);
  }, 40000);

  test('Return 409 when posting a duplicate order without overwrite flag in batch request', async () => {
    const order = setIdOnUblJson(await baseOrderJson(), '1');
    const orders = [order, setIdOnUblJson(await baseOrderJson(), '2')];
    const batchReq = { Orders: orders };
    const accessKey = await createAuthKey(regNo, 'local');

    const createRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);

    const duplicateRes = await server
      .post(`/transaction/${regNo}/orders/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(batchReq);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 40000);

  test('Return 200 when posting a duplicate order with overwrite flag in batch request', async () => {
    const order = setIdOnUblJson(await baseOrderJson(), '1');
    const orders = [order, setIdOnUblJson(await baseOrderJson(), '2')];
    const batchReq = { Orders: orders };
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);

    const duplicateRes = await server
      .post(`/transaction/${regNo}/orders/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(batchReq);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 40000);

  test('Returns 200 when posting orders that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject to batch', async () => {
    const orders = [paJsonWithOneAdditionalDocumentReference(regNo, '1'), paJsonWithOneAdditionalDocumentReference(regNo, '2')];
    const accessKey = await createAuthKey(regNo, 'local');
    const req = { Orders: orders };
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(req);
    expect(res.status).toBe(200);
  }, 40000);

  test('Returns 422 if the order does not conform to validation', async () => {
    const orders = [{ invalid: true }, setIdOnUblJson(await baseOrderJson(), '1')];
    const accessKey = await createAuthKey(regNo, 'local');
    const req = { Orders: orders };
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(req);
    expect(res.status).toBe(422);
  }, 40000);
});

describe('POST /transaction/{regNo}/orders/outgoing', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingOrders());

  test.each(validOrdersXml)('Returns 200 when posting a valid order', async (orderXml) => {
    const order = await convertUblXmlToPaJson(orderXml);
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    expect(res.status).toBe(200);
  }, 40000);

  test.each(validOrdersXml)('Returns 200 when posting a valid xml order', async (orderXml) => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/xml')
      .set('Authorization', accessKey)
      .send(orderXml);
    expect(res.status).toBe(200);
  }, 40000);

  test('Return 409 when posting a duplicate orders without overwrite flag', async () => {
    const order = await baseOrderJson();
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 40000);

  test('Return 200 when posting a duplicate order with overwrite flag', async () => {
    const order = await baseOrderJson();
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(order);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 40000);

  test('Returns 200 when posting orders that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject', async () => {
    const order = paJsonWithOneAdditionalDocumentReference(regNo);
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    expect(res.status).toBe(200);
  }, 40000); // Running locally the s3 uploads might take time if not emulating s3 in docker.

  test('Returns 422 if the order does not conform to validation', async () => {
    const order = { invalid: true };
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/orders/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(order);
    expect(res.status).toBe(422);
  }, 40000);
});
