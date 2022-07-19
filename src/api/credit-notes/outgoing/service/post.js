const {
  getOutgoingCreditNote,
  updateOutgoingCreditNote,
  createOutgoingCreditNote,
  getOutgoingCreditNotes,
  beginTransaction,
  commitTransaction
} = require('../../../../utils/creditNoteDbHelper');
const ErrorHelper = require('../../../../errors/errorHelper');
const ConflictError = require('../../../../errors/conflictError');
const { sendMessageToSqs, getQueueUrl } = require('../../../../utils/sqsHelper');
const { getCreditNoteIdFromPaJson } = require('../../../../utils/paJsonHelper');
const {
  storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3
} = require('../../../../utils/additionalDocumentReferenceHelper');
const {
  normalizedCreditNoteBodyFromRequest,
  getAccountRegNoFromRequest,
  getQueryStringFromRequest,
  normalizedCreditNotesFromBatchRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveCreditNote = async (creditNote, accountRegNo, dbUuid) => sendMessageToSqs(creditNote, accountRegNo, dbUuid, getQueueUrl());

const createOrUpdateCreditNote = async (accountRegNo, creditNoteBody, shouldUpdate, existingCreditNote = null, transactionId = null) => {
  console.log('createOrUpdateCreditNote', shouldUpdate, existingCreditNote, accountRegNo);
  const {
    binaryObjectReferences,
    creditNoteJsonWithBinaryObjectReferences
  } = await storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3(creditNoteBody);
  try {
    return shouldUpdate
      ? await updateOutgoingCreditNote(existingCreditNote.uuid, creditNoteJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createOutgoingCreditNote(creditNoteJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const createOrUpdateCreditNotes = async (creditNotes, existingCreditNotes, accountRegNo) => {
  const duplicateCreditNoteIds = existingCreditNotes.map((creditNote) => getCreditNoteIdFromPaJson(creditNote.creditNote));
  const transaction = await beginTransaction();
  const creditNoteDbResults = await Promise.all(creditNotes.map(async (creditNote) => {
    const creditNoteExists = duplicateCreditNoteIds.includes(getCreditNoteIdFromPaJson(creditNote));
    const existingCreditNote = existingCreditNotes.find(
      (dbCreditNote) => getCreditNoteIdFromPaJson(dbCreditNote.creditNote) === getCreditNoteIdFromPaJson(creditNote)
    );
    return createOrUpdateCreditNote(accountRegNo, creditNote, creditNoteExists, existingCreditNote, transaction.transactionId);
  }));
  const transactionStatus = await commitTransaction(transaction.transactionId);
  return { transactionStatus, creditNoteDbResults };
};

const postCreditNote = async (req) => {
  try {
    const creditNoteBody = await normalizedCreditNoteBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const creditNoteNumber = getCreditNoteIdFromPaJson(creditNoteBody);
    const existingCreditNote = await getOutgoingCreditNote(creditNoteBody, accountRegNo);
    const creditNoteExists = !!existingCreditNote?.uuid;

    if (creditNoteExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate credit note, ${creditNoteNumber} request rejected!`
      }));
    }

    const creditNoteResult = await createOrUpdateCreditNote(accountRegNo, creditNoteBody, creditNoteExists, existingCreditNote);
    const dbUuid = creditNoteResult.uuid;
    await sendToReceiveCreditNote(creditNoteResult.creditNote, accountRegNo, dbUuid);
    const contentType = getContentTypeFromRequest(req);
    const isXml = contentType.toLowerCase() === 'application/xml';
    const message = `credit note ${creditNoteNumber} sent`;

    if (isXml) {
      return `<message>${message}</message><credit_note_id>${creditNoteNumber}</credit_note_id>`;
    }
    return {
      message,
      credit_note_id: creditNoteNumber
    };
  } catch (err) {
    console.error('api/creditNote/outgoing/service/post.js#postCreditNote', err);
    return ErrorHelper(err);
  }
};

const batchCreditNotes = async (req) => {
  try {
    const creditNotes = normalizedCreditNotesFromBatchRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const existingCreditNotes = await getOutgoingCreditNotes(creditNotes, accountRegNo) || [];
    const duplicateCreditNoteIds = existingCreditNotes.map((creditNote) => getCreditNoteIdFromPaJson(creditNote.creditNote));

    if (existingCreditNotes.length > 0 && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate credit note(s), ${duplicateCreditNoteIds} request rejected!`
      }));
    }
    console.log(creditNotes.length, existingCreditNotes.length);
    const { creditNoteDbResults } = await createOrUpdateCreditNotes(creditNotes, existingCreditNotes, accountRegNo);

    await Promise.all(creditNoteDbResults.map(async (creditNoteResult) => sendToReceiveCreditNote(
      creditNoteResult.creditNote,
      accountRegNo,
      creditNoteResult.uuid
    )));

    const creditNoteIds = creditNoteDbResults.map((result) => getCreditNoteIdFromPaJson(result.creditNote));
    const message = `credit notes ${creditNoteIds} sent`;

    return {
      message,
      credit_note_ids: creditNoteIds
    };
  } catch (err) {
    console.error('api/creditNotes/outgoing/service/post.js#batchCreditNotes', err);
    return ErrorHelper(err);
  }
};

module.exports = {
  postCreditNote,
  batchCreditNotes
};
