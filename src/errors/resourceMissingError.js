function ResourceMissingError({ message = 'Resource not found', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ResourceMissingError';
  this.type = 'E_MISSING';
  this.code = 404;
  this.message = message;
  this.metadata = metadata;
}

ResourceMissingError.prototype = Object.create(Error.prototype);
ResourceMissingError.prototype.constructor = ResourceMissingError;

module.exports = ResourceMissingError;
