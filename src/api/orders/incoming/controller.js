const controller = require('../../../controller');

const getValidation = require('../validation/get-validation');
const postValidation = require('../validation/post-validation');
const getIncomingOrderService = require('./service/get');
const postIncomingOrderService = require('./service/post');

const get = async (req, res) => {
  await controller(req, res, {
    validator: getValidation.getOrders,
    service: getIncomingOrderService.getOrders
  });
};

const post = async (req, res) => {
  await controller(req, res, {
    validator: postValidation.validateOrderRequest,
    service: postIncomingOrderService.postOrder
  });
};

const readOrders = async (req, res) => {
  await controller(req, res, {
    validator: getValidation.readOrders,
    service: getIncomingOrderService.readOrders
  });
};

module.exports = {
  get,
  post,
  readOrders
};
