const ErrorHelper = require('../../../../errors/errorHelper');
const NotImplementedError = require('../../../../errors/notImplementedError');

const getCreditNotes = () => ErrorHelper(new NotImplementedError());

module.exports = {
  getCreditNotes
};
