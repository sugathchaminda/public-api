const {
  validateUblInvoiceJsonFunction,
  validateUblOrderJsonFunction,
  validateUblCreditNoteJsonFunction
} = require('../libs/schemaValidators');
const { convertUblXmlToPaJson } = require('./paJsonHelper');

const getGlobalNamespaces = (json) => {
  const namespaces = {};

  /*
  * ubl-json stores namespaces in the followin properties that are siblings to the Invoice prop
  *
  * _D the document namespace "xmlns"
  * _A aggregate components "xmlns:cac"
  * _B basic components "xmlns:cbc"
  * _E extensions
  *
  * */
  if (json.xmlns !== undefined) {
    // eslint-disable-next-line no-underscore-dangle
    namespaces._D = json.xmlns;
  }
  if (json['xmlns:cac'] !== undefined) {
    // eslint-disable-next-line no-underscore-dangle
    namespaces._A = json['xmlns:cac'];
  }
  if (json['xmlns:cbc'] !== undefined) {
    // eslint-disable-next-line no-underscore-dangle
    namespaces._B = json['xmlns:cbc'];
  }
  return namespaces;
};

const transformObjToValidUblJson = (obj) => {
  const removeNamespaceFromKey = (key) => {
    const splitted = key.split(':');
    return splitted.length > 1 ? splitted[1] : key;
  };

  const isArray = Array.isArray(obj);

  if (isArray) {
    return obj.map((val) => {
      // If we have an array entry object we might have attributes that need to be merged on the parent
      const attributes = val?.$ || {};
      return transformObjToValidUblJson({ ...val, ...attributes });
    });
  }

  return Object.keys(obj)
    .reduce((acc, key) => {
      // Remove all attributes objects
      if (key === '$') return acc;

      // Do not include any xmlns attributes that are not included in json schema.
      if (/(xmlns)(:[a-z]*)?/.test(key)) {
        return acc;
      }
      const keyValueIsStringWrappedInArray = Array.isArray(obj[key]) && obj[key].length === 1 && typeof obj[key][0] === 'string';
      // Unwrap arrays holding only single string
      if (keyValueIsStringWrappedInArray) {
        // eslint-disable-next-line prefer-destructuring
        acc[removeNamespaceFromKey(key)] = obj[key][0];

      // Traverse tree or we are in a leaf.
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc[removeNamespaceFromKey(key)] = transformObjToValidUblJson(obj[key]);
      } else {
        acc[removeNamespaceFromKey(key)] = obj[key];
      }
      return acc;
    }, {});
};

const convertPaJsonToUblJson = (paJson) => {
  if (paJson?.Invoice === undefined) return {};
  const namespaceObject = paJson?.Invoice?.$ !== undefined ? getGlobalNamespaces(paJson.Invoice.$) : {};

  const invoiceValue = Array.isArray(paJson.Invoice) ? paJson.Invoice : [paJson.Invoice];
  const result = transformObjToValidUblJson({ ...{ Invoice: invoiceValue }, ...namespaceObject });

  // We validated with type-coersion and removing defaults. see: https://ajv.js.org/guide/modifying-data.html
  // To leverage the schema datatype definitions.
  validateUblInvoiceJsonFunction(result);
  return result;
};

const convertUblXmlToUblJson = async (xmlString) => {
  if (xmlString === null || xmlString === undefined) {
    throw new TypeError('Cannot convert null or undefined to ublJson');
  }

  const paJson = await convertUblXmlToPaJson(xmlString);
  return convertPaJsonToUblJson(paJson);
};

const convertOrderPaJsonToUblJson = (paJson) => {
  if (paJson?.Order === undefined) return {};
  const namespaceObject = paJson?.Order?.$ !== undefined ? getGlobalNamespaces(paJson.Order.$) : {};

  const orderValue = Array.isArray(paJson.Order) ? paJson.Order : [paJson.Order];
  const result = transformObjToValidUblJson({ ...{ Order: orderValue }, ...namespaceObject });
  // We validated with type-coersion and removing defaults. see: https://ajv.js.org/guide/modifying-data.html
  // To leverage the schema datatype definitions.
  validateUblOrderJsonFunction(result);
  return result;
};

// Valid ubl has invoice as entry in array. pa-json has it as obj.
// Could add more checks here.
const normalizeToUblJson = (json) => (!Array.isArray(json.Invoice) ? convertPaJsonToUblJson(json) : json);

const normalizeOrderToUblJson = (json) => (!Array.isArray(json.Order) ? convertOrderPaJsonToUblJson(json) : json);

const convertOrderUblXmlToUblJson = async (xmlString) => {
  if (xmlString === null || xmlString === undefined) {
    throw new TypeError('Cannot convert null or undefined to ublJson');
  }
  const paJson = await convertUblXmlToPaJson(xmlString);
  return convertOrderPaJsonToUblJson(paJson);
};

const convertCreditNotePaJsonToUblJson = (paJson) => {
  if (paJson?.CreditNote === undefined) return {};
  const namespaceObject = paJson?.CreditNote?.$ !== undefined ? getGlobalNamespaces(paJson.CreditNote.$) : {};

  const creditNoteValue = Array.isArray(paJson.CreditNote) ? paJson.CreditNote : [paJson.CreditNote];
  const result = transformObjToValidUblJson({ ...{ CreditNote: creditNoteValue }, ...namespaceObject });
  validateUblCreditNoteJsonFunction(result);
  return result;
};

const normalizeCreditNoteToUblJson = (json) => (!Array.isArray(json.CreditNote) ? convertCreditNotePaJsonToUblJson(json) : json);

const convertCreditNoteUblXmlToUblJson = async (xmlString) => {
  if (xmlString === null || xmlString === undefined) {
    throw new TypeError('Cannot convert null or undefined to ublJson');
  }
  const paJson = await convertUblXmlToPaJson(xmlString);
  return convertCreditNotePaJsonToUblJson(paJson);
};

module.exports = {
  convertUblXmlToUblJson,
  convertPaJsonToUblJson,
  normalizeToUblJson,

  convertOrderPaJsonToUblJson,
  convertOrderUblXmlToUblJson,
  normalizeOrderToUblJson,

  convertCreditNotePaJsonToUblJson,
  convertCreditNoteUblXmlToUblJson,
  normalizeCreditNoteToUblJson
};
