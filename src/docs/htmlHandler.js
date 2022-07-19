const fs = require('fs');

const html = fs.readFileSync('./dist/redoc-static.html').toString();

exports.run = async () => ({
  statusCode: 200,
  body: html,
  headers: {
    'Content-type': 'text/html'
  }
});
