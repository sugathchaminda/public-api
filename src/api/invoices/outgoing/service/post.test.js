const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dbHelper = require('../../../../utils/dbHelper');
const sqsHelper = require('../../../../utils/sqsHelper');
const additionalDocumentReferenceHelper = require('../../../../utils/additionalDocumentReferenceHelper');
const { trivialInvoiceUBLJson } = require('../../../../../test/mockData/ublJsonInvoiceTestData');
const {
  convertUblJsonToPaJson,
  convertUblXmlToPaJson,
  getInvoiceIdFromPaJson
} = require('../../../../utils/paJsonHelper');
const {
  postInvoice,
  batchInvoices
} = require('./post');
const ConflictError = require('../../../../errors/conflictError');
const ProxyError = require('../../../../errors/proxyError');
const { paJsonWithOneAdditionalDocumentReference } = require('../../../../../test/mockData/paJsonTestData');

jest.mock('../../../../utils/dbHelper');
jest.mock('../../../../utils/sqsHelper');
jest.mock('../../../../utils/additionalDocumentReferenceHelper');

describe('postInvoice', () => {
  test('given valid invoice with binary references, it sends those references to s3', async () => {
    const invoice = paJsonWithOneAdditionalDocumentReference('SE123123', '123');
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE123123'
      }
    };

    dbHelper.getOutgoingInvoices.mockResolvedValue(null);
    dbHelper.createOutgoingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    additionalDocumentReferenceHelper.storeAdditionalDocumentReferenceBinaryObjectsOnS3
      .mockResolvedValue({ binaryObjectReferences: {}, invoiceJsonWithBinaryObjectReferences: invoice });
    const additionalDocumentReferenceHelperSpy = jest.spyOn(additionalDocumentReferenceHelper, 'storeAdditionalDocumentReferenceBinaryObjectsOnS3');

    const res = await postInvoice(req);
    expect(res).toEqual({
      message: `invoice ${getInvoiceIdFromPaJson(invoice)} sent`,
      invoice_id: getInvoiceIdFromPaJson(invoice)
    });
    expect(additionalDocumentReferenceHelperSpy).toBeCalledTimes(1);
  });

  test('given valid post invoice request it creates a new invoice and queues it to receive-invoice queue', async () => {
    const invoice = convertUblJsonToPaJson(trivialInvoiceUBLJson());
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    dbHelper.getOutgoingInvoice.mockResolvedValue(null);
    dbHelper.createOutgoingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'createOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postInvoice(req);
    expect(res).toEqual({
      message: `invoice ${getInvoiceIdFromPaJson(invoice)} sent`,
      invoice_id: getInvoiceIdFromPaJson(invoice)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid xml invoice it creates a new invoice and queues it to receive-invoice queue', async () => {
    const xmlFile = fs.readFileSync('./test/mockData/xml/invoice/base-example.xml');
    const xmlString = xmlFile.toString();
    const invoice = await convertUblXmlToPaJson(xmlString);
    const req = {
      body: xmlString,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    dbHelper.getOutgoingInvoice.mockResolvedValue(null);
    dbHelper.createOutgoingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'createOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postInvoice(req);
    expect(res).toEqual(
      `<message>${`invoice ${getInvoiceIdFromPaJson(invoice)} sent`}</message><invoice_id>${getInvoiceIdFromPaJson(invoice)}</invoice_id>`
    );
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid post invoice request it updates an invoice and queues it to receive-invoice queue', async () => {
    const invoice = convertUblJsonToPaJson(trivialInvoiceUBLJson());
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: true
      }
    };

    dbHelper.getOutgoingInvoice.mockResolvedValue({ uuid: 'mock', ubl: invoice });
    dbHelper.updateOutgoingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postInvoice(req);
    expect(res).toEqual({
      message: `invoice ${getInvoiceIdFromPaJson(invoice)} sent`,
      invoice_id: getInvoiceIdFromPaJson(invoice)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('it does not update an invoice if overwrite is set to false', async () => {
    const invoice = convertUblJsonToPaJson(trivialInvoiceUBLJson());
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };

    dbHelper.getOutgoingInvoice.mockResolvedValue({ uuid: 'mock', invoice });
    dbHelper.updateOutgoingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postInvoice(req)).rejects.toThrowError(ConflictError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it throws error if any function called throws an error method throws', async () => {
    const invoice = convertUblJsonToPaJson(trivialInvoiceUBLJson());
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };

    dbHelper.getOutgoingInvoice.mockResolvedValue(null);
    dbHelper.createOutgoingInvoice.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postInvoice(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});

describe('batchInvoices', () => {
  test('it stores invoices in db and sends them to sqs', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    dbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    dbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    dbHelper.getOutgoingInvoices.mockResolvedValue([]);
    dbHelper.createOutgoingInvoice.mockResolvedValue({ invoice: invoices.Invoices[0], uuid: uuidv4() });
    dbHelper.createOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[0], uuid: uuidv4() });
    dbHelper.createOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(dbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(dbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(dbHelper, 'createOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchInvoices(req);
    expect(res).toEqual({
      message: `invoices ${invoices.Invoices.map((invoice) => getInvoiceIdFromPaJson(invoice))} sent`,
      invoice_ids: invoices.Invoices.map((invoice) => getInvoiceIdFromPaJson(invoice))
    });
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledTimes(2);
    expect(awsSpy).toBeCalledTimes(2);
  });

  test('it does not allow overwriting invoices', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };

    dbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    dbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    dbHelper.getOutgoingInvoices.mockResolvedValueOnce([{ uuid: 'mock', invoice: invoices.Invoices[0] }, { uuid: 'mock', invoice: invoices.Invoices[1] }]);
    dbHelper.createOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[0], uuid: uuidv4() });
    dbHelper.createOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(dbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(dbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(dbHelper, 'createOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(batchInvoices(req)).rejects.toThrowError(ConflictError);
    expect(transactionCreateSpy).toBeCalledTimes(0);
    expect(transactionCommitSpy).toBeCalledTimes(0);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it allows overwriting invoices i query param overwrite is set to true', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: true
      }
    };

    dbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    dbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    dbHelper.getOutgoingInvoices.mockResolvedValueOnce([{ uuid: 'mock', invoice: invoices.Invoices[0] }]);
    dbHelper.createOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[1], uuid: uuidv4() });
    dbHelper.updateOutgoingInvoice.mockResolvedValueOnce({ invoice: invoices.Invoices[0], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(dbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(dbHelper, 'commitTransaction');
    const createIndbSpy = jest.spyOn(dbHelper, 'createOutgoingInvoice');
    const updateIndbSpy = jest.spyOn(dbHelper, 'updateOutgoingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchInvoices(req);
    expect(res.length).toEqual(invoices.length); // Cant assert equeality since order is no determent (due to paralell execution of promises)
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(createIndbSpy).toBeCalledTimes(1);
    expect(updateIndbSpy).toBeCalledTimes(1);
    expect(awsSpy).toBeCalledTimes(2);
  });
});
