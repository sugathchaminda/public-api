const _ = require('lodash');

async function validate(attributes, validateFunction) {
  return validateFunction()
    .validate(attributes, {
      allowUnknown: true,
      abortEarly: false,
    });
}

function clean(object) {
  return _.omitBy(object, _.isUndefined);
}

function getContentType(string) {
  return string.split(';')[0];
}

module.exports = {
  validate,
  clean,
  getContentType
};
