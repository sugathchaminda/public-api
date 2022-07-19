const knex = require('knex')({ client: 'pg' });
const db = require('../db/dataApi');
const ValidationError = require('../errors/validationError');

const {
  getCreditNoteDateFromPaJson,
  getCreditNoteIdFromPaJson
} = require('./paJsonHelper');

const { getCreditNoteWithBinaryObjectReferencesOnS3 } = require('./additionalDocumentReferenceHelper');

const OUTGOING_CREDIT_NOTES_TABLE_NAME = 'outgoing_credit_notes';
const INCOMING_CREDIT_NOTES_TABLE_NAME = 'incoming_credit_notes';

const beginTransaction = async () => db.beginTransaction();
const commitTransaction = async (transactionId) => db.commitTransaction({ transactionId });

const getCreditNote = async (creditNoteJson, accountRegNo, table) => {
  const creditNoteId = getCreditNoteIdFromPaJson(creditNoteJson);
  if (creditNoteId === undefined) throw Error('No ID property set on credit note, cannot lookup creditNote in db without key');
  const sql = knex(table)
    .where({
      owner_account: accountRegNo,
      credit_note_number: creditNoteId
    })
    .toQuery();
  const ret = await db.query(sql);
  const record = ret?.records?.[0] || null;
  if (record === null) return null;
  return { ...record, ...{ creditNote: JSON.parse(record.credit_note) } };
};

const getCreditNoteResult = async (accountRegNo, limit, offset, query, table, select = ['*'], order = 'asc', transactionId = null) => {
  const sql = knex(table)
    .where({ ...query, ...{ owner_account: accountRegNo } })
    .orderBy('createdAt', order)
    .select(select)
    .limit(limit)
    .offset(offset)
    .toQuery();
  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });
  return ret?.records || [];
};

const getCreditNotes = async (accountRegNo, limit, offset, query, table, transactionId = null) => {
  const result = await getCreditNoteResult(accountRegNo, limit, offset, query, table, ['*'], 'asc', transactionId);
  return Promise.all(result.map(async (row) => {
    const creditNoteJson = { creditNote: JSON.parse(row.credit_note) };
    const creditNoteWithBinaryObjectReferences = await getCreditNoteWithBinaryObjectReferencesOnS3(creditNoteJson);
    return {
      ...row,
      ...{ creditNote: JSON.parse(JSON.stringify(creditNoteWithBinaryObjectReferences.creditNoteJsonWithBinaryObjectReferences.creditNote)) }
    };
  }));
};

const createErrorsArray = (ownerAccount, creditNoteDate, creditNoteNumber, senderRegNo) => {
  const varToString = (variable) => Object.keys({ variable })[0];
  return [ownerAccount, creditNoteDate, creditNoteNumber, senderRegNo].map((val) => {
    if (!val) {
      return `${varToString(val)} is missing in the incoming credit note`;
    }
    return undefined;
  }).filter((val) => val !== undefined);
};

const validateCreditNoteParams = (ownerAccount, creditNoteDate, creditNoteNumber, senderRegNo) => {
  if (!ownerAccount || !creditNoteDate || !creditNoteNumber || !senderRegNo) {
    // This should not happen since this should be caught in validation layer.
    const errors = createErrorsArray(ownerAccount, creditNoteDate, creditNoteNumber, senderRegNo);
    throw new ValidationError({
      message: errors
    });
  }
};

const getCreditNoteParams = (creditNoteJson, accountRegNo) => {
  const ownerAccount = accountRegNo;
  const creditNoteDate = getCreditNoteDateFromPaJson(creditNoteJson);
  const creditNoteNumber = getCreditNoteIdFromPaJson(creditNoteJson);
  const regNo = accountRegNo;
  return {
    ownerAccount,
    creditNoteDate,
    creditNoteNumber,
    regNo
  };
};

const updateCreditNote = async (existingCreditNoteUUID, creditNoteJson, accountRegNo, table, transactionId = null) => {
  const {
    ownerAccount, creditNoteDate, creditNoteNumber, regNo
  } = getCreditNoteParams(creditNoteJson, accountRegNo);
  validateCreditNoteParams(ownerAccount, creditNoteDate, creditNoteNumber, regNo);
  const sql = knex(table)
    .update({
      owner_account: ownerAccount,
      credit_note_date: creditNoteDate,
      credit_note_number: creditNoteNumber,
      reg_no: regNo,
      credit_note: JSON.stringify(creditNoteJson),
      meta_data: JSON.stringify({ overwrite: true }),
      updatedAt: knex.fn.now()
    })
    .where({ uuid: existingCreditNoteUUID })
    .returning('*')
    .toQuery();
  const creditNoteResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = creditNoteResult.records[0];
  return { ...record, ...{ creditNote: JSON.parse(record.credit_note) } };
};

