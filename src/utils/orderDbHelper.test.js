const {
  createOutgoingOrder,
  createIncomingOrder,
  getOutgoingOrder,
  updateOutgoingOrder,
  getIncomingOrders
} = require('./orderDbHelper');
const { trivialOrderUBLJson } = require('../../test/mockData/ublJsonOrderTestData');
const { convertOrderUblJsonToPaJson } = require('./paJsonHelper');
const db = require('../db/dataApi');
const ValidationError = require('../errors/validationError');

jest.mock('../db/dataApi');

describe('getOutgoingOrder', () => {
  test('it returns null if no order is found', async () => {
    db.query.mockResolvedValue({ records: [] });
    const spy = jest.spyOn(db, 'query');

    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    const res = await getOutgoingOrder(json, '443525423534');
    expect(res).toBeNull();
    expect(spy).toBeCalled();
  });

  test('it returns order if order is found', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    const uuid = json?.Order?.['cbc:ID']?.[0]?._;

    db.query.mockResolvedValue({ records: [{ uuid, order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await getOutgoingOrder(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });
});

describe('createIncomingOrder', () => {
  test('inserts an order into incoming order table', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createIncomingOrder(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert an order into incoming order table if there is no order id', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    await expect(createIncomingOrder(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert an order into incoming order table if there is no order date', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createIncomingOrder(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('createOutgoingOrder', () => {
  test('inserts an order into outgoing orders table', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createOutgoingOrder(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert an order into outgoing orders table if there is no order id', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    await expect(createOutgoingOrder(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert an order into outgoing orders table if there is no order date', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createOutgoingOrder(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('updateOutgoingOrder', () => {
  test('updates order in outgoing orders table', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await updateOutgoingOrder('uuid', json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not update order in outgoing orders table if there is no order id', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:ID'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingOrder('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not update order in outgoing orders table if there is no order date', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingOrder('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('getIncomingOrders', () => {
  test('gets incoming orders', async () => {
    const accountRegNo = 'SE55443322';
    const limit = '3';
    const offset = '0';

    db.query.mockResolvedValue({
      records: [{
        uuid: 'dummy',
        order: JSON.stringify(convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123123')))
      }]
    });

    const spy = jest.spyOn(db, 'query');
    const res = await getIncomingOrders(accountRegNo, limit, offset);
    expect(res.length).toBe(1);
    expect(spy).toBeCalledTimes(1);
  });
});
