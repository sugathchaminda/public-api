const request = require('supertest');
const { createAuthKey } = require('./utils/authHelper');
const {
  seedIncomingInvoices,
  clearIncomingInvoices
} = require('./utils/databaseHelper');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '123123123';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

describe('GET /transaction/{regNo}/invoices/incoming', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .send();

    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('Authorization', 'dummytoken')
      .send();

    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();

    expect(res.status).toBe(200);
  });

  test('When invoices in incoming invoice table valid request returns invoices', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();

    const invoices = res.body?.data;
    expect(invoices.length).toBe(2);
    await clearIncomingInvoices();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();

    const invoices = res.body?.data;
    expect(invoices.length).toBe(1);
    await clearIncomingInvoices();
  });

  test('it takes skip into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(3, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '3', skip: '1' })
      .send();
    const invoices = res.body?.data;

    expect(invoices.length).toBe(2);
    await clearIncomingInvoices();
  });

  test('it takes includeRead into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(2, regNo, orgNo, true);
    await seedIncomingInvoices(1, regNo, orgNo, false);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ includeRead: true })
      .send();

    const invoices = res.body?.data;
    expect(invoices.length).toBe(3);
    await clearIncomingInvoices();
  });
});

describe('GET /transaction/{regNo}/invoices/incoming/readInvoices', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming/readInvoices`)
      .set('accept', 'application/json;version = 1')
      .send();

    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming/readInvoices`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', 'dummytoken')
      .send();

    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming/readInvoices`)
      .set('Authorization', accessKey)
      .send();

    expect(res.status).toBe(200);
  });

  test('When invoices in incoming invoice table valid request returns invoices', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming/readInvoices`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();

    const invoices = res.body?.data;
    expect(invoices.length).toBe(2);
    await clearIncomingInvoices();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingInvoices();
    await seedIncomingInvoices(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/invoices/incoming/readInvoices`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();

    const invoices = res.body?.data;
    expect(invoices.length).toBe(1);
    await clearIncomingInvoices();
  });
});
