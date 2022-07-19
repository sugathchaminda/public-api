const { validateKey } = require('../utils/authUtils');
const { getPath } = require('../utils/httpApiEventHelper');

const generateOfflinePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    policyDocument.Statement.push({
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    });
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

// NOTE SERVERLESS OFFLINE DOES NOT SEEM TO SUPPORT PAYLOAD VS 2.0. BUT THIS WOULD BE THE RESPONSE IN THAT CASE...
const generatePolicy = (principalId, effect, resource) => ({
  isAuthorized: (effect === 'Allow'),
  context: {
    principalId,
    resource
  }
});

exports.auth = async (event) => {
  /*
      We assume we always have regNo in third position:
      /transaction/SE5567321707/...
    */

  const accountRegNo = getPath(event).split('/')[2];
  const partyRegNo = accountRegNo; // This will be the regNo for Client or Supplier
  const authToken = event.headers?.authorization || event.authorizationToken;

  if (!authToken) {
    throw new Error('Unauthorized');
  }

  // Should not happen since part of path. But sanity-check.
  if (!accountRegNo) {
    throw new Error('Unauthorized');
  }

  try {
    // Local testing vvvv
    // const authed = process.env.IS_OFFLINE || await validateKey(accountRegNo, partyRegNo, authToken, event);
    const authed = await validateKey(accountRegNo, partyRegNo, authToken, event);
    if (authed) {
      if (process.env.IS_OFFLINE) {
        // For some reason serverless offline defaults to v1 of payload regardless of payload version in specification.
        return generateOfflinePolicy(accountRegNo, 'Allow', event.methodArn);
      }
      return generatePolicy(accountRegNo, 'Allow', event.methodArn);
    }
  } catch (err) {
    console.error('auth/handler.js#auth', err);
    throw new Error('Unauthorized');
  }
  // Since we are not doing authorization, and only auth in handler we return error here to return 401 instead of 403.
  throw new Error('Unauthorized');
};
