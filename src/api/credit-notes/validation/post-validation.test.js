const fs = require('fs');
const { validateCreditNoteRequest } = require('./post-validation');
const ValidationError = require('../../../errors/validationError');
const {
  convertUblXmlToPaJson,
  convertCreditNoteUblJsonToPaJson
} = require('../../../utils/paJsonHelper');
const {
  trivialCreditNoteUBLJson,
  invalidUBLJson
} = require('../../../../test/mockData/ublJsonCreditNoteTestData');
const peppolValidationHelper = require('../../../utils/peppolValidationHelper');

// TODO Add modified credit note ubl json and credit note ubl json same as credit notes
const validUblCreditNotes = [
  trivialCreditNoteUBLJson('5567321707')
];

// TODO Add allowance / base negative correction and vat category credit notes if available
const exampleXmlStringPaths = [
  './test/mockData/xml/credit-note/base-example.xml'
];

const invalidXmlStrings = [
  '',
  '<CreditNote />',
  '<Unexpected />'
];

jest.mock('../../../utils/peppolValidationHelper');

const peppolExampleErrorResult = [{
  errorLevel: 'ERROR',
  errorID: 'BR-01',
  errorFieldName: '/:CreditNote[1]',
  test: '(cbc:CustomizationID !== "")',
  errorText: 'A credit note shall have a Specification identifier'
}];

describe('external PeppolValidation', () => {
  test('it rejects invalid credit notes according to external peppol validation', async () => {
    const req = {
      body: trivialCreditNoteUBLJson('556677889900'),
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

    await expect(validateCreditNoteRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });
});

describe('validateCreditNoteRequest UBL-JSON', () => {
  test.each(validUblCreditNotes)('validateCreditNoteRequest accepts valid UBL-JSON', async (creditNote) => {
    const req = {
      body: creditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    const res = await validateCreditNoteRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('validateCreditNoteRequest rejects invalid ubl-json', async () => {
    const invalidCreditNote = invalidUBLJson();
    const req = {
      body: invalidCreditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateCreditNoteRequest common', () => {
  test('validateCreditNoteRequest requires accountRegNo param', async () => {
    const exampleCreditNote = trivialCreditNoteUBLJson('5567321707');
    const req = {
      body: exampleCreditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {}
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateCreditNoteRequest requires content-type to be either xml or json', async () => {
    const exampleCreditNote = trivialCreditNoteUBLJson('5567321707');
    const req = {
      body: exampleCreditNote,
      headers: {
        'content-type': 'unsupported'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateCreditNoteRequest requires content-type header', async () => {
    const exampleCreditNote = trivialCreditNoteUBLJson('5567321707');
    const req = {
      body: exampleCreditNote,
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('validateCreditNoteRequest requires CreditNote key in body (if json)', async () => {
    const req = {
      body: {},
      headers: {},
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateCreditNoteRequest XML', () => {
  test.each(exampleXmlStringPaths)('postOutgoingCreditNote validation accepts valid UBL XML', async (filePath) => {
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

    const res = await validateCreditNoteRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test.each(invalidXmlStrings)('postOutgoingCreditNote validation rejects invalid UBl XML', async (xmlString) => {
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

    await expect(validateCreditNoteRequest(req))
      .rejects
      .toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});

describe('validateCreditNoteRequest PA-JSON', () => {
  test.each(exampleXmlStringPaths)('validateCreditNoteRequest validation accepts valid PA-JSON', async (filePath) => {
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

    const res = await validateCreditNoteRequest(req);

    // Validation failure causes an exception so any assertion is fine
    expect(res)
      .toBe(req);

    expect(peppolValidationSpy).toBeCalledTimes(1);
  });

  test('postOutgoingCreditNote validation rejects invalid PA-JSON', async () => {
    const invalidCreditNote = convertCreditNoteUblJsonToPaJson(invalidUBLJson());

    const req = {
      body: invalidCreditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingCreditNote validation checks that the credit note has credit note number (id) set', async () => {
    const invalidCreditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('5567321707'));

    // cbd id should be handled by schema validation
    invalidCreditNote.CreditNote['cbc:ID'] = undefined;

    const req = {
      body: invalidCreditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });

  test('postOutgoingCreditNote validation checks that the credit note has a credit note date set', async () => {
    const invalidCreditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('5567321707'));

    // issue date should be handled by schema validation
    invalidCreditNote.CreditNote['cbc:IssueDate'] = undefined;

    const req = {
      body: invalidCreditNote,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    peppolValidationHelper.validatePeppolXml.mockResolvedValue({ valid: true, result: [] });
    const peppolValidationSpy = jest.spyOn(peppolValidationHelper, 'validatePeppolXml');

    await expect(validateCreditNoteRequest(req)).rejects.toThrowError(ValidationError);

    expect(peppolValidationSpy).toBeCalledTimes(0);
  });
});
