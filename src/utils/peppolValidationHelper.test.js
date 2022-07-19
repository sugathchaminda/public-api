const fs = require('fs');
const lambda = require('../libs/lambdaClient');
const { validatePeppolXml } = require('./peppolValidationHelper');
const {
  errorResponse,
  warningResponse,
  okResponse
} = require('./peppolValidationMockResponses');

jest.mock('../libs/lambdaClient');

const lambdaResponse = (body) => ({
  promise: async () => ({
    Payload: JSON.stringify({
      body: JSON.stringify(body)
    })
  })
});

const xml = fs.readFileSync('./test/mockData/xml/invoice/base-example.xml').toString();

describe('validatePeppolXml', () => {
  test('it returns invalid if the response from lambda has errors of level ERROR', async () => {
    lambda.lambdaClient.invoke.mockReturnValue(lambdaResponse(errorResponse));
    const result = await validatePeppolXml(xml);
    expect(result.valid).toBe(false);
  });

  test('it returns valid if the response from lambda has no errors', async () => {
    lambda.lambdaClient.invoke.mockReturnValue(lambdaResponse(okResponse));
    const result = await validatePeppolXml(xml);

    expect(result.valid).toBe(true);
  });

  test('it returns valid if the response from lambda has errors of level WARNING', async () => {
    lambda.lambdaClient.invoke.mockReturnValue(lambdaResponse(warningResponse));
    const result = await validatePeppolXml(xml);
    expect(result.valid).toBe(true);
  });

  test('it throws error if the response from the lambda is not in expected format', async () => {
    lambda.lambdaClient.invoke.mockReturnValue(lambdaResponse({
      message: 'Internal server error'
    }));
    await expect(validatePeppolXml(xml)).rejects.toThrowError(Error);
  });
});
