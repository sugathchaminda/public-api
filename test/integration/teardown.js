const {
  clearOutgoingInvoices,
  clearIncomingInvoices
} = require('./utils/databaseHelper');
const { stopSlsOffline } = require('./utils/serverlessOfflineHelper');

/*
* Note this is a workaround to force the integration tests to exit even though we are running async
* code in after hooks.
*
* */

module.exports = async () => {
  await clearOutgoingInvoices();
  await clearIncomingInvoices();
  if (process.env.RUN_SLS_OFFLINE_IN_INTEGRATION_TEST) {
    await stopSlsOffline();
  }
  console.log('INTEGRATION TEST RESOURCES SUCCESSFULLY REMOVED');
  process.exit();
};
