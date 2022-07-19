const remapRoute = require('./remapRoute');
const cors = require('./cors');

module.exports.load = (api, event) => {
  remapRoute(event);
  api.use(cors);
};
