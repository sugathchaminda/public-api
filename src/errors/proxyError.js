function ProxyError({ message = 'Something went wrong with the request', metadata = null } = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ProxyError';
  this.type = 'E_INTERNAL_PROXY_ERROR';
  this.code = 500;
  this.message = message;
  this.metadata = metadata;
}

ProxyError.prototype = Object.create(Error.prototype);
ProxyError.prototype.constructor = ProxyError;

module.exports = ProxyError;
