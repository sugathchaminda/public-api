const { v4: uuidv4 } = require('uuid');
const dbHelper = require('../../../../utils/dbHelper');
const { convertUblJsonToPaJson } = require('../../../../utils/paJsonHelper');
const { trivialInvoiceUBLJson } = require('../../../../../test/mockData/ublJsonInvoiceTestData');
const { getInvoices, readInvoices } = require('./get');

jest.mock('../../../../utils/dbHelper');

describe('getInvoices', () => {
  test('it return a list of invoices', async () => {
    const dbResult = [{
      uuid: 'dummy',
      invoice: convertUblJsonToPaJson(trivialInvoiceUBLJson('123123123'))
    }];

    dbHelper.getIncomingInvoices.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(dbHelper, 'getIncomingInvoices');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await getInvoices(req);
    expect(res).toEqual(dbResult.map((result) => result.invoice));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit and skip to dbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      invoice: convertUblJsonToPaJson(trivialInvoiceUBLJson('123123123'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 10;
    const offset = 2;
    const contentType = 'application/json';

    dbHelper.getIncomingInvoices.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(dbHelper, 'getIncomingInvoices');

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

    const res = await getInvoices(req);
    expect(res).toEqual(dbResult.map((result) => result.invoice));
    expect(dbSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledWith(accountRegNo, limit, offset, { readAt: null }, contentType);
  });
});

describe('readInvoices', () => {
  test('it return a list of invoices', async () => {
    const dbResult = [{
      uuid: 'dummy',
      invoice: convertUblJsonToPaJson(trivialInvoiceUBLJson('123123123'))
    }];

    dbHelper.readIncomingInvoices.mockResolvedValue(dbResult);
    dbHelper.updateIncomingInvoiceRead.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(dbHelper, 'updateIncomingInvoiceRead');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    dbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    dbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const res = await readInvoices(req);
    expect(res).toEqual(dbResult.map((result) => result.invoice));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit to dbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      invoice: convertUblJsonToPaJson(trivialInvoiceUBLJson('123123123'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 1;

    dbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    dbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const dbSpyReadIData = jest.spyOn(dbHelper, 'readIncomingInvoices');
    const dbSpyUpdateIData = jest.spyOn(dbHelper, 'updateIncomingInvoiceRead');

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

    const transactionCreateSpy = jest.spyOn(dbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(dbHelper, 'commitTransaction');

    const res = await readInvoices(req);
    expect(res).toEqual(dbResult.map((result) => result.invoice));

    expect(dbSpyReadIData).toBeCalledTimes(1);
    expect(dbSpyUpdateIData).toBeCalledTimes(1);
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
  });
});
