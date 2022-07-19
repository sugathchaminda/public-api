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
const {
  postCreditNote,
  batchCreditNotes
} = require('./post');
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

    creditNoteDbHelper.getOutgoingCreditNotes.mockResolvedValue(null);
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValue({ creditNote, uuid: uuidv4() });
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
    creditNoteDbHelper.getOutgoingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValue({ creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createOutgoingCreditNote');
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
    creditNoteDbHelper.getOutgoingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValue({ creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createOutgoingCreditNote');
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

    creditNoteDbHelper.getOutgoingCreditNote.mockResolvedValue({ uuid: 'mock', ubl: creditNote });
    creditNoteDbHelper.updateOutgoingCreditNote.mockResolvedValue({ creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateOutgoingCreditNote');
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

    creditNoteDbHelper.getOutgoingCreditNote.mockResolvedValue({ uuid: 'mock', creditNote });
    creditNoteDbHelper.updateOutgoingCreditNote.mockResolvedValue({ creditNote, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateOutgoingCreditNote');
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

    creditNoteDbHelper.getOutgoingCreditNote.mockResolvedValue(null);
    creditNoteDbHelper.createOutgoingCreditNote.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateOutgoingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postCreditNote(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});

describe('batchCreditNotes', () => {
  test('it stores credit notes in db and sends them to sqs', async () => {
    const creditNotes = {
      CreditNotes: [
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '1')),
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: creditNotes,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    creditNoteDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    creditNoteDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    creditNoteDbHelper.getOutgoingCreditNotes.mockResolvedValue([]);
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValue({ creditNote: creditNotes.CreditNotes[0], uuid: uuidv4() });
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[0], uuid: uuidv4() });
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(creditNoteDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(creditNoteDbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createOutgoingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchCreditNotes(req);
    expect(res).toEqual({
      message: `credit notes ${creditNotes.CreditNotes.map((creditNote) => getCreditNoteIdFromPaJson(creditNote))} sent`,
      credit_note_ids: creditNotes.CreditNotes.map((creditNote) => getCreditNoteIdFromPaJson(creditNote))
    });
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledTimes(2);
    expect(awsSpy).toBeCalledTimes(2);
  });

  test('it does not allow overwriting credit notes', async () => {
    const creditNotes = {
      CreditNotes: [
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '1')),
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '2'))
      ]
    };
    const req = {
      body: creditNotes,
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
    creditNoteDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    creditNoteDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    creditNoteDbHelper.getOutgoingCreditNotes.mockResolvedValueOnce(
      [{ uuid: 'mock', creditNote: creditNotes.CreditNotes[0] }, { uuid: 'mock', creditNote: creditNotes.CreditNotes[1] }]
    );
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[0], uuid: uuidv4() });
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(creditNoteDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(creditNoteDbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(creditNoteDbHelper, 'createOutgoingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(batchCreditNotes(req)).rejects.toThrowError(ConflictError);
    expect(transactionCreateSpy).toBeCalledTimes(0);
    expect(transactionCommitSpy).toBeCalledTimes(0);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it allows overwriting credit notes i query param overwrite is set to true', async () => {
    const creditNotes = {
      CreditNotes: [
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '1')),
        convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123', '2'))
      ]
    };
    const req = {
      body: creditNotes,
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
    creditNoteDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    creditNoteDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    creditNoteDbHelper.getOutgoingCreditNotes.mockResolvedValueOnce([{ uuid: 'mock', creditNote: creditNotes.CreditNotes[0] }]);
    creditNoteDbHelper.createOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[1], uuid: uuidv4() });
    creditNoteDbHelper.updateOutgoingCreditNote.mockResolvedValueOnce({ creditNote: creditNotes.CreditNotes[0], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(creditNoteDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(creditNoteDbHelper, 'commitTransaction');
    const createIndbSpy = jest.spyOn(creditNoteDbHelper, 'createOutgoingCreditNote');
    const updateIndbSpy = jest.spyOn(creditNoteDbHelper, 'updateOutgoingCreditNote');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchCreditNotes(req);
    expect(res.length).toEqual(creditNotes.length);
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(createIndbSpy).toBeCalledTimes(1);
    expect(updateIndbSpy).toBeCalledTimes(1);
    expect(awsSpy).toBeCalledTimes(2);
  });
});
