function DatabaseError({
  message = 'Error while reading or writing to database.',
  extra = {}
} = {}) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'DatabaseError';
  this.type = 'E_DATABASE';
  this.message = message;
  this.metadata = extra;
}

DatabaseError.prototype = Object.create(Error.prototype);
DatabaseError.prototype.constructor = DatabaseError;

module.exports = DatabaseError;