const updateCreditNoteRead = async (accountRegNo, toReadCreditNotes, limit, offset, table, transactionId = null) => {
  const sql = knex(table)
    .update({
      readAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    })
    .whereIn('id', toReadCreditNotes)
    .where({ reg_no: accountRegNo })
    .limit(limit)
    .offset(offset)
    .returning('*')
    .toQuery();
  const ret = transactionId === null ? await db.query(sql) : await db.query({ sql, transactionId });
  const result = ret?.records || [];
  return Promise.all(result.map(async (row) => {
    const creditNoteJson = { creditNote: JSON.parse(row.credit_note) };
    const creditNoteWithBinaryObjectReferences = await getCreditNoteWithBinaryObjectReferencesOnS3(creditNoteJson);
    return { ...row, ...{ creditNote: JSON.parse(JSON.stringify(creditNoteWithBinaryObjectReferences.creditNoteJsonWithBinaryObjectReferences.creditNote)) } };
  }));
};

const createCreditNote = async (creditNoteJson, accountRegNo, table, transactionId = null) => {
  const {
    ownerAccount, creditNoteDate, creditNoteNumber, regNo
  } = getCreditNoteParams(creditNoteJson, accountRegNo);
  validateCreditNoteParams(ownerAccount, creditNoteDate, creditNoteNumber, regNo);
  const sql = knex(table)
    .insert([{
      owner_account: ownerAccount,
      credit_note_date: creditNoteDate,
      credit_note_number: creditNoteNumber,
      reg_no: regNo,
      credit_note: JSON.stringify(creditNoteJson),
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    }])
    .returning('*')
    .toQuery();

  const creditNoteResult = transactionId !== null ? await db.query({ sql, transactionId }) : await db.query(sql);
  const record = creditNoteResult.records[0];
  return { ...record, ...{ creditNote: JSON.parse(record.credit_note) } };// We assume one record from query and parse to json
};

const getIncomingCreditNotes = async (accountRegNo, limit, offset, query) => getCreditNotes(
  accountRegNo, limit, offset, query, INCOMING_CREDIT_NOTES_TABLE_NAME
);

const getIncomingCreditNote = async (creditNoteJson, accountRegNo) => getCreditNote(creditNoteJson, accountRegNo, INCOMING_CREDIT_NOTES_TABLE_NAME);

const createOutgoingCreditNote = async (creditNoteJson, accountRegNo, transactionID = null) => createCreditNote(
  creditNoteJson, accountRegNo, OUTGOING_CREDIT_NOTES_TABLE_NAME, transactionID
);

const updateOutgoingCreditNote = async (existingCreditNoteUUID, creditNoteJson, accountRegNo, transactionId = null) => updateCreditNote(
  existingCreditNoteUUID, creditNoteJson, accountRegNo, OUTGOING_CREDIT_NOTES_TABLE_NAME, transactionId
);

const getOutgoingCreditNote = async (creditNoteJson, accountRegNo) => getCreditNote(creditNoteJson, accountRegNo, OUTGOING_CREDIT_NOTES_TABLE_NAME);

const getOutgoingCreditNotes = async (creditNotes, accountRegNo) => {
  const results = await Promise.all(creditNotes.map(async (creditNoteJson) => getCreditNote(creditNoteJson, accountRegNo, OUTGOING_CREDIT_NOTES_TABLE_NAME)));
  return results.filter((creditNote) => creditNote !== null);
};

const readIncomingCreditNotes = async (accountRegNo, limit, query, transactionID = null) => getCreditNoteResult(
  accountRegNo, limit, 0, query, INCOMING_CREDIT_NOTES_TABLE_NAME, ['id'], 'asc', transactionID
);

const updateIncomingCreditNoteRead = async (accountRegNo, toReadCreditNotes, limit, transactionID = null) => updateCreditNoteRead(
  accountRegNo, toReadCreditNotes, limit, 0, INCOMING_CREDIT_NOTES_TABLE_NAME, transactionID
);

const createIncomingCreditNote = async (creditNoteJson, accountRegNo, transactionID = null) => createCreditNote(
  creditNoteJson, accountRegNo, INCOMING_CREDIT_NOTES_TABLE_NAME, transactionID
);

const updateIncomingCreditNote = async (existingCreditNoteUUID, creditNoteJson, accountRegNo, transactionId = null) => updateCreditNote(
  existingCreditNoteUUID, creditNoteJson, accountRegNo, INCOMING_CREDIT_NOTES_TABLE_NAME, transactionId
);

module.exports = {
  beginTransaction,
  commitTransaction,

  getOutgoingCreditNote,
  getOutgoingCreditNotes,
  updateOutgoingCreditNote,
  createOutgoingCreditNote,
  getIncomingCreditNotes,
  getIncomingCreditNote,
  readIncomingCreditNotes,
  updateIncomingCreditNoteRead,
  createIncomingCreditNote,
  updateIncomingCreditNote
};
