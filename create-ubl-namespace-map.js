const xml2js = require('xml2js');
const fs = require('fs');

/*
* NOTE:
*
* this script generates the ubl namespace map to a js file that is required in code for converting
* ubl-json to pa-json(with namespaces)
*
* Should only be needed to run once(on your own computer) to create the file(that is then checked in as any other source).
*
* But if we need to add to the namespace-map we can edit this file and regenerate the namespace-map.
*
* */

const getUblNamespaceMappings = async (xsdString) => {
  const parser = new xml2js.Parser({ explicitArray: true });
  const json = await parser.parseStringPromise(xsdString);
  const types = json['xsd:schema']['xsd:complexType'];
  const elements = types.map((type) => type['xsd:sequence'][0]['xsd:element']);
  const refs = elements.map((element) => element.map((content) => content.$.ref)).flat();
  const uniqueRefs = [...new Set(refs)];
  const namespacemappings = {};

  uniqueRefs.forEach((ref) => {
    const components = ref.split(':');
    // eslint-disable-next-line prefer-destructuring
    namespacemappings[components[1]] = components[0];
  });

  return namespacemappings;
};

const getUblNamespaceMappingsFromInvoice = async () => {
  const xsdFile = fs.readFileSync('./UBL-2.1/UBL-Invoice-2.1.xsd');
  const xsdString = xsdFile.toString();
  return getUblNamespaceMappings(xsdString);
};

const getUblNamespaceMappingsFromOrder = async () => {
  const xsdFile = fs.readFileSync('./UBL-2.1/UBL-Order-2.1.xsd');
  const xsdString = xsdFile.toString();
  return getUblNamespaceMappings(xsdString);
};

const getUblNamespaceMappingsFromCreditNote = async () => {
  const xsdFile = fs.readFileSync('./UBL-2.1/UBL-CreditNote-2.1.xsd');
  const xsdString = xsdFile.toString();
  return getUblNamespaceMappings(xsdString);
};

const getUblNamespaceMappingsFromCAC = async () => {
  const xsdFile = fs.readFileSync('./UBL-2.1/common/UBL-CommonAggregateComponents-2.1.xsd');
  const xsdString = xsdFile.toString();
  return getUblNamespaceMappings(xsdString);
};

(async function main() {
  const cacNamespaceMap = await getUblNamespaceMappingsFromCAC();
  const invoiceNamespaceMap = await getUblNamespaceMappingsFromInvoice();
  const orderNamespaceMap = await getUblNamespaceMappingsFromOrder();
  const creditNoteNamespaceMap = await getUblNamespaceMappingsFromCreditNote();
  const namespaceMap = {
    ...cacNamespaceMap, ...invoiceNamespaceMap, ...orderNamespaceMap, ...creditNoteNamespaceMap
  };
  const comment = '// Note this is a generated file using create-ubl-namespace-map.js script, to change it regenerate it using the script';
  fs.writeFileSync('./src/utils/ubl21NamespaceMap.js', `${comment}\nconst namespaceMap = ${JSON.stringify(namespaceMap)};\nmodule.exports = namespaceMap;`);
}());
