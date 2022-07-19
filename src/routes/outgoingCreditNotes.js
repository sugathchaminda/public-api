const { get, post, batch } = require('../api/credit-notes/outgoing/controller');

const baseUrl = '/transaction/:accountRegNo/creditNotes/outgoing';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.post(baseUrl, post);
  api.post(`${baseUrl}/batch`, batch);
};
