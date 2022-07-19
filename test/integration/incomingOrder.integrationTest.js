const request = require('supertest');
const { createAuthKey } = require('./utils/authHelper');
const {
  seedIncomingOrders,
  clearIncomingOrders
} = require('./utils/databaseHelper');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '123123179';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

describe('GET /transaction/{regNo}/orders/incoming', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', 'dummy_token')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    expect(res.status).toBe(200);
  });

  test('When orders in incoming order table valid request returns orders', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    const orders = res.body?.data;
    expect(orders.length).toBe(2);
    await clearIncomingOrders();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();
    const orders = res.body?.data;
    expect(orders.length).toBe(1);
    await clearIncomingOrders();
  });

  test('it takes skip into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(3, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '3', skip: '1' })
      .send();
    const orders = res.body?.data;
    expect(orders.length).toBe(2);
    await clearIncomingOrders();
  });

  test('it takes includeRead into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(2, regNo, orgNo, true);
    await seedIncomingOrders(1, regNo, orgNo, false);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ includeRead: true })
      .send();
    const orders = res.body?.data;
    expect(orders.length).toBe(3);
    await clearIncomingOrders();
  });
});

describe('GET /transaction/{regNo}/orders/incoming/readOrders', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming/readOrders`)
      .set('accept', 'application/json;version = 1')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming/readOrders`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', 'dummy_token')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming/readOrders`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    expect(res.status).toBe(200);
  });

  test('When orders in incoming order table valid request returns orders', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming/readOrders`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    const orders = res.body?.data;
    expect(orders.length).toBe(2);
    await clearIncomingOrders();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingOrders();
    await seedIncomingOrders(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/orders/incoming/readOrders`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();

    const orders = res.body?.data;
    expect(orders.length).toBe(1);
    await clearIncomingOrders();
  });
});
