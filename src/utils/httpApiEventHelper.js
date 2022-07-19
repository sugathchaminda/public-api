// Helpers to allow the api to be agnostic regarding payload version. This is so that
// we can use serverless offline to test.

// HTTP API v2.0 adds the `stage` to the path so remove it as v1.0 omits the stage
const getPath = (event) => event.path || event.requestContext.path || event.requestContext.http.path.replace(`/${event.requestContext.stage}`, '');

const getHttpMethod = (event) => {
  let htttpMethod;
  if (event && event.httpMethod) {
    htttpMethod = event.httpMethod;
  } else if (event && event.requestContext) {
    htttpMethod = event.requestContext.http.method;
  } else {
    htttpMethod = null;
  }

  return htttpMethod;
};

const getAuthToken = (event) => event.authorizationToken || event.headers.authorization;

module.exports = {
  getPath,
  getHttpMethod,
  getAuthToken
};
