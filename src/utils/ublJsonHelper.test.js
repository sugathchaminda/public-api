const fs = require('fs');
const {
  convertUblXmlToUblJson,
  convertPaJsonToUblJson,
  normalizeToUblJson,
  convertOrderPaJsonToUblJson,
  convertOrderUblXmlToUblJson,
  normalizeOrderToUblJson,
  convertCreditNotePaJsonToUblJson,
  convertCreditNoteUblXmlToUblJson,
  normalizeCreditNoteToUblJson
} = require('./ublJsonHelper');
const { validateUblInvoiceJsonFunction, validateUblOrderJsonFunction, validateUblCreditNoteJsonFunction } = require('../libs/schemaValidators');
const { convertUblXmlToPaJson } = require('./paJsonHelper');
const {
  trivialInvoiceUBLJson,
  modifiedInvoiceUBLJson,
  invoiceUBLJson
} = require('../../test/mockData/ublJsonInvoiceTestData');
const {
  trivialOrderUBLJson,
  modifiedOrderUBLJson,
  orderUBLJson
} = require('../../test/mockData/ublJsonOrderTestData');
const {
  trivialCreditNoteUBLJson,
  modifiedCreditNoteUBLJson,
  creditNoteUBLJson
} = require('../../test/mockData/ublJsonCreditNoteTestData');

const exampleXmlStringPaths = [
  './test/mockData/xml/invoice/base-example.xml',
  './test/mockData/xml/invoice/allowance-example.xml',
  './test/mockData/xml/invoice/base-negative-inv-correction.xml',
  './test/mockData/xml/invoice/vat-category-E.xml',
  './test/mockData/xml/invoice/vat-category-O.xml',
  './test/mockData/xml/invoice/vat-category-S.xml',
  './test/mockData/xml/invoice/vat-category-Z.xml'
];

const exampleOrderXmlStringPaths = [
  './test/mockData/xml/order/base-example.xml'
];

const exampleCreditNoteXmlStringPaths = [
  './test/mockData/xml/credit-note/base-example.xml'
];

const validUblInvoices = [
  trivialInvoiceUBLJson('5567321707'),
  modifiedInvoiceUBLJson('5547321707'),
  invoiceUBLJson('5547321707')
];

const validUblOrders = [
  trivialOrderUBLJson('5567321707'),
  modifiedOrderUBLJson('5547321707'),
  orderUBLJson('5547321707')
];

const validUblCreditNotes = [
  trivialCreditNoteUBLJson('5567321707'),
  modifiedCreditNoteUBLJson('5547321707'),
  creditNoteUBLJson('5547321707')
];

const invalidXmlStrings = [
  '',
  '<Invoice />',
  '<Unexpected />'
];

const invalidOrderXmlStrings = [
  '',
  '<Order />',
  '<Unexpected />'
];

const invalidCreditNoteXmlStrings = [
  '',
  '<CreditNote />',
  '<Unexpected />'
];

const invalidPaJson = [
  {},
  { Invoice: {} },
  { Order: {} },
  { CreditNote: {} },
  { Strangekey: {} }
];

const invalidTypes = [
  null,
  undefined
];

describe('convertUblXmlToJson', () => {
  test.each(exampleXmlStringPaths)('it converts ubl xml to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const json = await convertUblXmlToUblJson(xmlString);
    const valid = validateUblInvoiceJsonFunction(json);
    expect(validateUblInvoiceJsonFunction.errors)
      .toBeNull();
    expect(valid)
      .toBe(true);
  });

  test.each(invalidXmlStrings)('it converts invalid xml to invalid ubl json', async (xmlString) => {
    const json = await convertUblXmlToUblJson(xmlString);
    const valid = validateUblInvoiceJsonFunction(json);
    expect(validateUblInvoiceJsonFunction.errors.length)
      .toBeGreaterThan(0);
    expect(valid)
      .toBe(false);
  });

  test.each(invalidTypes)('it should throw type error if input is not string', async (xmlString) => {
    await expect(convertUblXmlToUblJson(xmlString))
      .rejects
      .toThrowError(TypeError);
  });
});

