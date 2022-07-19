const request = require('supertest');
const fs = require('fs');
const { createAuthKey } = require('./utils/authHelper');
const { convertUblXmlToPaJson } = require('../../src/utils/paJsonHelper');
const { clearOutgoingInvoices } = require('./utils/databaseHelper');
const { paJsonWithOneAdditionalDocumentReference } = require('../mockData/paJsonTestData');

// Integration tests assume serverless offline is running on the following address
const baseUrl = process.env.SERVERLESS_OFFLINE_URL || 'http://localhost:3001';
const orgNo = '5567321707';
const regNo = `SE${orgNo}`;

const server = request(baseUrl);

const baseXmlStringInvoice = fs.readFileSync('./test/mockData/xml/invoice/base-example.xml').toString();
const baseInvoiceJson = async () => convertUblXmlToPaJson(baseXmlStringInvoice);
const setIdOnUblJson = (json, id) => {
  const newJson = json;
  newJson.Invoice['cbc:ID'][0]._ = id;
  return newJson;
};

// All invoices in test/mockData/xml are expected to be valid
const validInvoicesXml = fs.readdirSync('./test/mockData/xml/invoice/').map((file) => fs.readFileSync(`./test/mockData/xml/invoice/${file}`).toString());

describe('Common responses', () => {
  const endpoints = [`/transaction/${regNo}/invoices/outgoing/batch`, `/transaction/${regNo}/invoices/outgoing`];
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
      .set('Authorization', 'dummytoken')
      .send({});

    expect(res.status).toBe(401);
  });
});

describe('POST /transaction/{regNo}/invoices/outgoing/batch', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingInvoices());

  test('Returns 200 when posting valid array of invoices', async () => {
    const invoices = [
      setIdOnUblJson(await baseInvoiceJson(), '1'),
      setIdOnUblJson(await baseInvoiceJson(), '2')
    ];
    const accessKey = await createAuthKey(regNo, 'local');
    const reqBody = { Invoices: invoices };

    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(reqBody);

    expect(res.status).toBe(200);
  }, 80000);

  test('Return 409 when posting a duplicate invoice without overwrite flag in batch request', async () => {
    const invoice = setIdOnUblJson(await baseInvoiceJson(), '1');
    const invoices = [invoice, setIdOnUblJson(await baseInvoiceJson(), '2')];
    const batchReq = { Invoices: invoices };
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.

    // First create single invoice in db using regular request.
    const createRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(invoice);
    // include created invoice in batch request.
    const duplicateRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing/batch`)
      .set('httpMethod', 'POST')
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(batchReq);

    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 80000);

  test('Return 200 when posting a duplicate invoice with overwrite flag in batch request', async () => {
    const invoice = setIdOnUblJson(await baseInvoiceJson(), '1');
    const invoices = [invoice, setIdOnUblJson(await baseInvoiceJson(), '2')];
    const batchReq = { Invoices: invoices };
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.

    // First create single invoice in db using regular request.
    const createRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(invoice);

    // include created invoice in batch request.
    const duplicateRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(batchReq);

    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 80000);

  test('Returns 200 when posting invoices that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject to batch', async () => {
    const invoices = [paJsonWithOneAdditionalDocumentReference(regNo, '3'), paJsonWithOneAdditionalDocumentReference(regNo, '2')];
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const req = { Invoices: invoices };
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing/batch`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(req);

    expect(res.status).toBe(200);
  }, 80000);

  test('Returns 422 if the invoice does not conform to validation', async () => {
    const invoices = [{ invalid: true }, setIdOnUblJson(await baseInvoiceJson(), '1')];
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const req = { Invoices: invoices };
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing/batch`)
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(req);

    expect(res.status).toBe(422);
  }, 40000);
});

describe('POST /transaction/{regNo}/invoices/outgoing', () => {
  // eslint-disable-next-line jest/no-done-callback
  afterEach(async () => clearOutgoingInvoices());

  test.each(validInvoicesXml)('Returns 200 when posting a valid invoice', async (invoiceXml) => {
    const invoice = await convertUblXmlToPaJson(invoiceXml);
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(invoice);

    expect(res.status).toBe(200);
  }, 80000);

  test.each(validInvoicesXml)('Returns 200 when posting a valid xml invoice', async (invoiceXml) => {
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/xml')
      .set('Authorization', accessKey)
      .send(invoiceXml);

    expect(res.status).toBe(200);
  }, 40000);

  test('Return 409 when posting a duplicate invoice without overwrite flag', async () => {
    const invoice = await baseInvoiceJson();
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const createRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(invoice);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(invoice);

    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(409);
  }, 40000);

  test('Return 200 when posting a duplicate invoice with overwrite flag', async () => {
    const invoice = await baseInvoiceJson();
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const createRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(invoice);
    const duplicateRes = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .query({ overwrite: true })
      .send(invoice);

    expect(createRes.status).toBe(200);
    expect(duplicateRes.status).toBe(200);
  }, 40000);

  test('Returns 200 when posting invoice that has AdditionalDocumentReference with EmbeddedDocumentBinaryObject', async () => {
    const invoice = paJsonWithOneAdditionalDocumentReference(regNo);
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json')
      .set('Authorization', accessKey)
      .send(invoice);

    expect(res.status).toBe(200);
  }, 40000); // Running locally the s3 uploads might take time if not emulating s3 in docker.

  test('Returns 422 if the invoice does not conform to validation', async () => {
    const invoice = { invalid: true };
    const accessKey = await createAuthKey(regNo, 'local'); // note stage needs to correspond to stage in target test env.
    const res = await server
      .post(`/transaction/${regNo}/invoices/outgoing`)
      .set('content-type', 'application/json;version = 1')
      .set('Authorization', accessKey)
      .send(invoice);

    expect(res.status).toBe(422);
  }, 40000);
});
