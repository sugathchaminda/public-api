const controller = require('../../../controller');
const getOrderValidation = require('../validation/get-validation');
const postOrderValidation = require('../validation/post-validation');
const getOutgoingOrderService = require('./service/get');
const postOutgoingOrderService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getOrderValidation.getOrders,
    service: getOutgoingOrderService.getOrders
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postOrderValidation.validateOrderRequest,
    service: postOutgoingOrderService.postOrder
  });
};

const batch = async (req, res) => {
  await controller(req, res, {
    validator: postOrderValidation.validateBatchOrderRequest,
    service: postOutgoingOrderService.batchOrders
  });
};

module.exports = {
  get,
  post,
  batch
};
