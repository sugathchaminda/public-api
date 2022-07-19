function BadRequestError({ message = 'Bad Request', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'BadRequestError';
  this.type = 'E_BAD_REQUEST';
  this.code = 400;
  this.message = message;
  this.metadata = metadata;
}

BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;
