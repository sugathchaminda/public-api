const { get, post, batch } = require('../api/orders/outgoing/controller');

const baseUrl = '/transaction/:accountRegNo/orders/outgoing';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.post(baseUrl, post);
  api.post(`${baseUrl}/batch`, batch);
};
