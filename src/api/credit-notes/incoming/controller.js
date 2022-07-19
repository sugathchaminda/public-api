const controller = require('../../../controller');

const getValidation = require('../validation/get-validation');
const postValidation = require('../validation/post-validation');
const getIncomingCreditNoteService = require('./service/get');
const postIncomingCreditNoteService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getValidation.getCreditNotes,
    service: getIncomingCreditNoteService.getCreditNotes
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postValidation.validateCreditNoteRequest,
    service: postIncomingCreditNoteService.postCreditNote
  });
};

const readCreditNotes = async (req, res) => {
  await controller(req, res, {
    validator: getValidation.readCreditNotes,
    service: getIncomingCreditNoteService.readCreditNotes
  });
};

module.exports = {
  get,
  post,
  readCreditNotes
};
