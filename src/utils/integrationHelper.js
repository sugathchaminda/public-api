/* eslint-disable no-param-reassign */
const got = require('got');

function normalizeJSON(body) {
  if (!Array.isArray(body.Invoice)) {
    // We allow both array and none array, make sure we have an array
    const inv = body.Invoice;
    body.Invoice = [];
    body.Invoice.push(inv);
  }
  // Replace any UBL JSON "Content" attributes to underscore only (Public API JSON)!
  // eslint-disable-next-line max-len
  return JSON.parse(((JSON.stringify(body.Invoice)).replace(/AmountContent|CodeContent|DateTimeContent|IdentifierContent|IndicatorContent|MeasureContent|NumericContent|QuantityContent|TextContent|BinaryObjectContent/gm, '_')));
}

async function getExternalURL(url, base64 = true) {
  try {
    const response = await got.get(url);
    if (base64) {
      const buff = Buffer.from(response.body);
      return buff.toString('base64');
    }
    return response.body;
  } catch (error) {
    console.log('getExternalURL error:', error);
    throw new Error(`getExternalURL error: ${error}`);
  }
}

function getFileExtension(code, addDot = true) {
  if (code.indexOf('/') > 0) {
    // We have a mime code in
    const dot = addDot ? '.' : '';
    switch (code.toLowerCase()) {
      case 'application/pdf':
        return `${dot}pdf`;
      case 'image/png':
        return `${dot}png`;
      case 'image/jpeg':
      case 'image/jpg':
        return `${dot}jpg`;
      case 'text/csv':
        return `${dot}csv`;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return `${dot}xlsx`;
      case 'application/vnd.oasis.opendocument.spreadsheet':
        return `${dot}ods`;
      default:
        throw new Error('Unsupported attachment type!');
    }
  }
  // We have a file extension, return mime code
  switch (code.toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case 'jpeg':
      return 'image/jpeg';
    case '.csv':
      return 'text/csv';
    case '.xls':
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case '.ods':
      return 'application/vnd.oasis.opendocument.spreadsheet';
    default:
      throw new Error('Unsupported attachment type!');
  }
}

module.exports = {
  normalizeJSON,
  getExternalURL,
  getFileExtension
};
