const ErrorHelper = require('../../../../errors/errorHelper');
const {
  getQueryStringFromRequest,
  getAccountRegNoFromRequest
} = require('../../../../utils/requestHelper');
const {
  getIncomingCreditNotes,
  readIncomingCreditNotes,
  updateIncomingCreditNoteRead,
  beginTransaction,
  commitTransaction
} = require('../../../../utils/creditNoteDbHelper');

const DEFAULT_LIMIT = 3;
const DEFAULT_SKIP = 0;

const getCreditNotes = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const offset = getQueryStringFromRequest(req)?.skip || DEFAULT_SKIP;
  const includeRead = getQueryStringFromRequest(req)?.includeRead || false;
  const accountRegNo = getAccountRegNoFromRequest(req);
  try {
    const query = includeRead === 'true' ? {} : { readAt: null };
    return (await getIncomingCreditNotes(accountRegNo, limit, offset, query)).map((result) => result.creditNote);
  } catch (err) {
    return ErrorHelper(err);
  }
};

const readCreditNotes = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const accountRegNo = getAccountRegNoFromRequest(req);
  try {
    const query = {};
    const transaction = await beginTransaction();
    const creditNoteSelectData = (await readIncomingCreditNotes(accountRegNo, limit, query, transaction.transactionId)).map((result) => result.id);
    const creditNoteData = (await updateIncomingCreditNoteRead(
      accountRegNo,
      creditNoteSelectData,
      limit,
      transaction.transactionId
    )).map((result) => result.creditNote);
    await commitTransaction(transaction.transactionId);
    return creditNoteData;
  } catch (err) {
    return ErrorHelper(err);
  }
};

module.exports = {
  getCreditNotes,
  readCreditNotes
};
