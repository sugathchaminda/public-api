const { get, post, batch } = require('../api/invoices/outgoing/controller');

const baseUrl = '/transaction/:accountRegNo/invoices/outgoing';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.post(baseUrl, post);
  api.post(`${baseUrl}/batch`, batch);
};
