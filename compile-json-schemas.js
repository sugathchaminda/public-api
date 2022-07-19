/* eslint-disable global-require */
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/*
* NOTE:
*
* this script generates pre-compiled ajv validation functions to a file that is required in code in order to validate
* ubl-json
* Should only be needed to run once(on your own computer) to create the file.
* But if we need to change the validation we can regenerate using this file(with changes...)
*
* */
const ajv = new Ajv({
  code: { source: true },
  strict: 'log',
  strictTypes: false,
  coerceTypes: true
});
const ajvOrder = new Ajv({
  code: { source: true },
  strict: 'log',
  strictTypes: false,
  coerceTypes: true
});
const ajvCreditNote = new Ajv({
  code: { source: true },
  strict: 'log',
  strictTypes: false,
  coerceTypes: true
});
const standaloneCode = require('ajv/dist/standalone');

// If you want to use both draft-04 and draft-06/07 schemas:
const ublInvoiceSchema = {
  $id: 'UBl-Invoice-2.1', ...require('./src/schemas/UBL-2.1-JSON/maindoc/UBL-Invoice-2.1.json')
};
const ublOrderSchema = {
  $id: 'UBl-Order-2.1', ...require('./src/schemas/UBL-2.1-JSON/maindoc/UBL-Order-2.1.json')
};
const ublCreditNoteSchema = {
  $id: 'UBl-CreditNote-2.1', ...require('./src/schemas/UBL-2.1-JSON/maindoc/UBL-CreditNote-2.1.json')
};

const moduleSchemas = [
  {
    id: 'BDNDR-CCTS_CCT_SchemaModule-1.1',
    schema: {
      $id: 'BDNDR-CCTS_CCT_SchemaModule-1.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/BDNDR-CCTS_CCT_SchemaModule-1.1.json')
    }
  },
  {
    id: 'UBL-CommonAggregateComponents-2.1',
    schema: {
      $id: 'UBL-CommonAggregateComponents-2.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/UBL-CommonAggregateComponents-2.1.json')
    }
  },
  {
    id: 'UBL-CommonBasicComponents-2.1',
    schema: {
      $id: 'UBL-CommonBasicComponents-2.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/UBL-CommonBasicComponents-2.1.json')
    }
  },
  {
    id: 'UBL-CommonExtensionComponents-2.1',
    schema: {
      $id: 'UBL-CommonExtensionComponents-2.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/UBL-CommonExtensionComponents-2.1.json')
    }
  },
  {
    id: 'UBL-ExtensionContentDataType-2.1',
    schema: {
      $id: 'UBL-ExtensionContentDataType-2.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/UBL-ExtensionContentDataType-2.1.json')
    }
  },
  {
    id: 'UBL-QualifiedDataTypes-2.1',
    schema: {
      $id: 'UBL-QualifiedDataTypes-2.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/UBL-QualifiedDataTypes-2.1.json')
    }
  },
  {
    id: 'BDNDR-UnqualifiedDataTypes-1.1',
    schema: {
      $id: 'BDNDR-UnqualifiedDataTypes-1.1',
      ...require('./src/schemas/UBL-2.1-JSON/common/BDNDR-UnqualifiedDataTypes-1.1.json')
    }
  }
];

addFormats(ajv);
ajv.addSchema(ublInvoiceSchema, 'UBl-Invoice-2.1');

addFormats(ajvOrder);
ajvOrder.addSchema(ublOrderSchema, 'UBl-Order-2.1');

addFormats(ajvCreditNote);
ajvCreditNote.addSchema(ublCreditNoteSchema, 'UBl-CreditNote-2.1');

moduleSchemas.forEach((moduleSchema) => {
  ajv.addSchema(moduleSchema.schema, moduleSchema.id);
  ajvOrder.addSchema(moduleSchema.schema, moduleSchema.id);
  ajvCreditNote.addSchema(moduleSchema.schema, moduleSchema.id);
});

const validate = ajv.compile(ublInvoiceSchema);
const invoiceSchemaModule = standaloneCode(ajv, validate);

const validateOrder = ajvOrder.compile(ublOrderSchema);
const orderSchemaModule = standaloneCode(ajvOrder, validateOrder);

const validateCreditNote = ajvCreditNote.compile(ublCreditNoteSchema);
const creditNoteSchemaModule = standaloneCode(ajvCreditNote, validateCreditNote);

const fs = require('fs');

fs.writeFileSync('./src/schemas/UBL-2.1-JSON/precompiled/invoiceSchemaPrecompiled.js', invoiceSchemaModule);
fs.writeFileSync('./src/schemas/UBL-2.1-JSON/precompiled/orderSchemaPrecompiled.js', orderSchemaModule);
fs.writeFileSync('./src/schemas/UBL-2.1-JSON/precompiled/creditNoteSchemaPrecompiled.js', creditNoteSchemaModule);
