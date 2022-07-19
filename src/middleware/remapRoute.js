const { getPath, getHttpMethod } = require('../utils/httpApiEventHelper');

/* eslint-disable no-param-reassign */
module.exports = (event) => {
  // lambda-api doesn't support v2.0 of HTTP API, remap the route!
  // HTTP API v2.0 adds the `stage` to the path so remove it as v1.0 omits the stage
  event.path = getPath(event);
  event.httpMethod = getHttpMethod(event);
};
