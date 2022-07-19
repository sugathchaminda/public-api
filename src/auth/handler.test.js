const { auth } = require('./handler');

const createAuthEventExample = (authKey) => ({
  enhancedAuthContext: {},
  methodArn: 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/dev/GET/transaction/{proxy*}',
  requestContext: {
    accountId: 'random-account-id',
    apiId: 'random-api-id',
    httpMethod: 'GET',
    requestId: 'random-request-id',
    resourceId: 'random-resource-id',
    resourcePath: '/transaction/{proxy*}',
    path: '/transaction/SE5567321707/invoices/incoming',
    stage: 'dev'
  },
  resource: '/transaction/{proxy*}',
  authorizationToken: authKey,
  headers: {
    authorization: authKey
  },
  type: 'TOKEN'
});

const validAuthKey = '7093d897c0b35fe9d8f4af97219ea5e0e7b100445238a7b14233d012e97c79973dd4caba4dabad1771cddb4ebec9a14d4be30a88751d47c62bc2c138ffe568d0';

jest.mock('../utils/authUtils', () => ({
  validateKey: async (account, party, key) => key === validAuthKey
}));

test('auth handler should return isAuthorized response (true) given valid auth key', async () => {
  const exampleEvent = createAuthEventExample(validAuthKey);
  const authResult = await auth(exampleEvent);

  expect(authResult.context).toHaveProperty('principalId');
  expect(authResult.context.principalId).toBe('SE5567321707');
  expect(authResult.isAuthorized).toBe(true);
});

test('auth handler should return isAuthorized response (false) given invalid auth key', async () => {
  const invalidAuthKey = 'nonsense';
  const exampleEvent = createAuthEventExample(invalidAuthKey);
  await expect(auth(exampleEvent)).rejects.toThrowError('Unauthorized');
});
