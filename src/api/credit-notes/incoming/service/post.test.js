const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const creditNoteDbHelper = require('../../../../utils/creditNoteDbHelper');
const sqsHelper = require('../../../../utils/sqsHelper');
const additionalDocumentReferenceHelper = require('../../../../utils/additionalDocumentReferenceHelper');
const { trivialCreditNoteUBLJson } = require('../../../../../test/mockData/ublJsonCreditNoteTestData');
const {
  convertCreditNoteUblJsonToPaJson,
  convertUblXmlToPaJson,
  getCreditNoteIdFromPaJson
} = require('../../../../utils/paJsonHelper');
const { postCreditNote } = require('./post');
const ConflictError = require('../../../../errors/conflictError');
const ProxyError = require('../../../../errors/proxyError');
const { paJsonWithOneAdditionalDocumentReference } = require('../../../../../test/mockData/paJsonCreditNoteTestData');

jest.mock('../../../../utils/creditNoteDbHelper');
jest.mock('../../../../utils/sqsHelper');
jest.mock('../../../../utils/additionalDocumentReferenceHelper');

describe('postCreditNote', () => {
  test('given valid credit note with binary references, it sends those references to s3', async () => {
    const creditNote = paJsonWithOneAdditionalDocumentReference('SE123123', '123');
    const req = {
      body: creditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE123123'
      }
    };

    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createIncomingCreditNote.mockResolvedValue({ credit_note: creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    additionalDocumentReferenceHelper.storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3
      .mockResolvedValue({ binaryObjectReferences: {}, creditNoteJsonWithBinaryObjectReferences: creditNote });
    const additionalDocumentReferenceHelperSpy = jest.spyOn(additionalDocumentReferenceHelper, 'storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3');

    const res = await postCreditNote(req);
    expect(res).toEqual({
      message: `credit note ${getCreditNoteIdFromPaJson(creditNote)} sent`,
      credit_note_id: getCreditNoteIdFromPaJson(creditNote)
    });
    expect(additionalDocumentReferenceHelperSpy).toBeCalledTimes(1);
  });

  test('given valid post credit note request it creates a new credit note and queues it to receive-invoice queue', async () => {
    const creditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson());
    const req = {
      body: creditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createIncomingCreditNote.mockResolvedValue({ credit_note: creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createIncomingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postCreditNote(req);
    expect(res).toEqual({
      message: `credit note ${getCreditNoteIdFromPaJson(creditNote)} sent`,
      credit_note_id: getCreditNoteIdFromPaJson(creditNote)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid xml credit note it creates a new credit note and queues it to receive-invoice queue', async () => {
    const xmlFile = fs.readFileSync('./test/mockData/xml/credit-note/base-example.xml');
    const xmlString = xmlFile.toString();
    const creditNote = await convertUblXmlToPaJson(xmlString);
    const req = {
      body: xmlString,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createIncomingCreditNote.mockResolvedValue({ credit_note: creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createIncomingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postCreditNote(req);
    expect(res).toEqual(
      `<message>${`credit note ${getCreditNoteIdFromPaJson(creditNote)} sent`}</message>`
      + `<credit_note_id>${getCreditNoteIdFromPaJson(creditNote)}</credit_note_id>`
    );
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid post credit note request it updates a credit note and queues it to receive-invoice queue', async () => {
    const creditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson());
    const req = {
      body: creditNote,
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

    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue({ uuid: 'mock', ubl: creditNote });
    creditNoteDbHelper.updateIncomingCreditNote.mockResolvedValue({ credit_note: creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateIncomingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postCreditNote(req);
    expect(res).toEqual({
      message: `credit note ${getCreditNoteIdFromPaJson(creditNote)} sent`,
      credit_note_id: getCreditNoteIdFromPaJson(creditNote)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('it does not update a credit note if overwrite is set to false', async () => {
    const creditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson());
    const req = {
      body: creditNote,
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

    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue({ uuid: 'mock', credit_note: creditNote });
    creditNoteDbHelper.updateIncomingCreditNote.mockResolvedValue({ credit_note: creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateIncomingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postCreditNote(req)).rejects.toThrowError(ConflictError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it throws error if any function called throws an error method throws', async () => {
    const creditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson());
    const req = {
      body: creditNote,
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

    creditNoteDbHelper.getIncomingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createIncomingCreditNote.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateIncomingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postCreditNote(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});
