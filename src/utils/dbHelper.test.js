const {
  createOutgoingInvoice,
  createIncomingInvoice,
  getOutgoingInvoice,
  updateOutgoingInvoice,
  getIncomingInvoices,
  createIncomingOrderResponse
} = require('./dbHelper');
const { trivialInvoiceUBLJson } = require('../../test/mockData/ublJsonInvoiceTestData');
const { trivialOrderUBLJson } = require('../../test/mockData/ublJsonOrderTestData');
const { convertUblJsonToPaJson, convertOrderUblJsonToPaJson } = require('./paJsonHelper');
const db = require('../db/dataApi');
const ValidationError = require('../errors/validationError');

jest.mock('../db/dataApi');

describe('getOutgoingInvoice', () => {
  test('it returns null if no invoice is found', async () => {
    db.query.mockResolvedValue({ records: [] });
    const spy = jest.spyOn(db, 'query');

    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    const res = await getOutgoingInvoice(json, '443525423534');
    expect(res).toBeNull();
    expect(spy).toBeCalled();
  });

  test('it returns invoice if invoice is found', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    const uuid = json?.Invoice?.['cbc:ID']?.[0]?._;

    db.query.mockResolvedValue({ records: [{ uuid, invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await getOutgoingInvoice(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });
});

describe('createIncomingInvoice', () => {
  test('inserts an invoice into incominginvoice table', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createIncomingInvoice(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert an invoice into incominginvoice table if there is no invoice id', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    await expect(createIncomingInvoice(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert an invoice into incominginvoice table if there is no invoice date', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createIncomingInvoice(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('createOutgoingInvoice', () => {
  test('inserts an invoice into outgoinginvoices table', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createOutgoingInvoice(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert an invoice into outgoinginvoices table if there is no invoice id', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    await expect(createOutgoingInvoice(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert an invoice into outgoinginvoices table if there is no invoice date', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createOutgoingInvoice(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('updateOutgoingInvoice', () => {
  test('updates invoice in outgoinginvoices table', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await updateOutgoingInvoice('uuid', json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not update invoice in outgoinginvoices table if there is no invoice id', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:ID'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingInvoice('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not update invoice in outgoinginvoices table if there is no invoice date', async () => {
    const json = convertUblJsonToPaJson(trivialInvoiceUBLJson('443525423534'));
    json.Invoice['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', invoice: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingInvoice('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('getIncomingInvoices', () => {
  test('gets incoming invoices', async () => {
    const accountRegNo = 'SE55443322';
    const limit = '3';
    const offset = '0';
    const contentType = 'application/json';

    db.query.mockResolvedValue({
      records: [{
        uuid: 'dummy',
        invoice: JSON.stringify(convertUblJsonToPaJson(trivialInvoiceUBLJson('123123123')))
      }]
    });

    const spy = jest.spyOn(db, 'query');
    const res = await getIncomingInvoices(accountRegNo, limit, offset, {}, contentType);
    expect(res.length).toBe(1);
    expect(spy).toBeCalledTimes(1);
  });
});

describe('createIncomingOrderResponse', () => {
  test('inserts an order response into incoming_order_response table', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');
    const res = await createIncomingOrderResponse(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert an order response into incoming_order_response table if there is no order id', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    await expect(createIncomingOrderResponse(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert an order response into incoming_order_response table if there is no order date', async () => {
    const json = convertOrderUblJsonToPaJson(trivialOrderUBLJson('443525423534'));
    json.Order['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', order: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createIncomingOrderResponse(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});
