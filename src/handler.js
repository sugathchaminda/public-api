const api = require('lambda-api')({ version: 'v1.0', base: '/' });
const errorReporter = require('./utils/errorReporter');
const routes = require('./routes');
const middleware = require('./middleware');
const { getVersionFromRequest } = require('./utils/requestHelper');

exports.run = async (event, context) => {
  middleware.load(api, event);
  api.version = getVersionFromRequest(event);
  routes.load(api);

  try {
    return await api.run(event, context);
  } catch (err) {
    console.log('ERR: ', err);

    // FIXME: Never hits here..
    errorReporter.sendError(err);
    throw new Error('Unknown error occured, handler.js');
  }
};
