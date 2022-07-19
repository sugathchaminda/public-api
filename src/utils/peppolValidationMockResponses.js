const errorResponse = {
  ves: {
    vesid: 'eu.peppol.bis3:invoice:3.12.0',
    name: 'OpenPEPPOL Invoice (3.12.0) (aka BIS Billing 3.0.10)',
    deprecated: false
  },
  success: false,
  interrupted: false,
  mostSevereErrorLevel: 'ERROR',
  results: [
    {
      success: 'TRUE',
      artifactType: 'xml',
      artifactPathType: 'in-memory',
      artifactPath: '',
      items: []
    },
    {
      success: 'TRUE',
      artifactType: 'xsd',
      artifactPathType: 'classpath',
      artifactPath: 'schemas/ubl21/maindoc/UBL-Invoice-2.1.xsd',
      items: []
    },
    {
      success: 'FALSE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/CEN-EN16931-UBL.xslt',
      items: [
        {
          errorLevel: 'ERROR',
          errorID: 'BR-01',
          errorFieldName: '/:Invoice[1]',
          test: "(cbc:CustomizationID) != ''",
          errorText: '[BR-01]-An Invoice shall have a Specification identifier (BT-24).   '
        },
        {
          errorLevel: 'ERROR',
          errorID: 'BR-CO-15',
          errorFieldName: '/:Invoice[1]',
          // eslint-disable-next-line max-len
          test: 'every $Currency in cbc:DocumentCurrencyCode satisfies (count(//cac:TaxTotal/xs:decimal(cbc:TaxAmount[@currencyID=$Currency])) eq 1) and (cac:LegalMonetaryTotal/xs:decimal(cbc:TaxInclusiveAmount) = round( (cac:LegalMonetaryTotal/xs:decimal(cbc:TaxExclusiveAmount) + cac:TaxTotal/xs:decimal(cbc:TaxAmount[@currencyID=$Currency])) * 10 * 10) div 100)',
          errorText: '[BR-CO-15]-Invoice total amount with VAT (BT-112) = Invoice total amount without VAT (BT-109) + Invoice total VAT amount (BT-110).'
        }
      ]
    },
    {
      success: 'FALSE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/PEPPOL-EN16931-UBL.xslt',
      items: [
        {
          errorLevel: 'ERROR',
          errorID: 'PEPPOL-EN16931-R001',
          errorFieldName: '/:Invoice[1]',
          test: 'cbc:ProfileID',
          errorText: 'Business process MUST be provided.'
        },
        {
          errorLevel: 'ERROR',
          errorID: 'PEPPOL-EN16931-R007',
          errorFieldName: '/:Invoice[1]',
          test: "$profile != 'Unknown'",
          errorText: "Business process MUST be in the format 'urn:fdc:peppol.eu:2017:poacc:billing:NN:1.0' where NN indicates the process number."
        }
      ]
    }
  ],
  durationMS: 567
};

const warningResponse = {
  ves: {
    vesid: 'eu.peppol.bis3:invoice:3.12.0',
    name: 'OpenPEPPOL Invoice (3.12.0) (aka BIS Billing 3.0.10)',
    deprecated: false
  },
  success: false,
  interrupted: false,
  mostSevereErrorLevel: 'WARNING',
  results: [
    {
      success: 'TRUE',
      artifactType: 'xml',
      artifactPathType: 'in-memory',
      artifactPath: '',
      items: []
    },
    {
      success: 'TRUE',
      artifactType: 'xsd',
      artifactPathType: 'classpath',
      artifactPath: 'schemas/ubl21/maindoc/UBL-Invoice-2.1.xsd',
      items: []
    },
    {
      success: 'FALSE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/CEN-EN16931-UBL.xslt',
      items: [
        {
          errorLevel: 'WARN',
          errorID: 'UBL-CR-671',
          errorFieldName: '/:Invoice[1]',
          test: 'not(//cac:Price/cac:AllowanceCharge/cbc:MultiplierFactorNumeric)',
          errorText: '[UBL-CR-671]-A UBL invoice should not include a Price Allowance Multiplier Factor'
        },
        {
          errorLevel: 'WARN',
          errorID: 'UBL-CR-678',
          errorFieldName: '/:Invoice[1]',
          test: 'not(//cac:TaxCategory/cbc:ID/@schemeID)',
          errorText: '[UBL-CR-678]-A UBL invoice should not include the TaxCategory/ID schemeID'
        },
        {
          errorLevel: 'WARN',
          errorID: 'UBL-CR-679',
          errorFieldName: '/:Invoice[1]',
          test: 'not(//cac:ClassifiedTaxCategory/cbc:ID/@schemeID)',
          errorText: '[UBL-CR-679]-A UBL invoice should not include the ClassifiedTaxCategory/ID schemeID'
        }
      ]
    },
    {
      success: 'TRUE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/PEPPOL-EN16931-UBL.xslt',
      items: []
    }
  ],
  durationMS: 567
};

const okResponse = {
  ves: {
    vesid: 'eu.peppol.bis3:invoice:3.12.0',
    name: 'OpenPEPPOL Invoice (3.12.0) (aka BIS Billing 3.0.10)',
    deprecated: false
  },
  success: true,
  interrupted: false,
  mostSevereErrorLevel: '',
  results: [
    {
      success: 'TRUE',
      artifactType: 'xml',
      artifactPathType: 'in-memory',
      artifactPath: '',
      items: []
    },
    {
      success: 'TRUE',
      artifactType: 'xsd',
      artifactPathType: 'classpath',
      artifactPath: 'schemas/ubl21/maindoc/UBL-Invoice-2.1.xsd',
      items: []
    },
    {
      success: 'TRUE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/CEN-EN16931-UBL.xslt',
      items: []
    },
    {
      success: 'TRUE',
      artifactType: 'schematron-xslt',
      artifactPathType: 'classpath',
      artifactPath: 'schematron/openpeppol/3.12.0/xslt/PEPPOL-EN16931-UBL.xslt',
      items: []
    }
  ],
  durationMS: 567
};

module.exports = {
  errorResponse,
  warningResponse,
  okResponse
};
