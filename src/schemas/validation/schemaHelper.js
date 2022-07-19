const Joi = require('joi');

function requireAccountRegNo() {
  return Joi
    .object()
    .keys({
      accountRegNo: Joi.string().required()
    });
}

module.exports = {
  requireAccountRegNo
};
