const {
  createOutgoingCreditNote,
  createIncomingCreditNote,
  getOutgoingCreditNote,
  updateOutgoingCreditNote,
  getIncomingCreditNotes
} = require('./creditNoteDbHelper');
const { trivialCreditNoteUBLJson } = require('../../test/mockData/ublJsonCreditNoteTestData');
const { convertCreditNoteUblJsonToPaJson } = require('./paJsonHelper');
const db = require('../db/dataApi');
const ValidationError = require('../errors/validationError');

jest.mock('../db/dataApi');

describe('getOutgoingCreditNote', () => {
  test('it returns null if no credit note is found', async () => {
    db.query.mockResolvedValue({ records: [] });
    const spy = jest.spyOn(db, 'query');

    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    const res = await getOutgoingCreditNote(json, '443525423534');
    expect(res).toBeNull();
    expect(spy).toBeCalled();
  });

  test('it returns credit note if credit note is found', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    const uuid = json?.CreditNote?.['cbc:ID']?.[0]?._;

    db.query.mockResolvedValue({ records: [{ uuid, credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await getOutgoingCreditNote(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });
});

describe('createIncomingCreditNote', () => {
  test('inserts an credit note into incoming credit note table', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createIncomingCreditNote(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert a credit note into incoming credit note table if there is no credit note id', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    await expect(createIncomingCreditNote(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert a credit note into incoming credit note table if there is no credit note date', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createIncomingCreditNote(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('createOutgoingCreditNote', () => {
  test('inserts a credit note into outgoing credit notes table', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await createOutgoingCreditNote(json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not insert a credit note into outgoing credit notes table if there is no credit note id', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:ID'][0]._ = undefined;
    const spy = jest.spyOn(db, 'query');

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    await expect(createOutgoingCreditNote(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not insert a credit note into outgoing credit notes table if there is no credit note date', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(createOutgoingCreditNote(json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('updateOutgoingCreditNote', () => {
  test('updates credit note in outgoing credit notes table', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    const res = await updateOutgoingCreditNote('uuid', json, '443525423534');
    expect(res.uuid).toBeDefined();
    expect(spy).toBeCalled();
  });

  test('does not update credit note in outgoing credit notes table if there is no credit note id', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:ID'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingCreditNote('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });

  test('does not update credit note in outgoing credit notes table if there is no credit notes date', async () => {
    const json = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('443525423534'));
    json.CreditNote['cbc:IssueDate'][0]._ = undefined;

    db.query.mockResolvedValue({ records: [{ uuid: 'dummy', credit_note: JSON.stringify(json) }] });
    const spy = jest.spyOn(db, 'query');

    await expect(updateOutgoingCreditNote('uuid', json, '443525423534')).rejects.toThrowError(ValidationError);
    expect(spy).toBeCalledTimes(0);
  });
});

describe('getIncomingCreditNotes', () => {
  test('gets incoming credit notes', async () => {
    const accountRegNo = 'SE55443322';
    const limit = '3';
    const offset = '0';

    db.query.mockResolvedValue({
      records: [{
        uuid: 'dummy',
        credit_note: JSON.stringify(convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('123123123')))
      }]
    });

    const spy = jest.spyOn(db, 'query');
    const res = await getIncomingCreditNotes(accountRegNo, limit, offset);
    expect(res.length).toBe(1);
    expect(spy).toBeCalledTimes(1);
  });
});
