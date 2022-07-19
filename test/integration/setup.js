const fs = require('fs');
const { runMigrations } = require('./utils/migrateDatabase');
const {
  startSlsOffline,
  stopSlsOffline
} = require('./utils/serverlessOfflineHelper');
const { createBucket } = require('./utils/s3Helper');
const { createQueue } = require('./utils/sqsHelper');
const { createAuthKeyTable } = require('./utils/dynamoDbHelper');
const { validatePeppolXml } = require('../../src/utils/peppolValidationHelper');

module.exports = async () => {
  await runMigrations();
  if (process.env.RUN_SLS_OFFLINE_IN_INTEGRATION_TEST) {
    await startSlsOffline();
  }
  try {
    await createBucket('qvalia.filestore.local.einvoice-zip');
    await createBucket('qvalia.qip.local.store.attachment');
    await createQueue('lambda-local-receiveinvoice');
    await createAuthKeyTable();
  } catch (err) {
    if (process.env.RUN_SLS_OFFLINE_IN_INTEGRATION_TEST) {
      await stopSlsOffline();
    }
    throw err;
  }

  // Warm up the peppol Validationlambda, sometimes it must rebuild due to innactivity
  // By calling it once in setup we force it to be rebuilt when running the tests.
  const invoice = fs.readFileSync('./test/mockData/xml/invoice/base-example.xml').toString();
  process.env.LAMBDA_STAGE = 'test';
  console.log('Warming up peppol lambda...');
  const result = await validatePeppolXml(invoice);
  console.log('Peppol validation result from warmup: ', result);
  console.log('INTEGRATION TEST RESOURCES SUCCESSFULLY SETUP');
};
