const { s3Client } = require('../libs/s3Client');

const writeToS3 = async (body, s3key, bucketName, options = {}) => {
  const bodyString = typeof body === 'object' && !Buffer.isBuffer(body) ? JSON.stringify(body) : body; // We can write String and Buffer but not object

  const params = {
    Bucket: bucketName,
    Key: s3key,
    Body: bodyString
  };
  console.log('Writing binary attachment:', bucketName, s3key);

  const paramsWithOptions = { ...params, ...options };

  return s3Client.upload(paramsWithOptions).promise();
};

const removeFromS3 = async (key, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  return s3Client.deleteObject(params).promise();
};

const getMetaDataFromS3 = (key, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  return s3Client.headObject(params).promise();
};

const getFromS3 = async (key, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  return s3Client.getObject(params).promise();
};

module.exports = {
  removeFromS3,
  writeToS3,
  getFromS3,
  getMetaDataFromS3
};
