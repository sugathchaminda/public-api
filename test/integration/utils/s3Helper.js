const { s3Client } = require('../../../src/libs/s3Client');

const createBucket = async (name) => s3Client.createBucket({
  Bucket: name
}).promise().catch((err) => {
  if (err.code === 'BucketAlreadyOwnedByYou' || err.code === 'BucketAlreadyExists') {
    console.log(`S3 bucket ${name} already created`);
  } else {
    throw err;
  }
});

module.exports = {
  createBucket
};