describe('convertPaJsonToUblJson', () => {
  test.each(exampleXmlStringPaths)('it converts pa json to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJson = convertPaJsonToUblJson(paJson);
    const valid = validateUblInvoiceJsonFunction(ublJson);
    expect(validateUblInvoiceJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });

  test.each(validUblInvoices)('it converts valid ubl json to valid ubl json', async (ublJson) => {
    const newUblJson = convertPaJsonToUblJson(ublJson);
    const valid = validateUblInvoiceJsonFunction(newUblJson);
    expect(validateUblInvoiceJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });

  test.each(exampleXmlStringPaths)('converting pa json to ubl should yield the same result as ubl xml to ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJsonFromPaJson = convertPaJsonToUblJson(paJson);
    const ublJsonFromUblXml = await convertUblXmlToUblJson(xmlString);
    expect(ublJsonFromPaJson).toEqual(ublJsonFromUblXml);
  });

  test.each([...invalidPaJson, ...invalidTypes])('it converts invalid pa json to invalid ubl json', (paJson) => {
    const json = convertPaJsonToUblJson(paJson);
    const valid = validateUblInvoiceJsonFunction(json);
    expect(validateUblInvoiceJsonFunction.errors.length).toBeGreaterThan(0);
    expect(valid).toBe(false);
  });
});

describe('normalizeToUblJson', () => {
  test.each(validUblInvoices)('normalizing ubl should return the same result', (ublJson) => {
    const normalizedJson = normalizeToUblJson(ublJson);
    expect(normalizedJson).toEqual(ublJson);
  });

  test.each(exampleXmlStringPaths)('it converts pa json to valid ubl json when normalizing', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJson = normalizeToUblJson(paJson);
    const valid = validateUblInvoiceJsonFunction(ublJson);
    expect(validateUblInvoiceJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });
});

describe('convertOrderUblXmlToUblJson', () => {
  test.each(exampleOrderXmlStringPaths)('it converts order ubl xml to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const json = await convertOrderUblXmlToUblJson(xmlString);
    const valid = validateUblOrderJsonFunction(json);
    expect(validateUblOrderJsonFunction.errors)
      .toBeNull();
    expect(valid)
      .toBe(true);
  });

  test.each(invalidOrderXmlStrings)('it converts order invalid xml to invalid ubl json', async (xmlString) => {
    const json = await convertOrderUblXmlToUblJson(xmlString);
    const valid = validateUblOrderJsonFunction(json);
    expect(validateUblOrderJsonFunction.errors.length)
      .toBeGreaterThan(0);
    expect(valid)
      .toBe(false);
  });

  test.each(invalidTypes)('it should throw type error if input is not string', async (xmlString) => {
    await expect(convertOrderUblXmlToUblJson(xmlString))
      .rejects
      .toThrowError(TypeError);
  });
});

describe('convertOrderPaJsonToUblJson', () => {
  test.each(exampleOrderXmlStringPaths)('it converts order pa json to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertOrderUblXmlToUblJson(xmlString);
    const ublJson = convertOrderPaJsonToUblJson(paJson);
    const valid = validateUblOrderJsonFunction(ublJson);
    expect(validateUblOrderJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });

  test.each(exampleOrderXmlStringPaths)('converting pa json to ubl should yield the same result as ubl xml to ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJsonFromPaJson = convertOrderPaJsonToUblJson(paJson);
    const ublJsonFromUblXml = await convertOrderUblXmlToUblJson(xmlString);
    expect(ublJsonFromPaJson).toEqual(ublJsonFromUblXml);
  });

  test.each([...invalidPaJson, ...invalidTypes])('it converts invalid pa json to invalid ubl json', (paJson) => {
    const json = convertOrderPaJsonToUblJson(paJson);
    const valid = validateUblOrderJsonFunction(json);
    expect(validateUblOrderJsonFunction.errors.length).toBeGreaterThan(0);
    expect(valid).toBe(false);
  });
});

