/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable import/extensions */
const { ajv } = require('./ajv');

// This is a bit of a hack to make unit test suite run decently. Requiring the precompiled schema takes to long for jest to handle.
const validateFunctions = {
  validateUblInvoiceJsonFunction: ajv.getSchema('UBl-Invoice-2.1'),
  validateUblOrderJsonFunction: ajv.getSchema('UBl-Order-2.1'),
  validateUblCreditNoteJsonFunction: ajv.getSchema('UBl-CreditNote-2.1')
};
if (!process.env.NO_PRECOMPILED_SCHEMAS) {
  validateFunctions.validateUblInvoiceJsonFunction = require('../schemas/UBL-2.1-JSON/precompiled/invoiceSchemaPrecompiled');
  validateFunctions.validateUblOrderJsonFunction = require('../schemas/UBL-2.1-JSON/precompiled/orderSchemaPrecompiled');
  validateFunctions.validateUblCreditNoteJsonFunction = require('../schemas/UBL-2.1-JSON/precompiled/creditNoteSchemaPrecompiled');
}

module.exports = validateFunctions;
