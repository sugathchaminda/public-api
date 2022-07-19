/* eslint-disable no-underscore-dangle */
const { convertPaJsonToUblXml } = require('./paJsonHelper');

const getError = (error) => {
  const errorType = error.type || 'E_UNKNOWN';
  const errorMessage = error.message || 'An unknown error occured';
  const metadata = error.metadata || null;
  let errorStatusCode;

  switch (error.type) {
    case 'E_INVALID_PARAMETER':
      errorStatusCode = 400;
      break;
    case 'E_UNAUTHORIZED_CLIENT':
      errorStatusCode = 401;
      break;
    case 'E_CLIENT_UNSUCCESSFUL_AUTHENTICATION':
      errorStatusCode = 401;
      break;
    case 'E_MISSING_PERMISSION':
      errorStatusCode = 403;
      break;
    case 'E_MISSING':
      errorStatusCode = 404;
      break;
    case 'E_AWS_ERROR':
      errorStatusCode = 400;
      break;
    case 'E_CONFLICT':
      errorStatusCode = 409;
      break;
    case 'E_VALIDATION':
      errorStatusCode = 422;
      break;
    default:
      errorStatusCode = 500;
  }

  // Remove the api-key from the error response!
  // Not sure how/why it ends up under the "auth" attribute but remove both to be safe!
  if (metadata && metadata._original) {
    delete metadata._original.auth;
    delete metadata._original.authorization;
  }

  return {
    statusCode: errorStatusCode,
    metadata,
    response: {
      status: 'error',
      type: errorType,
      data: errorMessage
    }
  };
};

async function defaultReject(error, response) {
  const errorValue = getError(error);
  const metadata = errorValue.metadata?.json || errorValue.metadata;

  return response
    .status(errorValue.statusCode)
    .json({ ...errorValue.response, metadata });
}

const defaultRejectXML = async (error, res) => {
  const errorValue = getError(error);

  const metaData = errorValue.metadata?.xml || errorValue.metadata;
  const xmlMetadata = typeof metaData === 'object' ? await convertPaJsonToUblXml(metaData, { headless: true, rootName: 'debug' }) : metaData;

  const errorResponse = `<error>
        <status>${errorValue.response.status}</status>
        <type>${errorValue.response.type}</type>
        <data>${errorValue.response.data}</data>
        <metadata>${xmlMetadata}</metadata>
    </error>`;

  return res
    .status(errorValue.statusCode)
    .type('application/xml')
    .send(errorResponse);
};

const defaultResolveXML = (res, data) => {
  const successResponse = `<success>
        <status>success</status>
        <data>${data}</data>
    </success>`;

  return res
    .status(200)
    .type('application/xml')
    .send(successResponse);
};

const defaultResolve = (res, data) => {
  const successResponse = {
    status: 'success',
    data
  };

  return res
    .status(200)
    .json(successResponse);
};

module.exports = {
  defaultReject,
  defaultResolve,
  defaultResolveXML,
  defaultRejectXML
};
