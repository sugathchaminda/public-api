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
const { postInvoice } = require('./post');
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

    dbHelper.getIncomingInvoice.mockResolvedValue(null);
    dbHelper.createIncomingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
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
    dbHelper.getIncomingInvoice.mockResolvedValue(null);
    dbHelper.createIncomingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'createIncomingInvoice');
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
    dbHelper.getIncomingInvoice.mockResolvedValue(null);
    dbHelper.createIncomingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'createIncomingInvoice');
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

    dbHelper.getIncomingInvoice.mockResolvedValue({ uuid: 'mock', ubl: invoice });
    dbHelper.updateIncomingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateIncomingInvoice');
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

    dbHelper.getIncomingInvoice.mockResolvedValue({ uuid: 'mock', invoice });
    dbHelper.updateIncomingInvoice.mockResolvedValue({ invoice, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateIncomingInvoice');
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

    dbHelper.getIncomingInvoice.mockResolvedValue(null);
    dbHelper.createIncomingInvoice.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(dbHelper, 'updateIncomingInvoice');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postInvoice(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});
