const Joi = require('joi');
const common = require('./schemaHelper');

const postCreditNotes = () => {
  return Joi.object().keys({
    body: Joi.alternatives(
      Joi.string(), // If it is XML
      Joi.object().keys({
        CreditNote: Joi.array().required()
      }),
      Joi.object().keys({
        CreditNote: Joi.object().required()
      })
    ),
    contentType: Joi.string().valid(
      'application/json',
      'application/xml'
    ).required()
  }).concat(common.requireAccountRegNo());
}

const getCreditNotes = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    offset: Joi.number(),
    includeRead: Joi.boolean(),
    contentType: Joi.string().valid(
      'application/json'
    )
  }).concat(common.requireAccountRegNo());
}

const readCreditNotes = () => {
  return Joi.object().keys({
    limit: Joi.number(),
    contentType: Joi.string().valid(
      'application/json'
    )
  }).concat(common.requireAccountRegNo());
}

const batchCreditNotes = () => {
  return Joi.object().keys({
    body: Joi.object().keys({
      CreditNotes: Joi.array().required()
    }),
    contentType: Joi.string().valid(
      'application/json'
    ).required()
  }).concat(common.requireAccountRegNo());
}

module.exports = {
  postCreditNotes,
  getCreditNotes,
  readCreditNotes,
  batchCreditNotes
};
