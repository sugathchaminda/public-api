const ErrorHelper = require('../../../../errors/errorHelper');
const NotImplementedError = require('../../../../errors/notImplementedError');

const getInvoices = () => ErrorHelper(new NotImplementedError());

module.exports = {
  getInvoices
};
