const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({
  strict: false,
  coerceTypes: true
});

// If you want to use both draft-04 and draft-06/07 schemas:
const ublInvoiceSchema = {
  $id: 'UBl-Invoice-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/maindoc/UBL-Invoice-2.1.json')
};
const ublOrderSchema = {
  $id: 'UBl-Order-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/maindoc/UBL-Order-2.1.json')
};
const ublCreditNoteSchema = {
  $id: 'UBl-CreditNote-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/maindoc/UBL-CreditNote-2.1.json')
};
const bndrCctCctSchemaModuleSchema = {
  $id: 'BDNDR-CCTS_CCT_SchemaModule-1.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/BDNDR-CCTS_CCT_SchemaModule-1.1.json')
};
const ublCommonAggregateComponentsSchema = {
  $id: 'UBL-CommonAggregateComponents-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/UBL-CommonAggregateComponents-2.1.json')
};
const ublCommonBasicComponentsSchema = {
  $id: 'UBL-CommonBasicComponents-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/UBL-CommonBasicComponents-2.1.json')
};
const ublCommonExtensionComponentsSchema = {
  $id: 'UBL-CommonExtensionComponents-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/UBL-CommonExtensionComponents-2.1.json')
};
const ublExtensionContentDataTypeSchema = {
  $id: 'UBL-ExtensionContentDataType-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/UBL-ExtensionContentDataType-2.1.json')
};
const ublQualifiedDataTypesSchema = {
  $id: 'UBL-QualifiedDataTypes-2.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/UBL-QualifiedDataTypes-2.1.json')
};
const bdndrUnqaulifiedDataTypesSchema = {
  $id: 'BDNDR-UnqualifiedDataTypes-1.1',
  // eslint-disable-next-line global-require
  ...require('../schemas/UBL-2.1-JSON/common/BDNDR-UnqualifiedDataTypes-1.1.json')
};

addFormats(ajv);
ajv.addSchema(ublInvoiceSchema, 'UBl-Invoice-2.1');
ajv.addSchema(ublOrderSchema, 'UBl-Order-2.1');
ajv.addSchema(ublCreditNoteSchema, 'UBl-CreditNote-2.1');
ajv.addSchema(bndrCctCctSchemaModuleSchema, 'BDNDR-CCTS_CCT_SchemaModule-1.1');
ajv.addSchema(ublCommonAggregateComponentsSchema, 'UBL-CommonAggregateComponents-2.1');
ajv.addSchema(ublCommonBasicComponentsSchema, 'UBL-CommonBasicComponents-2.1');
ajv.addSchema(ublCommonExtensionComponentsSchema, 'UBL-CommonExtensionComponents-2.1');
ajv.addSchema(ublExtensionContentDataTypeSchema, 'UBL-ExtensionContentDataType-2.1');
ajv.addSchema(ublQualifiedDataTypesSchema, 'UBL-QualifiedDataTypes-2.1');
ajv.addSchema(bdndrUnqaulifiedDataTypesSchema, 'BDNDR-UnqualifiedDataTypes-1.1');

module.exports = {
  ajv
};
