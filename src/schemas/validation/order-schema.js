const Joi = require('joi');
const common = require('./schemaHelper');

const postOrders = () => {
  return Joi.object().keys({
    body: Joi.alternatives(
      Joi.string(), // If it is XML
      Joi.object().keys({
        Order: Joi.array().required() // Allow an array of orders (UBL JSON)
      }),
      Joi.object().keys({
        Order: Joi.object().required() // Object as order (Public API JSON)
      })
    ),
    contentType: Joi.string().valid(
      'application/json',
      'application/xml'
    ).required()
  }).concat(common.requireAccountRegNo());
}

const getOrders = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    offset: Joi.number(),
    includeRead: Joi.boolean(),
    contentType: Joi.string().valid(
      'application/json'
    )
  }).concat(common.requireAccountRegNo());
}

const readOrders = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    contentType: Joi.string().valid(
      'application/json'
    )
  }).concat(common.requireAccountRegNo());
}

const batchOrders = () => {
  return Joi.object().keys({
    body: Joi.object().keys({
      Orders: Joi.array().required()
    }),
    contentType: Joi.string().valid(
      'application/json'
    ).required()
  }).concat(common.requireAccountRegNo());
}

module.exports = {
  postOrders,
  getOrders,
  readOrders,
  batchOrders
};
