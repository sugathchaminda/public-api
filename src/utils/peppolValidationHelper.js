const axios = require('axios');
const { lambdaClient } = require('../libs/lambdaClient');

const formatResult = (result) => {
  const resultsArray = result.results;
  const invalidResults = resultsArray.filter((res) => res.success === 'FALSE');
  return invalidResults.map((res) => res.items).flat();
};

// This can be used if the user running the code does not have
// privileges to invoke the lambda in the relevant stage, or if the lambda
// does not exist for the stage.
const validatePeppolXmlUsingUrl = async (xml, type = 'invoice') => {
  let vesid = 'eu.peppol.bis3%3Ainvoice%3A3.12.0';
  switch (type) {
    case 'order':
      vesid = 'eu.peppol.bis3%3Aorder%3A3.12.0';
      break;
    case 'creditNote':
      vesid = 'eu.peppol.bis3%3Acreditnote%3A3.12.0';
      break;
    case 'invoice':
    default:
      vesid = 'eu.peppol.bis3%3Ainvoice%3A3.12.0';
      break;
  }
  const response = await axios({
    method: 'post',
    url: 'https://peppol.qvalia.com/peppol/validation',
    data: xml,
    headers: {
      'Content-type': 'application/xml'
    },
    timeout: 40000,
    params: {
      vesid
    }
  });
  try {
    const result = response.data;
    const valid = result.mostSevereErrorLevel !== 'ERROR';
    return {
      valid,
      result: formatResult(result)
    };
  } catch (err) {
    console.error('peppolValidationHelper.validatePeppolUsingUrl', err);
    throw new Error('unexpected response from peppol validation');
  }
};

// In order to use the test lambda for local dev we have this wrapper to get the
// stage for lambda arn.
const getAvailableStageForLambda = (stage) => {
  if (stage === 'dev' || stage === 'local') {
    return 'test';
  }
  return stage;
};

const validatePeppolXmlUsingLambda = async (xml, type = 'invoice') => {
  let vesid = 'eu.peppol.bis3%3Ainvoice%3A3.12.0';
  switch (type) {
    case 'order':
      vesid = 'eu.peppol.bis3%3Aorder%3A3.12.0';
      break;
    case 'creditNote':
      vesid = 'eu.peppol.bis3%3Acreditnote%3A3.12.0';
      break;
    case 'invoice':
    default:
      vesid = 'eu.peppol.bis3%3Ainvoice%3A3.12.0';
      break;
  }
  const payload = {
    httpMethod: 'POST',
    path: '/peppol/validation',
    queryStringParameters: {
      vesid
    },
    headers: {
      accept: 'application/xml'
    },
    body: Buffer.from(xml.toString())
      .toString('base64'),
    isBase64Encoded: true
  };

  const params = {
    FunctionName: `qvalia-peppol-phase4-as4-${getAvailableStageForLambda(process.env.LAMBDA_STAGE)}-peppol-validation-server`,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(payload)
  };
  const response = await lambdaClient.invoke(params)
    .promise();

  try {
    const responsePayload = response.Payload;
    const parsedPayload = JSON.parse(responsePayload);
    const result = JSON.parse(parsedPayload.body);
    const valid = result.mostSevereErrorLevel !== 'ERROR';
    return {
      valid,
      result: formatResult(result)
    };
  } catch (err) {
    console.error('peppolValidationHelper.validatePeppolUsingLambda', err);
    throw new Error('unexpected response from peppol validation');
  }
};

const reduceAttachedBinarySize = (xml) => {
  if (xml.includes('EmbeddedDocumentBinaryObject ')) {
    // We have one or more attachment(s)
    // We'll strip the attachemnt base64 data and re place with a smaller valid base 64 to allow the size to be smaller
    const base64min = 'dmFsaWQgYmFzZTY0'; // = "valid base64"
    // We create a RegEx with groups of the base64 original and replace all with the minimized base64 for validation
    return xml.replace(
      /(:EmbeddedDocumentBinaryObject[\s\S]*?>)([\s\S]*?)(<\/[\s\S]*?:EmbeddedDocumentBinaryObject>)/g,
      `$1${base64min}$3`
    );
  }
  return xml;
};

const validatePeppolXml = (xml, type = 'invoice') => {
  const xmlToValidate = reduceAttachedBinarySize(xml);
  if (process.env.USE_URL_VALIDATION) {
    return validatePeppolXmlUsingUrl(xmlToValidate, type);
  }
  return validatePeppolXmlUsingLambda(xmlToValidate, type);
};

module.exports = {
  validatePeppolXml
};
