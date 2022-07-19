const { v4: uuidv4 } = require('uuid');
const orderDbHelper = require('../../../../utils/orderDbHelper');
const { convertOrderUblJsonToPaJson } = require('../../../../utils/paJsonHelper');
const { trivialOrderUBLJson } = require('../../../../../test/mockData/ublJsonOrderTestData');
const { getOrders, readOrders } = require('./get');

jest.mock('../../../../utils/orderDbHelper');

describe('getOrders', () => {
  test('it return a list of orders', async () => {
    const dbResult = [{
      uuid: 'dummy',
      order: convertOrderUblJsonToPaJson(trivialOrderUBLJson('1231231231'))
    }];

    orderDbHelper.getIncomingOrders.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(orderDbHelper, 'getIncomingOrders');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await getOrders(req);
    expect(res).toEqual(dbResult.map((result) => result.order));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit and skip to orderDbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      order: convertOrderUblJsonToPaJson(trivialOrderUBLJson('1231231231'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 10;
    const offset = 2;

    orderDbHelper.getIncomingOrders.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(orderDbHelper, 'getIncomingOrders');

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

    const res = await getOrders(req);
    expect(res).toEqual(dbResult.map((result) => result.order));
    expect(dbSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledWith(accountRegNo, limit, offset, { readAt: null });
  });
});

describe('readOrders', () => {
  test('it return a list of orders', async () => {
    const dbResult = [{
      uuid: 'dummy',
      order: convertOrderUblJsonToPaJson(trivialOrderUBLJson('1231231231'))
    }];

    orderDbHelper.readIncomingOrders.mockResolvedValue(dbResult);
    orderDbHelper.updateIncomingOrderRead.mockResolvedValue(dbResult);

    const dbSpy = jest.spyOn(orderDbHelper, 'updateIncomingOrderRead');

    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    orderDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    orderDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const res = await readOrders(req);
    expect(res).toEqual(dbResult.map((result) => result.order));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it supplies limit to orderDbHelper', async () => {
    const dbResult = [{
      uuid: 'dummy',
      order: convertOrderUblJsonToPaJson(trivialOrderUBLJson('1231231231'))
    }];
    const accountRegNo = 'SE5567321707';
    const limit = 1;

    orderDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    orderDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });

    const dbSpyReadIData = jest.spyOn(orderDbHelper, 'readIncomingOrders');
    const dbSpyUpdateIData = jest.spyOn(orderDbHelper, 'updateIncomingOrderRead');

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

    const transactionCreateSpy = jest.spyOn(orderDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(orderDbHelper, 'commitTransaction');

    const res = await readOrders(req);
    expect(res).toEqual(dbResult.map((result) => result.order));

    expect(dbSpyReadIData).toBeCalledTimes(1);
    expect(dbSpyUpdateIData).toBeCalledTimes(1);
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
  });
});
