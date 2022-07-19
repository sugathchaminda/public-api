const {
  getIncomingCreditNote,
  updateIncomingCreditNote,
  createIncomingCreditNote
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
  getQueryStringFromRequest
} = require('../../../../utils/requestHelper');
const { getContentTypeFromRequest } = require('../../../../utils/requestHelper');

const sendToReceiveCreditNote = async (creditNote, accountRegNo, dbUuid, relaying) => {
  sendMessageToSqs(creditNote, accountRegNo, dbUuid, getQueueUrl(), relaying);
};

const createOrUpdateCreditNote = async (accountRegNo, creditNoteBody, shouldUpdate, existingCreditNote = null, transactionId = null) => {
  const {
    binaryObjectReferences,
    creditNoteJsonWithBinaryObjectReferences
  } = await storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3(creditNoteBody);
  try {
    return shouldUpdate
      ? await updateIncomingCreditNote(existingCreditNote.uuid, creditNoteJsonWithBinaryObjectReferences, accountRegNo, transactionId)
      : await createIncomingCreditNote(creditNoteJsonWithBinaryObjectReferences, accountRegNo, transactionId);
  } catch (err) {
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(binaryObjectReferences);
    throw (err);
  }
};

const postCreditNote = async (req) => {
  try {
    const creditNoteBody = await normalizedCreditNoteBodyFromRequest(req);
    const shouldOverwrite = getQueryStringFromRequest(req)?.overwrite || false;
    const accountRegNo = getAccountRegNoFromRequest(req);
    const creditNoteNumber = getCreditNoteIdFromPaJson(creditNoteBody);
    const existingCreditNote = await getIncomingCreditNote(creditNoteBody, accountRegNo);
    const creditNoteExists = !!existingCreditNote?.uuid;
    if (creditNoteExists && !shouldOverwrite) {
      return ErrorHelper(new ConflictError({
        message: `Duplicate credit note, ${creditNoteNumber} request rejected!`
      }));
    }

    const creditNoteResult = await createOrUpdateCreditNote(accountRegNo, creditNoteBody, creditNoteExists, existingCreditNote);
    const dbUuid = creditNoteResult.uuid;
    const relaying = 'false';
    await sendToReceiveCreditNote(creditNoteResult.creditNote, accountRegNo, dbUuid, relaying);

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
    console.error('api/credit-notes/outgoing/service/post.js#postCreditNote', err);
    return ErrorHelper(err);
  }
};

module.exports = {
  postCreditNote
};
