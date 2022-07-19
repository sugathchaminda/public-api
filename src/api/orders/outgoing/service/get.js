const ErrorHelper = require('../../../../errors/errorHelper');
const NotImplementedError = require('../../../../errors/notImplementedError');

const getOrders = () => ErrorHelper(new NotImplementedError());

module.exports = {
  getOrders
};
