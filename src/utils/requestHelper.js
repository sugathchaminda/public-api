const {
  normalizeToPaJson,
  normalizeOrderToPaJson,
  normalizeCreditNoteToPaJson,
  convertUblXmlToPaJson
} = require('./paJsonHelper');

const { getHttpMethod } = require('./httpApiEventHelper');

const normalizedInvoiceBodyFromRequest = async (req) => {
  if (req.headers['content-type'].toLowerCase() === 'application/xml') {
    return convertUblXmlToPaJson(req.body);
  }
  return normalizeToPaJson(req.body);
};

const normalizedOrderBodyFromRequest = async (req) => {
  if (req.headers['content-type'].toLowerCase() === 'application/xml') {
    return convertUblXmlToPaJson(req.body);
  }
  return normalizeOrderToPaJson(req.body);
};

const normalizedInvoicesFromBatchRequest = (req) => req.body.Invoices.map(normalizeToPaJson);

const normalizedOrdersFromBatchRequest = (req) => req.body.Orders.map(normalizeToPaJson);

const getAccountRegNoFromRequest = (req) => req?.params?.accountRegNo;
const getQueryStringFromRequest = (req) => req?.query;
const getContentTypeFromRequest = (req) => {
  const headerType = getHttpMethod(req) === 'GET' ? 'accept' : 'content-type';

  if (req && req.headers['content-type']) {
    return req.headers[headerType];
  }

  return 'application/json';
};

const removeVersionFromContentType = (req) => {
  const httpMethod = getHttpMethod(req);
  if (httpMethod === 'GET') {
    const acceptHeader = req.headers.accept;
    [req.headers.accept] = acceptHeader.split(';');
  } else {
    const contentType = req.headers['content-type'];
    [req.headers['content-type']] = contentType.split(';');
  }
};

const getVersionFromRequest = (event) => {
  const httpMethod = getHttpMethod(event);
  let version = '';
  if (httpMethod === 'GET') {
    const acceptHeader = event.headers.accept || event.headers.Accept;
    [, version] = acceptHeader.split(';');
    [, version] = acceptHeader.split('=');
  } else {
    const contentTypeHeader = event.headers['content-type'] || event.headers['Content-Type'];
    [, version] = contentTypeHeader.split(';');
    [, version] = contentTypeHeader.split('=');
  }
  return version || '1';
};

const normalizedCreditNoteBodyFromRequest = async (req) => {
  if (req.headers['content-type'].toLowerCase() === 'application/xml') {
    return convertUblXmlToPaJson(req.body);
  }
  return normalizeCreditNoteToPaJson(req.body);
};

const normalizedCreditNotesFromBatchRequest = (req) => req.body.CreditNotes.map(normalizeToPaJson);

module.exports = {
  normalizedInvoiceBodyFromRequest,
  normalizedInvoicesFromBatchRequest,
  getAccountRegNoFromRequest,
  getQueryStringFromRequest,
  getContentTypeFromRequest,
  getVersionFromRequest,
  removeVersionFromContentType,

  normalizedOrderBodyFromRequest,
  normalizedOrdersFromBatchRequest,

  normalizedCreditNoteBodyFromRequest,
  normalizedCreditNotesFromBatchRequest
};
