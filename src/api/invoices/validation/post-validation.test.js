const fs = require('fs');
const {
  validateInvoiceRequest,
  validateBatchInvoiceRequest
} = require('./post-validation');
const ValidationError = require('../../../errors/validationError');
const {
  convertUblXmlToPaJson,
  convertUblJsonToPaJson
} = require('../../../utils/paJsonHelper');
const {
  trivialInvoiceUBLJson,
  modifiedInvoiceUBLJson,
  invoiceUBLJson,
  invalidUBLJson
} = require('../../../../test/mockData/ublJsonInvoiceTestData');
const peppolValidationHelper = require('../../../utils/peppolValidationHelper');

const validUblInvoices = [
  trivialInvoiceUBLJson('5567321707'),
  modifiedInvoiceUBLJson('5547321707'),
  invoiceUBLJson('5547321707')
];

const exampleXmlStringPaths = [
  './test/mockData/xml/invoice/base-example.xml',
  './test/mockData/xml/invoice/allowance-example.xml',
  './test/mockData/xml/invoice/base-negative-inv-correction.xml',
  './test/mockData/xml/invoice/vat-category-E.xml',
  './test/mockData/xml/invoice/vat-category-O.xml',
  './test/mockData/xml/invoice/vat-category-S.xml',
  './test/mockData/xml/invoice/vat-category-Z.xml'
];

const invalidXmlStrings = [
  '',
  '<Invoice />',
  '<Unexpected />'
];

jest.mock('../../../utils/peppolValidationHelper');

const peppolExampleErrorResult = [{
  errorLevel: 'ERROR',
  errorID: 'BR-01',
  errorFieldName: '/:Invoice[1]',
  test: '(cbc:CustomizationID !== "")',
  errorText: 'An invoice shall have a Specification identifier'
}];

describe('external PeppolValidation', () => {
  test('it rejects invalid invoices according to external peppol validation', async () => {
    const req = {
      body: trivialInvoiceUBLJson('556677889900'),
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

    await expect(validateInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('it reject invalid batchRequest if one of the invoices do not conform to peppol validation', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    peppolValidationHelper.validatePeppolXml.mockResolvedValueOnce(({ valid: false, result: peppolExampleErrorResult }));
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateBatchInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(2);
  });
});

describe('validateInvoiceRequest UBL-JSON', () => {
  test.each(validUblInvoices)('validateInvoiceRequest accepts valid UBL-JSON', async (invoice) => {
    const req = {
      body: invoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateInvoiceRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('validateInvoiceRequest rejects invalid ubl-json', async () => {
    const invalidInvoice = invalidUBLJson();
    const req = {
      body: invalidInvoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateInvoiceRequest common', () => {
  test('validateInvoiceRequest requires accountRegNo param', async () => {
    const exampleInvoice = trivialInvoiceUBLJson('5567321707');
    const req = {
      body: exampleInvoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {}
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateInvoiceRequest requires content-type to be either xml or json', async () => {
    const exampleInvoice = trivialInvoiceUBLJson('5567321707');
    const req = {
      body: exampleInvoice,
      headers: {
        'content-type': 'unsupported'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateInvoiceRequest requires content-type header', async () => {
    const exampleInvoice = trivialInvoiceUBLJson('5567321707');
    const req = {
      body: exampleInvoice,
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateInvoiceRequest requires Invoice key in body (if json)', async () => {
    const req = {
      body: {},
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateInvoiceRequest XML', () => {
  test.each(exampleXmlStringPaths)('postOutgoingInvoice validation accepts valid UBL XML', async (filePath) => {
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

    const res = await validateInvoiceRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test.each(invalidXmlStrings)('postOutgoingInvoice validation rejects invalid UBl XML', async (xmlString) => {
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

    await expect(validateInvoiceRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateInvoiceRequest PA-JSON', () => {
  test.each(exampleXmlStringPaths)('validateInvoiceRequest validation accepts valid PA-JSON', async (filePath) => {
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

    const res = await validateInvoiceRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('postOutgoingInvoice validation rejects invalid PA-JSON', async () => {
    const invalidInvoice = convertUblJsonToPaJson(invalidUBLJson());

    const req = {
      body: invalidInvoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingInvoice validation checks that the invoice has invoicenumber (id) set', async () => {
    const invalidInvoice = convertUblJsonToPaJson(trivialInvoiceUBLJson('5567321707'));

    // cbd id should be handled by schema validation
    invalidInvoice.Invoice['cbc:ID'] = undefined;

    const req = {
      body: invalidInvoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingInvoice validation checks that the invoice has an invoice date set', async () => {
    const invalidInvoice = convertUblJsonToPaJson(trivialInvoiceUBLJson('5567321707'));

    // issuedate should be handled by schema validation
    invalidInvoice.Invoice['cbc:IssueDate'] = undefined;

    const req = {
      body: invalidInvoice,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateBatchInvoiceRequest', () => {
  test('it allows batch request with valid array of invoices', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateBatchInvoiceRequest(req);
    expect(res).toEqual(req);

    expect(peppolValidationSpy).toBeCalledTimes(2);
  });

  test('it does not allow batch request where one of the invoice are invalid', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(invalidUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateBatchInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('it does not allow batch request with content type xml', async () => {
    const invoices = { Invoices: [convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1'))] };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateBatchInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('it does not allow batch request without invoices key', async () => {
    const invoices = { NOTINVOICES: [convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1'))] };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateBatchInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('all invoices in batch request need to have unique ids.', async () => {
    const invoices = {
      Invoices: [
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1')),
        convertUblJsonToPaJson(trivialInvoiceUBLJson('123123', '1'))
      ]
    };

    const req = {
      body: invoices,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateBatchInvoiceRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(2);
  });
});
