const AuthenticationError = require('./authenticationError');
const AuthorizationError = require('./authorizationError');
const PermissionError = require('./permissionError');
const ResourceMissingError = require('./resourceMissingError');
const ProxyError = require('./proxyError');
const BadRequestError = require('./badRequestError');
const ValidationError = require('./validationError');
const ConflictError = require('./conflictError');
const NotImplementedError = require('./notImplementedError');

function buildMetadata({ error = {}, metadata }) {
  if (metadata) {
    return metadata;
  }

  return {
    debug_error_message: error.message,
    debug_error_code: error.code,
    debug_error_data: error.data
  };
}

module.exports = function ErrorHelper(error, metadata) {
  // NB! We always want to log error and Trace to CloudWatch!
  console.log('ErrorHelper', error, metadata);
  console.trace();

  switch (error.code) {
    case 400:
      throw new BadRequestError({
        metadata: buildMetadata({ error, metadata })
      });
    case 401:
      if (metadata.unsuccessfulLogin) {
        throw new AuthenticationError({
          metadata: buildMetadata({ error, metadata })
        });
      }
      throw new AuthorizationError();
    case 403:
      throw new PermissionError();
    case 404:
      throw new ResourceMissingError();
    case 409:
      throw new ConflictError({
        metadata: buildMetadata({ error, metadata })
      });
    case 422:
      throw new ValidationError({
        metadata: buildMetadata({ error, metadata })
      });
    case 501:
      throw new NotImplementedError();
    default:
      throw new ProxyError({
        metadata: buildMetadata({ error, metadata })
      });
  }
};
