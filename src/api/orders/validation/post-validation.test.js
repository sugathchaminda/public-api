const fs = require('fs');
const { validateOrderRequest } = require('./post-validation');
const ValidationError = require('../../../errors/validationError');
const {
  convertUblXmlToPaJson,
  convertOrderUblJsonToPaJson
} = require('../../../utils/paJsonHelper');
const {
  trivialOrderUBLJson,
  invalidUBLJson
} = require('../../../../test/mockData/ublJsonOrderTestData');
const peppolValidationHelper = require('../../../utils/peppolValidationHelper');

// TODO Add modified order ubl json and order ubl json same as orders
const validUblOrders = [
  trivialOrderUBLJson('5567321707')
];

// TODO Add allowance / base negative correction and vat category orders if available
const exampleXmlStringPaths = [
  './test/mockData/xml/order/base-example.xml'
];

const invalidXmlStrings = [
  '',
  '<Order />',
  '<Unexpected />'
];

jest.mock('../../../utils/peppolValidationHelper');

const peppolExampleErrorResult = [{
  errorLevel: 'ERROR',
  errorID: 'BR-01',
  errorFieldName: '/:Order[1]',
  test: '(cbc:CustomizationID !== "")',
  errorText: 'An order shall have a Specification identifier'
}];

describe('external PeppolValidation', () => {
  test('it rejects invalid orders according to external peppol validation', async () => {
    const req = {
      body: trivialOrderUBLJson('556677889900'),
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE556677889900'
      }
    };

    peppolValidationHelper.validatePeppolXml
      .mockResolvedValue({ valid: false, result: peppolExampleErrorResult });

    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });
});

describe('validateOrderRequest UBL-JSON', () => {
  test.each(validUblOrders)('validateOrderRequest accepts valid UBL-JSON', async (order) => {
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateOrderRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('validateOrderRequest rejects invalid ubl-json', async () => {
    const invalidOrder = invalidUBLJson();
    const req = {
      body: invalidOrder,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateOrderRequest common', () => {
  test('validateOrderRequest requires accountRegNo param', async () => {
    const exampleOrder = trivialOrderUBLJson('5567321707');
    const req = {
      body: exampleOrder,
      headers: {
        'content-type': 'application/json'
      },
      params: {}
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateOrderRequest requires content-type to be either xml or json', async () => {
    const exampleOrder = trivialOrderUBLJson('5567321707');
    const req = {
      body: exampleOrder,
      headers: {
        'content-type': 'unsupported'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateOrderRequest requires content-type header', async () => {
    const exampleOrder = trivialOrderUBLJson('5567321707');
    const req = {
      body: exampleOrder,
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateOrderRequest requires Order key in body (if json)', async () => {
    const req = {
      body: {},
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateOrderRequest XML', () => {
  test.each(exampleXmlStringPaths)('postOutgoingOrder validation accepts valid UBL XML', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();

    const req = {
      body: xmlString,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateOrderRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test.each(invalidXmlStrings)('postOutgoingOrder validation rejects invalid UBl XML', async (xmlString) => {
    const req = {
      body: xmlString,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateOrderRequest PA-JSON', () => {
  test.each(exampleXmlStringPaths)('validateOrderRequest validation accepts valid PA-JSON', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);

    const req = {
      body: paJson,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateOrderRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('postOutgoingOrder validation rejects invalid PA-JSON', async () => {
    const invalidOrder = convertOrderUblJsonToPaJson(invalidUBLJson());

    const req = {
      body: invalidOrder,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingOrder validation checks that the order has order number (id) set', async () => {
    const invalidOrder = convertOrderUblJsonToPaJson(trivialOrderUBLJson('5567321707'));

    // cbd id should be handled by schema validation
    invalidOrder.Order['cbc:ID'] = undefined;

    const req = {
      body: invalidOrder,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingOrder validation checks that the order has an order date set', async () => {
    const invalidOrder = convertOrderUblJsonToPaJson(trivialOrderUBLJson('5567321707'));

    // issue date should be handled by schema validation
    invalidOrder.Order['cbc:IssueDate'] = undefined;

    const req = {
      body: invalidOrder,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateOrderRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});
