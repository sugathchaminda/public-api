const request = require('supertest');
const fs = require('fs');
const { createAuthKey } = require('./utils/authHelper');
const { convertUblXmlToPaJson } = require('../../src/utils/paJsonHelper');
const { clearOutgoingCreditNotes } = require('./utils/databaseHelper');
const { paJsonWithOneAdditionalDocumentReference } = require('../mockData/paJsonCreditNoteTestData');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '5567321799';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

const baseXmlStringCreditNote = fs.readFileSync('./test/mockData/xml/credit-note/base-example.xml').toString();
const baseCreditNoteJson = async () => convertUblXmlToPaJson(baseXmlStringCreditNote);
const setIdOnUblJson = (json, id) => {
  const newJson = json;
  newJson.CreditNote['cbc:ID'][0]._ = id;
  return newJson;
};

const validCreditNotesXml = fs.readdirSync('./test/mockData/xml/credit-note/')
  .map((file) => fs.readFileSync(`./test/mockData/xml/credit-note/${file}`).toString());

describe('Common responses', () => {
  const endpoints = [`/transaction/${regNo}/creditNotes/outgoing/batch`, `/transaction/${regNo}/creditNotes/outgoing`];
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

describe('POST /transaction/{regNo}/creditNotes/outgoing/batch', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingCreditNotes());

  test('Returns 200 when posting valid array of credit notes', async () => {
    const creditNotes = [
      setIdOnUblJson(await baseCreditNoteJson(), '3'),
      setIdOnUblJson(await baseCreditNoteJson(), '4')
    ];
    const accessKey = await createAuthKey(regNo, 'local');
    const reqBody = { CreditNotes: creditNotes };
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(reqBody);
    expect(res.status).toBe(200);
  }, 60000);

  test('Return 409 when posting a duplicate credit note without overwrite flag in batch request', async () => {
    const creditNote = setIdOnUblJson(await baseCreditNoteJson(), '5');
    const creditNotes = [creditNote, setIdOnUblJson(await baseCreditNoteJson(), '2')];
    const batchReq = { CreditNotes: creditNotes };
    const accessKey = await createAuthKey(regNo, 'local');

    const createRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);

    const duplicateRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(batchReq);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 60000);

  test('Return 200 when posting a duplicate credit note with overwrite flag in batch request', async () => {
    const creditNote = setIdOnUblJson(await baseCreditNoteJson(), '1');
    const creditNotes = [creditNote, setIdOnUblJson(await baseCreditNoteJson(), '2')];
    const batchReq = { CreditNotes: creditNotes };
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);

    const duplicateRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(batchReq);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 40000);

  test('Returns 200 when posting credit notes that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject to batch', async () => {
    const creditNotes = [paJsonWithOneAdditionalDocumentReference(regNo, '1'), paJsonWithOneAdditionalDocumentReference(regNo, '2')];
    const accessKey = await createAuthKey(regNo, 'local');
    const req = { CreditNotes: creditNotes };
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(req);
    expect(res.status).toBe(200);
  }, 40000);

  test('Returns 422 if the credit note does not conform to validation', async () => {
    const creditNotes = [{ invalid: true }, setIdOnUblJson(await baseCreditNoteJson(), '1')];
    const accessKey = await createAuthKey(regNo, 'local');
    const req = { CreditNotes: creditNotes };
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(req);
    expect(res.status).toBe(422);
  }, 40000);
});

describe('POST /transaction/{regNo}/creditNotes/outgoing', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingCreditNotes());

  test.each(validCreditNotesXml)('Returns 200 when posting a valid credit note', async (creditNoteXml) => {
    const creditNote = await convertUblXmlToPaJson(creditNoteXml);
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    expect(res.status).toBe(200);
  }, 40000);

  test.each(validCreditNotesXml)('Returns 200 when posting a valid xml credit note', async (creditNoteXml) => {
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/xml')
      .set('Authorization', accessKey)
      .send(creditNoteXml);
    expect(res.status).toBe(200);
  }, 40000);

  test('Return 409 when posting a duplicate credit notes without overwrite flag', async () => {
    const creditNote = await baseCreditNoteJson();
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 40000);

  test('Return 200 when posting a duplicate credit note with overwrite flag', async () => {
    const creditNote = await baseCreditNoteJson();
    const accessKey = await createAuthKey(regNo, 'local');
    const createRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(creditNote);
    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 40000);

  test('Returns 200 when posting credit notes that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject', async () => {
    const creditNote = paJsonWithOneAdditionalDocumentReference(regNo);
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    expect(res.status).toBe(200);
  }, 40000); // Running locally the s3 uploads might take time if not emulating s3 in docker.

  test('Returns 422 if the credit note does not conform to validation', async () => {
    const creditNote = { invalid: true };
    const accessKey = await createAuthKey(regNo, 'local');
    const res = await server
      .post(`/transaction/${regNo}/creditNotes/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(creditNote);
    expect(res.status).toBe(422);
  }, 40000);
});
