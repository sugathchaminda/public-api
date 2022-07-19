const ErrorHelper = require('../../../../errors/errorHelper');
const {
  getQueryStringFromRequest,
  getAccountRegNoFromRequest,
  getContentTypeFromRequest
} = require('../../../../utils/requestHelper');
const {
  getIncomingInvoices, readIncomingInvoices, updateIncomingInvoiceRead, beginTransaction, commitTransaction
} = require('../../../../utils/dbHelper');

const DEFAULT_LIMIT = 3;
const DEFAULT_SKIP = 0;

const getInvoices = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const offset = getQueryStringFromRequest(req)?.skip || DEFAULT_SKIP;
  const includeRead = getQueryStringFromRequest(req)?.includeRead || false;
  const accountRegNo = getAccountRegNoFromRequest(req);
  const contentType = getContentTypeFromRequest(req);

  try {
    const query = includeRead === 'true' ? {} : { readAt: null };

    return (await getIncomingInvoices(accountRegNo, limit, offset, query, contentType)).map((result) => result.invoice);
  } catch (err) {
    return ErrorHelper(err);
  }
};

const readInvoices = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const accountRegNo = getAccountRegNoFromRequest(req);
  const contentType = getContentTypeFromRequest(req);

  try {
    const query = {};
    const transaction = await beginTransaction();

    const invoiceSelectData = (await readIncomingInvoices(accountRegNo, limit, query, transaction.transactionId)).map((result) => result.id);
    const invoiceData = (await updateIncomingInvoiceRead(accountRegNo, invoiceSelectData, limit, contentType, transaction.transactionId))
      .map((result) => result.invoice);

    await commitTransaction(transaction.transactionId);

    return invoiceData;
  } catch (err) {
    return ErrorHelper(err);
  }
};

module.exports = {
  getInvoices,
  readInvoices
};
