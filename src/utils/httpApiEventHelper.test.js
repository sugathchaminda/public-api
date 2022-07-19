const {
  getPath, getHttpMethod,
  getAuthToken
} = require('./httpApiEventHelper');

const v1Event = {
  version: '1.0',
  resource: '/my/path',
  path: '/my/path',
  httpMethod: 'GET',
  headers: {
    header1: 'value1',
    header2: 'value2'
  },
  multiValueHeaders: {
    header1: [
      'value1'
    ],
    header2: [
      'value1',
      'value2'
    ]
  },
  queryStringParameters: {
    parameter1: 'value1',
    parameter2: 'value'
  },
  multiValueQueryStringParameters: {
    parameter1: [
      'value1',
      'value2'
    ],
    parameter2: [
      'value'
    ]
  },
  requestContext: {
    accountId: '123456789012',
    apiId: 'id',
    authorizer: {
      claims: null,
      scopes: null
    },
    domainName: 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'id',
    extendedRequestId: 'request-id',
    httpMethod: 'GET',
    identity: {
      accessKey: null,
      accountId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: 'IP',
      user: null,
      userAgent: 'user-agent',
      userArn: null,
      clientCert: {
        clientCertPem: 'CERT_CONTENT',
        subjectDN: 'www.example.com',
        issuerDN: 'Example issuer',
        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
        validity: {
          notBefore: 'May 28 12:30:02 2019 GMT',
          notAfter: 'Aug  5 09:36:04 2021 GMT'
        }
      }
    },
    path: '/my/path',
    protocol: 'HTTP/1.1',
    requestId: 'id=',
    requestTime: '04/Mar/2020:19:15:17 +0000',
    requestTimeEpoch: 1583349317135,
    resourceId: null,
    resourcePath: '/my/path',
    stage: '$default'
  },
  pathParameters: null,
  stageVariables: null,
  body: 'Hello from Lambda!',
  isBase64Encoded: false
};

const v2Event = {
  version: '2.0',
  routeKey: '$default',
  rawPath: '/my/path',
  rawQueryString: 'parameter1=value1&parameter1=value2&parameter2=value',
  cookies: [
    'cookie1',
    'cookie2'
  ],
  headers: {
    header1: 'value1',
    header2: 'value1,value2'
  },
  queryStringParameters: {
    parameter1: 'value1,value2',
    parameter2: 'value'
  },
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    authentication: {
      clientCert: {
        clientCertPem: 'CERT_CONTENT',
        subjectDN: 'www.example.com',
        issuerDN: 'Example issuer',
        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
        validity: {
          notBefore: 'May 28 12:30:02 2019 GMT',
          notAfter: 'Aug  5 09:36:04 2021 GMT'
        }
      }
    },
    authorizer: {
      jwt: {
        claims: {
          claim1: 'value1',
          claim2: 'value2'
        },
        scopes: [
          'scope1',
          'scope2'
        ]
      }
    },
    domainName: 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'id',
    http: {
      method: 'GET',
      path: '/my/path',
      protocol: 'HTTP/1.1',
      sourceIp: 'IP',
      userAgent: 'agent'
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390
  },
  body: 'Hello from Lambda',
  pathParameters: {
    parameter1: 'value1'
  },
  isBase64Encoded: false,
  stageVariables: {
    stageVariable1: 'value1',
    stageVariable2: 'value2'
  }
};

const v1AuthEvent = {
  version: '1.0',
  type: 'REQUEST',
  methodArn: 'arn:aws:execute-api:us-east-1:123456789012:abcdef123/test/GET/request',
  identitySource: 'user1,123',
  authorizationToken: 'user1,123',
  resource: '/request',
  path: '/request',
  httpMethod: 'GET',
  headers: {
    'X-AMZ-Date': '20170718T062915Z',
    Accept: '*/*',
    HeaderAuth1: 'headerValue1',
    'CloudFront-Viewer-Country': 'US',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'User-Agent': '...'
  },
  queryStringParameters: {
    QueryString1: 'queryValue1'
  },
  pathParameters: {},
  stageVariables: {
    StageVar1: 'stageValue1'
  },
  requestContext: {
    path: '/request',
    accountId: '123456789012',
    resourceId: '05c7jb',
    stage: 'test',
    requestId: '...',
    identity: {
      apiKey: '...',
      sourceIp: '...',
      clientCert: {
        clientCertPem: 'CERT_CONTENT',
        subjectDN: 'www.example.com',
        issuerDN: 'Example issuer',
        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
        validity: {
          notBefore: 'May 28 12:30:02 2019 GMT',
          notAfter: 'Aug  5 09:36:04 2021 GMT'
        }
      }
    },
    resourcePath: '/request',
    httpMethod: 'GET',
    apiId: 'abcdef123'
  }
};

const v2AuthEvent = {
  version: '2.0',
  type: 'REQUEST',
  routeArn: 'arn:aws:execute-api:us-east-1:123456789012:abcdef123/test/GET/request',
  identitySource: ['user1', '123'],
  routeKey: '$default',
  rawPath: '/my/path',
  rawQueryString: 'parameter1=value1&parameter1=value2&parameter2=value',
  cookies: ['cookie1', 'cookie2'],
  headers: {
    authorization: 'user1,123'
  },
  queryStringParameters: {
    parameter1: 'value1,value2',
    parameter2: 'value'
  },
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    authentication: {
      clientCert: {
        clientCertPem: 'CERT_CONTENT',
        subjectDN: 'www.example.com',
        issuerDN: 'Example issuer',
        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
        validity: {
          notBefore: 'May 28 12:30:02 2019 GMT',
          notAfter: 'Aug  5 09:36:04 2021 GMT'
        }
      }
    },
    domainName: 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'id',
    http: {
      method: 'POST',
      path: '/my/path',
      protocol: 'HTTP/1.1',
      sourceIp: 'IP',
      userAgent: 'agent'
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390
  },
  pathParameters: { parameter1: 'value1' },
  stageVariables: { stageVariable1: 'value1', stageVariable2: 'value2' }
};

test('gets path from v1.0 event', () => {
  const v1Path = getPath(v1Event);
  expect(v1Path).toBe('/my/path');
});

test('gets path from v2.0 event', () => {
  const v2Path = getPath(v2Event);
  expect(v2Path).toBe('/my/path');
});

test('gets the same path from v1.0 event as v2.0 event', () => {
  const v1Path = getPath(v1Event);
  const v2Path = getPath(v2Event);
  expect(v1Path).toBe(v2Path);
});

test('gets HttpMethod from v1.0 event', () => {
  const v1Method = getHttpMethod(v1Event);
  expect(v1Method).toBe('GET');
});

test('gets HttpMethod from v2.0 event', () => {
  const v2Method = getHttpMethod(v2Event);
  expect(v2Method).toBe('GET');
});

test('gets the same HTTPMethod from v1.0 and v2.0 event', () => {
  const v1Method = getHttpMethod(v1Event);
  const v2Method = getHttpMethod(v2Event);
  expect(v1Method).toBe(v2Method);
});

test('gets Auth token from v1.0 event', () => {
  const v1Token = getAuthToken(v1AuthEvent);
  expect(v1Token).toBe('user1,123');
});

test('gets Auth token from v2.0 event', () => {
  const v2Token = getAuthToken(v2AuthEvent);
  expect(v2Token).toBe('user1,123');
});

test('gets the same Auth token from v1.0 and v2.0 event', () => {
  const v1Token = getAuthToken(v1AuthEvent);
  const v2Token = getAuthToken(v2AuthEvent);
  expect(v1Token).toBe(v2Token);
});
