const { get, post, readInvoices } = require('../api/invoices/incoming/controller');

const baseUrl = '/transaction/:accountRegNo/invoices/incoming';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.get(`${baseUrl}/readInvoices`, readInvoices);
  api.post(baseUrl, post);
};
