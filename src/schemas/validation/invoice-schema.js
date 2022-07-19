const Joi = require('joi');
const common = require('./schemaHelper');

const postInvoices = () => {
  return Joi.object().keys({
    body: Joi.alternatives(
      Joi.string(), // If it is XML
      Joi.object().keys({
        Invoice: Joi.array().required() // Allow an array of invoices (UBL JSON)
      }),
      Joi.object().keys({
        Invoice: Joi.object().required() // Object as invoice (Public API JSON)
      })
    ),
    contentType: Joi.string().valid(
      'application/json',
      'application/xml'
    ).required()
  }).concat(common.requireAccountRegNo());
}

const batchInvoices = () => {
  return Joi.object().keys({
    body: Joi.object().keys({
      Invoices: Joi.array().required() // Allow an array of invoices
    }),
    contentType: Joi.string().valid(
      'application/json'
    ).required()
  }).concat(common.requireAccountRegNo());
}

const getInvoices = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    offset: Joi.number(),
    includeRead: Joi.boolean(),
    contentType: Joi.string().valid(
      'application/json',
      'application/xml',
    )
  }).concat(common.requireAccountRegNo());
}

const readInvoices = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    contentType: Joi.string().valid(
      'application/json',
      'application/xml',
    )
  }).concat(common.requireAccountRegNo());
}

module.exports = {
  postInvoices,
  batchInvoices,
  getInvoices,
  readInvoices
};
