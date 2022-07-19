const { get, post, readCreditNotes } = require('../api/credit-notes/incoming/controller');

const baseUrl = '/transaction/:accountRegNo/creditNotes/incoming';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.get(`${baseUrl}/readCreditNotes`, readCreditNotes);
  api.post(baseUrl, post);
};
