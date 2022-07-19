const fs = require('fs');
const { convertUblXmlToPaJson } = require('./src/utils/paJsonHelper');

(async function main() {
  console.log('writing pa json');
  const xmlPath = process.argv.slice(2)[0];
  const xml = fs.readFileSync(xmlPath).toString();
  const paJSon = await convertUblXmlToPaJson(xml);
  fs.writeFileSync('pajson.json', JSON.stringify(paJSon));
}());
