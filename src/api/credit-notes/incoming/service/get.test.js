const { v4: uuidv4 } = require('uuid');
const creditNoteDbHelper = require('../../../../utils/creditNoteDbHelper');
const { convertCreditNoteUblJsonToPaJson } = require('../../../../utils/paJsonHelper');
const { trivialCreditNoteUBLJson } = require('../../../../../test/mockData/ublJsonCreditNoteTestData');
const { getCreditNotes, readCreditNotes } = require('./get');

jest.mock('../../../../utils/creditNoteDbHelper');

describe('getCreditNotes', () => {
  test('it return a list of credit notes', async () => {
    const dbResult = [{
      uuid: 'dummy',
      credit_note: convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('1231231231'))
    }];

    creditNoteDbHelper.getIncomingCreditNotes.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(creditNoteDbHelper, 'getIncomingCreditNotes');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await getCreditNotes(req);
    expect(res).toEqual(dbResult.map((result) => result.creditNote));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit and skip to creditNoteDbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      credit_note: convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('1231231231'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 10;
    const offset = 2;

    creditNoteDbHelper.getIncomingCreditNotes.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(creditNoteDbHelper, 'getIncomingCreditNotes');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo
      },
      query: {
        limit,
        skip: offset
      }
    };

    const res = await getCreditNotes(req);
    expect(res).toEqual(dbResult.map((result) => result.creditNote));
    expect(dbSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledWith(accountRegNo, limit, offset, { readAt: null });
  });
});

describe('readCreditNotes', () => {
  test('it return a list of credit notes', async () => {
    const dbResult = [{
      uuid: 'dummy',
      credit_note: convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('1231231231'))
    }];

    creditNoteDbHelper.readIncomingCreditNotes.mockResolvedValue(dbResult);
    creditNoteDbHelper.updateIncomingCreditNoteRead.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(creditNoteDbHelper, 'updateIncomingCreditNoteRead');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    creditNoteDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    creditNoteDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const res = await readCreditNotes(req);
    expect(res).toEqual(dbResult.map((result) => result.creditNote));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit to creditNoteDbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      credit_note: convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('1231231231'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 1;

    creditNoteDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    creditNoteDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const dbSpyReadIData = jest.spyOn(creditNoteDbHelper, 'readIncomingCreditNotes');
    const dbSpyUpdateIData = jest.spyOn(creditNoteDbHelper, 'updateIncomingCreditNoteRead');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo
      },
      query: {
        limit
      }
    };

    const transactionCreateSpy = jest.spyOn(creditNoteDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(creditNoteDbHelper, 'commitTransaction');

    const res = await readCreditNotes(req);
    expect(res).toEqual(dbResult.map((result) => result.creditNote));

    expect(dbSpyReadIData).toBeCalledTimes(1);
    expect(dbSpyUpdateIData).toBeCalledTimes(1);
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
  });
});
