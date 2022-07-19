const fs = require('fs');
const {
  convertUblXmlToPaJson,
  convertPaJsonToUblXml,
  convertUblJsonToPaJson,
  normalizeToPaJson,
  convertOrderUblJsonToPaJson,
  normalizeOrderToPaJson,
  convertCreditNoteUblJsonToPaJson,
  normalizeCreditNoteToPaJson
} = require('./paJsonHelper');
const { trivialInvoiceUBLJson } = require('../../test/mockData/ublJsonInvoiceTestData');
const { trivialOrderUBLJson } = require('../../test/mockData/ublJsonOrderTestData');
const { trivialCreditNoteUBLJson } = require('../../test/mockData/ublJsonCreditNoteTestData');
const { paJsonWithOneAdditionalDocumentReference } = require('../../test/mockData/paJsonTestData');
const { convertUblXmlToUblJson, convertOrderUblXmlToUblJson, convertCreditNoteUblXmlToUblJson } = require('./ublJsonHelper');

const exampleXmlStringPaths = [
  './test/mockData/xml/invoice/base-example.xml',
  './test/mockData/xml/invoice/allowance-example.xml',
  './test/mockData/xml/invoice/base-negative-inv-correction.xml',
  './test/mockData/xml/invoice/vat-category-E.xml',
  './test/mockData/xml/invoice/vat-category-O.xml',
  './test/mockData/xml/invoice/vat-category-S.xml',
  './test/mockData/xml/invoice/vat-category-Z.xml'
];

test.each(exampleXmlStringPaths)('it converts ubl xml to pa json', async (filePath) => {
  const xmlFile = fs.readFileSync(filePath);
  const xmlString = xmlFile.toString();
  const json = await convertUblXmlToPaJson(xmlString);

  expect(json.Invoice).toHaveProperty('$'); // TODO better assertion here
});

test.each(exampleXmlStringPaths)('converting xml to pa json is reversible to xml', async (filePath) => {
  const xmlFile = fs.readFileSync(filePath);
  const xmlString = xmlFile.toString();
  const json = await convertUblXmlToPaJson(xmlString);
  const newXml = await convertPaJsonToUblXml(json);

  // Not the best assertion but, it is not 100% reversible since xml2js adds default standalone
  expect(newXml.toString().includes('<Invoice')).toBeTruthy();
});

test('it converts pa json to ubl xml', async () => {
  const paJson = paJsonWithOneAdditionalDocumentReference('12341234');
  const xmlString = await convertPaJsonToUblXml(paJson);
  const newPaJson = await (convertUblXmlToPaJson(xmlString));
  expect(xmlString.toString().includes('<Invoice')).toBeTruthy();
  expect(paJson).toEqual(newPaJson);
});

test('converts ubl json to pa json in the same format as xml conversion', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertUblJsonToPaJson(trivialInvoiceUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await convertUblJsonToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});

test.each(exampleXmlStringPaths)('normalizing pa json to pa json should act as pass trough', async (filePath) => {
  const xmlFile = fs.readFileSync(filePath);
  const xmlString = xmlFile.toString();
  const json = await convertUblXmlToPaJson(xmlString);

  const normalizedJson = normalizeToPaJson(json);

  expect(normalizedJson).toEqual(json);
});

test('converts ubl json to pa json in the same format as xml conversion when normalizing', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertUblJsonToPaJson(trivialInvoiceUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await normalizeToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});

test('converts order ubl json to pa json in the same format as xml conversion', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertOrderUblJsonToPaJson(trivialOrderUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertOrderUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await convertOrderUblJsonToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});

test('converts order ubl json to pa json in the same format as xml conversion when normalizing', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertOrderUblJsonToPaJson(trivialOrderUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertOrderUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await normalizeOrderToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});

test('converts credit note ubl json to pa json in the same format as xml conversion', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertCreditNoteUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await convertCreditNoteUblJsonToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});

test('converts credit note ubl json to pa json in the same format as xml conversion when normalizing', async () => {
  const xmlString = await convertPaJsonToUblXml(await convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson('SE123123')));
  const paJsonFromXml = await convertUblXmlToPaJson(xmlString);
  const ublJsonFromXml = await convertCreditNoteUblXmlToUblJson(xmlString);
  const paJsonFromUblJson = await normalizeCreditNoteToPaJson(ublJsonFromXml);
  expect(paJsonFromXml).toEqual(paJsonFromUblJson);
});
