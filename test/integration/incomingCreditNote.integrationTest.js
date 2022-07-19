const request = require('supertest');
const { createAuthKey } = require('./utils/authHelper');
const {
  seedIncomingCreditNotes,
  clearIncomingCreditNotes
} = require('./utils/databaseHelper');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '123123178';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

describe('GET /transaction/{regNo}/creditNotes/incoming', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', 'dummy_token')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    expect(res.status).toBe(200);
  });

  test('When credit notes in incoming credit nite table valid request returns credit notes', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(2);
    await clearIncomingCreditNotes();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();
    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(1);
    await clearIncomingCreditNotes();
  });

  test('it takes skip into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(3, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '3', skip: '1' })
      .send();
    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(2);
    await clearIncomingCreditNotes();
  });

  test('it takes includeRead into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(2, regNo, orgNo, true);
    await seedIncomingCreditNotes(1, regNo, orgNo, false);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ includeRead: true })
      .send();
    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(3);
    await clearIncomingCreditNotes();
  });
});

describe('GET /transaction/{regNo}/creditNotes/incoming/readCreditNotes', () => {
  test('Returns 401 when no token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming/readCreditNotes`)
      .set('accept', 'application/json;version = 1')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 401 when invalid token in headers', async () => {
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming/readCreditNotes`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', 'dummy_token')
      .send();
    expect(res.status).toBe(401);
  });

  test('Returns 200 with valid request', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming/readCreditNotes`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    expect(res.status).toBe(200);
  });

  test('When credit notes in incoming credit note table valid request returns credit notes', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming/readCreditNotes`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send();
    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(2);
    await clearIncomingCreditNotes();
  });

  test('It takes limit into account', async () => {
    const accessKey = await createAuthKey(regNo, 'local');
    await clearIncomingCreditNotes();
    await seedIncomingCreditNotes(2, regNo, orgNo);
    const res = await server
      .get(`/transaction/${regNo}/creditNotes/incoming/readCreditNotes`)
      .set('accept', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .query({ limit: '1' })
      .send();

    const creditNotes = res.body?.data;
    expect(creditNotes.length).toBe(1);
    await clearIncomingCreditNotes();
  });
});
