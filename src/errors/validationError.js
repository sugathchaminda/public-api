function ValidationError({ message = 'Invalid payload', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ValidationError';
  this.type = 'E_VALIDATION';
  this.code = 422;
  this.message = message;
  this.metadata = metadata;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;
