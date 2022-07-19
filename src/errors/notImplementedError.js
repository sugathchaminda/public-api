function NotImplementedError({
  message = 'Not implemented',
  extra = {}
} = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'NotImplementedError';
  this.type = 'E_NOT_IMPLEMENTED';
  this.code = 501;
  this.message = message;
  this.metadata = extra;
}

NotImplementedError.prototype = Object.create(Error.prototype);
NotImplementedError.prototype.constructor = NotImplementedError;

module.exports = NotImplementedError;
