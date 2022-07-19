const controller = require('../../../controller');
const getCreditNoteValidation = require('../validation/get-validation');
const postCreditNoteValidation = require('../validation/post-validation');
const getOutgoingCreditNoteService = require('./service/get');
const postOutgoingCreditNoteService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getCreditNoteValidation.getCreditNotes,
    service: getOutgoingCreditNoteService.getCreditNotes
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postCreditNoteValidation.validateCreditNoteRequest,
    service: postOutgoingCreditNoteService.postCreditNote
  });
};

const batch = async (req, res) => {
  await controller(req, res, {
    validator: postCreditNoteValidation.validateBatchCreditNoteRequest,
    service: postOutgoingCreditNoteService.batchCreditNotes
  });
};

module.exports = {
  get,
  post,
  batch
};
