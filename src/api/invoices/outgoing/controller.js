const controller = require('../../../controller');
const getInvoiceValidation = require('../validation/get-validation');
const postInvoiceValidation = require('../validation/post-validation');
const getOutgoingInvoiceService = require('./service/get');
const postOutgoingInvoiceService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getInvoiceValidation.Invoices,
    service: getOutgoingInvoiceService.getInvoices
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postInvoiceValidation.validateInvoiceRequest,
    service: postOutgoingInvoiceService.postInvoice
  });
};

const batch = async (req, res) => {
  await controller(req, res, {
    validator: postInvoiceValidation.validateBatchInvoiceRequest,
    service: postOutgoingInvoiceService.batchInvoices
  });
};

module.exports = {
  get,
  post,
  batch
};
