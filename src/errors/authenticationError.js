function AuthenticationError({ message = 'Client is not authenticated', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'AuthenticationError';
  this.type = 'E_CLIENT_UNSUCCESSFUL_AUTHENTICATION';
  this.code = 401;
  this.message = message;
  this.metadata = metadata;
}

AuthenticationError.prototype = Object.create(Error.prototype);
AuthenticationError.prototype.constructor = AuthenticationError;

module.exports = AuthenticationError;
