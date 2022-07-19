function ConflictError({ message = 'Conflicting payload', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ConflictError';
  this.type = 'E_CONFLICT';
  this.code = 409;
  this.message = message;
  this.metadata = metadata;
}

ConflictError.prototype = Object.create(Error.prototype);
ConflictError.prototype.constructor = ConflictError;

module.exports = ConflictError;
