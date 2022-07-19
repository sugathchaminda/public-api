const controller = require('../../../controller');

const getInvoiceValidation = require('../validation/get-validation');
const postinvoiceValidation = require('../validation/post-validation');
const incomingInvoiceService = require('./service/get');
const postIncomingInvoiceService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getInvoiceValidation.getInvoices,
    service: incomingInvoiceService.getInvoices
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postinvoiceValidation.validateInvoiceRequest,
    service: postIncomingInvoiceService.postInvoice
  });
};

const readInvoices = async (req, res) => {
  await controller(req, res, {
    validator: getInvoiceValidation.readInvoices,
    service: incomingInvoiceService.readInvoices
  });
};

module.exports = {
  get,
  post,
  readInvoices
};
