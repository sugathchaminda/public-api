const { get, post, readOrders } = require('../api/orders/incoming/controller');

const baseUrl = '/transaction/:accountRegNo/orders/incoming';

module.exports.loadRoutes = (api) => {
  api.get(baseUrl, get);
  api.get(`${baseUrl}/readOrders`, readOrders);
  api.post(baseUrl, post);
};
