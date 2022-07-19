function PermissionError({ message = 'Client missing permission', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'PermissionError';
  this.type = 'E_MISSING_PERMISSION';
  this.code = 403;
  this.message = message;
  this.metadata = metadata;
}

PermissionError.prototype = Object.create(Error.prototype);
PermissionError.prototype.constructor = PermissionError;

module.exports = PermissionError;