describe('normalizeOrderToUblJson', () => {
  test.each(validUblOrders)('normalizing order ubl should return the same result', (ublJson) => {
    const normalizedJson = normalizeOrderToUblJson(ublJson);
    expect(normalizedJson).toEqual(ublJson);
  });

  test.each(exampleOrderXmlStringPaths)('it converts order pa json to valid ubl json when normalizing', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJson = normalizeOrderToUblJson(paJson);
    const valid = validateUblOrderJsonFunction(ublJson);
    expect(validateUblOrderJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });
});

describe('convertCreditNoteUblXmlToUblJson', () => {
  test.each(exampleCreditNoteXmlStringPaths)('it converts credit note ubl xml to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const json = await convertCreditNoteUblXmlToUblJson(xmlString);
    const valid = validateUblCreditNoteJsonFunction(json);
    expect(validateUblCreditNoteJsonFunction.errors)
      .toBeNull();
    expect(valid)
      .toBe(true);
  });

  test.each(invalidCreditNoteXmlStrings)('it converts credit note invalid xml to invalid ubl json', async (xmlString) => {
    const json = await convertCreditNoteUblXmlToUblJson(xmlString);
    const valid = validateUblCreditNoteJsonFunction(json);
    expect(validateUblCreditNoteJsonFunction.errors.length)
      .toBeGreaterThan(0);
    expect(valid)
      .toBe(false);
  });

  test.each(invalidTypes)('it should throw type error if input is not string', async (xmlString) => {
    await expect(convertCreditNoteUblXmlToUblJson(xmlString))
      .rejects
      .toThrowError(TypeError);
  });
});

describe('convertCreditNotePaJsonToUblJson', () => {
  test.each(exampleCreditNoteXmlStringPaths)('it converts credit note pa json to valid ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertCreditNoteUblXmlToUblJson(xmlString);
    const ublJson = convertCreditNotePaJsonToUblJson(paJson);
    const valid = validateUblCreditNoteJsonFunction(ublJson);
    expect(validateUblCreditNoteJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });

  test.each(exampleCreditNoteXmlStringPaths)('converting pa json to ubl should yield the same result as ubl xml to ubl json', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJsonFromPaJson = convertCreditNotePaJsonToUblJson(paJson);
    const ublJsonFromUblXml = await convertCreditNoteUblXmlToUblJson(xmlString);
    expect(ublJsonFromPaJson).toEqual(ublJsonFromUblXml);
  });

  test.each([...invalidPaJson, ...invalidTypes])('it converts invalid pa json to invalid ubl json', (paJson) => {
    const json = convertCreditNotePaJsonToUblJson(paJson);
    const valid = validateUblCreditNoteJsonFunction(json);
    expect(validateUblCreditNoteJsonFunction.errors.length).toBeGreaterThan(0);
    expect(valid).toBe(false);
  });
});

describe('normalizeCreditNoteToUblJson', () => {
  test.each(validUblCreditNotes)('normalizing credit note ubl should return the same result', (ublJson) => {
    const normalizedJson = normalizeCreditNoteToUblJson(ublJson);
    expect(normalizedJson).toEqual(ublJson);
  });

  test.each(exampleCreditNoteXmlStringPaths)('it converts credit note pa json to valid ubl json when normalizing', async (filePath) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlString = xmlFile.toString();
    const paJson = await convertUblXmlToPaJson(xmlString);
    const ublJson = normalizeCreditNoteToUblJson(paJson);
    const valid = validateUblCreditNoteJsonFunction(ublJson);
    expect(validateUblCreditNoteJsonFunction.errors).toBeNull();
    expect(valid).toBe(true);
  });
});
