const xml2js = require('xml2js');
const ublNamespaceMap = require('./ubl21NamespaceMap');

const getInvoiceIdFromPaJson = (invoiceJson) => invoiceJson?.Invoice?.['cbc:ID']?.[0]?._;
const getInvoiceDateFromPaJson = (invoiceJson) => invoiceJson?.Invoice?.['cbc:IssueDate']?.[0]?._;

const getOrderIdFromPaJson = (orderJson) => orderJson?.Order?.['cbc:ID']?.[0]?._;
const getOrderDateFromPaJson = (orderJson) => orderJson?.Order?.['cbc:IssueDate']?.[0]?._;

const getCreditNoteIdFromPaJson = (creditNoteJson) => creditNoteJson?.CreditNote?.['cbc:ID']?.[0]?._;
const getCreditNoteDateFromPaJson = (creditNoteJson) => creditNoteJson?.CreditNote?.['cbc:IssueDate']?.[0]?._;

const convertUblXmlToPaJson = async (xmlString) => {
  const parser = new xml2js.Parser({ explicitArray: true, explicitCharkey: true });
  return parser.parseStringPromise(xmlString);
};

const convertPaJsonToUblXml = async (json, options = {}) => {
  const builder = new xml2js.Builder(options);
  return builder.buildObject(json);
};

const convertUblInvoiceAttributesAndAdNamespaces = (obj, namespace = null, namespaceMappings) => {
  const isArray = Array.isArray(obj);

  if (isArray) {
    return obj.map((val) => convertUblInvoiceAttributesAndAdNamespaces(val, namespace, namespaceMappings));
  }

  return Object.keys(obj)
    .reduce((acc, key) => {
      if (key === '_') {
        acc[key] = `${obj[key]}`; // Coerse all text nodes to string.
      } else if (typeof obj[key] !== 'object') {
        acc.$ = acc.$ || {};
        acc.$[key] = obj[key]; // Move attributes into attributes object $
      } else {
        // Continue traversing tree appending the correct namespace to the key
        const namespaceToUse = namespaceMappings[key] !== undefined ? namespaceMappings[key] : namespace;
        const keyToUse = namespaceToUse !== null ? `${namespaceToUse}:${key}` : key;
        acc[keyToUse] = convertUblInvoiceAttributesAndAdNamespaces(obj[key], namespaceToUse, namespaceMappings);
      }
      return acc;
    }, {});
};

const convertUblJsonToPaJson = (json) => {
  const namespacesDeclarations = {
    $: {
      xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
      'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
    }
  };

  return {
    Invoice: {
      ...namespacesDeclarations,
      ...convertUblInvoiceAttributesAndAdNamespaces(json.Invoice[0], null, ublNamespaceMap)
    }
  };
};

const addNamespacesToPaJson = (obj, namespaceMappings) => {
  const isArray = Array.isArray(obj);
  if (isArray) {
    return obj.map((val) => addNamespacesToPaJson(val, namespaceMappings));
  }

  return Object.keys(obj)
    .reduce((acc, key) => {
      if (typeof obj[key] === 'object') {
        const namespaceToUse = namespaceMappings[key];
        if (namespaceToUse) {
          const newKey = `${namespaceToUse}:${key}`;
          acc[newKey] = addNamespacesToPaJson(obj[key], namespaceMappings);
        } else {
          acc[key] = obj[key];
        }
      } else {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
};

// Valid ubl has invoice as entry in array. pa-json has it as obj.
// Could add more checks here.
const normalizeToPaJson = (json) => (Array.isArray(json.Invoice) ? convertUblJsonToPaJson(json) : json);

const convertUblOrderAttributesAndAdNamespaces = (obj, namespace = null, namespaceMappings) => {
  const isArray = Array.isArray(obj);
  if (isArray) {
    return obj.map((val) => convertUblOrderAttributesAndAdNamespaces(val, namespace, namespaceMappings));
  }
  return Object.keys(obj)
    .reduce((acc, key) => {
      if (key === '_') {
        acc[key] = `${obj[key]}`; // Coerse all text nodes to string.
      } else if (typeof obj[key] !== 'object') {
        acc.$ = acc.$ || {};
        acc.$[key] = obj[key]; // Move attributes into attributes object $
      } else {
        // Continue traversing tree appending the correct namespace to the key
        const namespaceToUse = namespaceMappings[key] !== undefined ? namespaceMappings[key] : namespace;
        const keyToUse = namespaceToUse !== null ? `${namespaceToUse}:${key}` : key;
        acc[keyToUse] = convertUblOrderAttributesAndAdNamespaces(obj[key], namespaceToUse, namespaceMappings);
      }
      return acc;
    }, {});
};

const convertOrderUblJsonToPaJson = (json) => {
  const namespacesDeclarations = {
    $: {
      xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
      'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
    }
  };
  return {
    Order: {
      ...namespacesDeclarations,
      ...convertUblOrderAttributesAndAdNamespaces(json.Order[0], null, ublNamespaceMap)
    }
  };
};

const normalizeOrderToPaJson = (json) => (Array.isArray(json.Order) ? convertOrderUblJsonToPaJson(json) : json);

const convertUblCreditNoteAttributesAndAdNamespaces = (obj, namespace = null, namespaceMappings) => {
  const isArray = Array.isArray(obj);
  if (isArray) {
    return obj.map((val) => convertUblCreditNoteAttributesAndAdNamespaces(val, namespace, namespaceMappings));
  }
  return Object.keys(obj)
    .reduce((acc, key) => {
      if (key === '_') {
        acc[key] = `${obj[key]}`;
      } else if (typeof obj[key] !== 'object') {
        acc.$ = acc.$ || {};
        acc.$[key] = obj[key];
      } else {
        const namespaceToUse = namespaceMappings[key] !== undefined ? namespaceMappings[key] : namespace;
        const keyToUse = namespaceToUse !== null ? `${namespaceToUse}:${key}` : key;
        acc[keyToUse] = convertUblCreditNoteAttributesAndAdNamespaces(obj[key], namespaceToUse, namespaceMappings);
      }
      return acc;
    }, {});
};

const convertCreditNoteUblJsonToPaJson = (json) => {
  const namespacesDeclarations = {
    $: {
      xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
      'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
    }
  };
  return {
    CreditNote: {
      ...namespacesDeclarations,
      ...convertUblCreditNoteAttributesAndAdNamespaces(json.CreditNote[0], null, ublNamespaceMap)
    }
  };
};

const normalizeCreditNoteToPaJson = (json) => (Array.isArray(json.CreditNote) ? convertCreditNoteUblJsonToPaJson(json) : json);

module.exports = {
  getInvoiceIdFromPaJson,
  getInvoiceDateFromPaJson,
  convertUblXmlToPaJson,
  convertPaJsonToUblXml,
  convertUblJsonToPaJson,
  normalizeToPaJson,
  addNamespacesToPaJson,

  getOrderIdFromPaJson,
  getOrderDateFromPaJson,
  convertOrderUblJsonToPaJson,
  normalizeOrderToPaJson,

  getCreditNoteIdFromPaJson,
  getCreditNoteDateFromPaJson,
  convertCreditNoteUblJsonToPaJson,
  normalizeCreditNoteToPaJson
};
