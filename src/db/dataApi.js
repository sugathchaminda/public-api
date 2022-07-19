const dataApiClient = require('data-api-client');

const db = dataApiClient({
  secretArn: process.env.RDS_AURORA_DATA_API_SECRET_ARN || '',
  resourceArn: process.env.RDS_AURORA_DATA_API_ARN || '',
  database: process.env.RDS_AURORA_DATA_API_MDS_DB || '',
  region: 'eu-west-1',
  options: {
    endpoint:
      process.env.IS_OFFLINE
        ? process.env.AURORA_LOCAL_ENDPOINT || 'http://0.0.0.0:8080'
        : null
  }
});

module.exports = db;
