const fs = require('fs');
const { convertUblXmlToUblJson } = require('./src/utils/ublJsonHelper');

(async function main() {
  console.log('writing pa json');
  const xmlPath = process.argv.slice(2)[0];
  const xml = fs.readFileSync(xmlPath).toString();
  const paJSon = await convertUblXmlToUblJson(xml);
  fs.writeFileSync('ubljson.json', JSON.stringify(paJSon));
}());
