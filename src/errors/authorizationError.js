function AuthorizationError({ message = 'Client is not authorized', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'AuthorizationError';
  this.type = 'E_UNAUTHORIZED_CLIENT';
  this.code = 401;
  this.message = message;
  this.metadata = metadata;
}

AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;

module.exports = AuthorizationError;
