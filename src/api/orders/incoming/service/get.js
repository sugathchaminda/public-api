const ErrorHelper = require('../../../../errors/errorHelper');
const {
  getQueryStringFromRequest,
  getAccountRegNoFromRequest
} = require('../../../../utils/requestHelper');
const {
  getIncomingOrders,
  readIncomingOrders,
  updateIncomingOrderRead,
  beginTransaction,
  commitTransaction
} = require('../../../../utils/orderDbHelper');

const DEFAULT_LIMIT = 3;
const DEFAULT_SKIP = 0;

const getOrders = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const offset = getQueryStringFromRequest(req)?.skip || DEFAULT_SKIP;
  const includeRead = getQueryStringFromRequest(req)?.includeRead || false;
  const accountRegNo = getAccountRegNoFromRequest(req);

  try {
    const query = includeRead === 'true' ? {} : { readAt: null };
    return (await getIncomingOrders(accountRegNo, limit, offset, query)).map((result) => result.order);
  } catch (err) {
    return ErrorHelper(err);
  }
};

const readOrders = async (req) => {
  const limit = getQueryStringFromRequest(req)?.limit || DEFAULT_LIMIT;
  const accountRegNo = getAccountRegNoFromRequest(req);
  try {
    const query = {};
    const transaction = await beginTransaction();
    const orderSelectData = (await readIncomingOrders(accountRegNo, limit, query, transaction.transactionId)).map((result) => result.id);
    const orderData = (await updateIncomingOrderRead(accountRegNo, orderSelectData, limit, transaction.transactionId)).map((result) => result.order);
    await commitTransaction(transaction.transactionId);
    return orderData;
  } catch (err) {
    return ErrorHelper(err);
  }
};

module.exports = {
  getOrders,
  readOrders
};
