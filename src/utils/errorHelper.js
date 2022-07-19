const validationTypes = {
  BASE: 'BASE',
  SCHEMA: 'SCHEMA',
  PEPPOL: 'PEPPOL'
};

const createXmlFromJson = (json) => `<description>${json.description}</description>
${json.rules ? `<rules>${json.rules}</rules>` : ''}
<details><json>${JSON.stringify(json.details)}</json></details>`;

const createValidationMetadata = (validationType, originalError) => {
  let xml;
  let json;

  if (validationType === validationTypes.BASE) {
    json = {
      description: 'Request is invalid',
      details: originalError.details
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.SCHEMA) {
    json = {
      description: 'Invoice does not conform to UBL 2.1',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.PEPPOL) {
    json = {
      description: 'Invoice is not valid according to Peppol BIS 3.0 rules',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else {
    json = {
      description: 'Request is invalid',
      details: originalError
    };
    xml = createXmlFromJson(json);
  }

  return {
    validationType,
    originalError,
    xml,
    json
  };
};

const createOrderValidationMetadata = (validationType, originalError) => {
  let xml;
  let json;

  if (validationType === validationTypes.BASE) {
    json = {
      description: 'Request is invalid',
      details: originalError.details
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.SCHEMA) {
    json = {
      description: 'Order does not conform to UBL 2.1',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.PEPPOL) {
    json = {
      description: 'Order is not valid according to Peppol BIS 3.0 rules',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else {
    json = {
      description: 'Request is invalid',
      details: originalError
    };
    xml = createXmlFromJson(json);
  }

  return {
    validationType,
    originalError,
    xml,
    json
  };
};

const createCreditNoteValidationMetadata = (validationType, originalError) => {
  let xml;
  let json;
  if (validationType === validationTypes.BASE) {
    json = {
      description: 'Request is invalid',
      details: originalError.details
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.SCHEMA) {
    json = {
      description: 'credit note does not conform to UBL 2.1',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else if (validationType === validationTypes.PEPPOL) {
    json = {
      description: 'credit note is not valid according to Peppol BIS 3.0 rules',
      details: originalError
    };
    xml = createXmlFromJson(json);
  } else {
    json = {
      description: 'Request is invalid',
      details: originalError
    };
    xml = createXmlFromJson(json);
  }
  return {
    validationType,
    originalError,
    xml,
    json
  };
};

module.exports = {
  createValidationMetadata,
  createOrderValidationMetadata,
  createCreditNoteValidationMetadata,
  validationTypes
};
