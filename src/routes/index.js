const incomingInvoices = require('./incomingInvoices');
const incomingOrders = require('./incomingOrders');
const incomingCreditNotes = require('./incomingCreditNotes');
const outgoingInvoices = require('./outgoingInvoices');
const outgoingOrders = require('./outgoingOrders');
const outgoingCreditNotes = require('./outgoingCreditNotes');

module.exports.load = (api) => {
  // Not sure if this is needed... AW 2019-08-01
  api.options('/*', (req, res) => {
    // Return CORS headers
    res.cors().send({});
  });

  switch (api.version) {
    // Current API version is 1. When the new version is released, it is needs to rename the current routes src/routes/incomingInvoices.1.js
    // And add a new src/routes/incomingInvoices.js which then will be version 2
    case '1':
    default:
      incomingInvoices.loadRoutes(api);
      outgoingInvoices.loadRoutes(api);

      incomingOrders.loadRoutes(api);
      outgoingOrders.loadRoutes(api);

      incomingCreditNotes.loadRoutes(api);
      outgoingCreditNotes.loadRoutes(api);
      break;
  }
};
