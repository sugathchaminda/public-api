/* eslint-disable no-plusplus */
const knex = require('../../../knex');
const {
  convertUblJsonToPaJson,
  getInvoiceDateFromPaJson,
  convertOrderUblJsonToPaJson,
  getOrderDateFromPaJson,
  convertCreditNoteUblJsonToPaJson,
  getCreditNoteDateFromPaJson
} = require('../../../src/utils/paJsonHelper');
const { trivialInvoiceUBLJson } = require('../../mockData/ublJsonInvoiceTestData');
const { trivialOrderUBLJson } = require('../../mockData/ublJsonOrderTestData');
const { trivialCreditNoteUBLJson } = require('../../mockData/ublJsonCreditNoteTestData');

const seedIncomingInvoices = async (amount, regNo, orgNo, readAt = false) => {
  const queryArray = [];
  for (let i = 0; i < amount; i++) {
    const invoicenumber = i;
    const invoice = convertUblJsonToPaJson(trivialInvoiceUBLJson(orgNo, invoicenumber));
    const invoicedate = getInvoiceDateFromPaJson(invoice);
    queryArray.push({
      owneraccount: regNo,
      invoicedate,
      invoicenumber,
      regno: regNo,
      invoice: JSON.stringify(invoice),
      readAt: readAt ? knex.fn.now() : null,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    });
  }

  return knex('incominginvoice').insert(queryArray);
};

const clearOutgoingInvoices = async () => knex('outgoinginvoice').del();

const clearIncomingInvoices = async () => knex('incominginvoice').del();

const seedIncomingOrders = async (amount, regNo, orgNo, readAt = false) => {
  const queryArray = [];
  for (let i = 0; i < amount; i++) {
    const orderNumber = i;
    const order = convertOrderUblJsonToPaJson(trivialOrderUBLJson(orgNo, orderNumber));
    const orderDate = getOrderDateFromPaJson(order);
    queryArray.push({
      owner_account: regNo,
      order_date: orderDate,
      order_number: orderNumber,
      reg_no: regNo,
      order: JSON.stringify(order),
      readAt: readAt ? knex.fn.now() : null,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    });
  }
  return knex('incoming_orders').insert(queryArray);
};

const clearOutgoingOrders = async () => knex('outgoing_orders').del();

const clearIncomingOrders = async () => knex('incoming_orders').del();

const seedIncomingCreditNotes = async (amount, regNo, orgNo, readAt = false) => {
  const queryArray = [];
  for (let i = 0; i < amount; i++) {
    const creditNoteNumber = i;
    const creditNote = convertCreditNoteUblJsonToPaJson(trivialCreditNoteUBLJson(orgNo, creditNoteNumber));
    const creditNoteDate = getCreditNoteDateFromPaJson(creditNote);
    queryArray.push({
      owner_account: regNo,
      credit_note_date: creditNoteDate,
      credit_note_number: creditNoteNumber,
      reg_no: regNo,
      credit_note: JSON.stringify(creditNote),
      readAt: readAt ? knex.fn.now() : null,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now()
    });
  }
  return knex('incoming_credit_notes').insert(queryArray);
};

const clearOutgoingCreditNotes = async () => knex('outgoing_credit_notes').del();

const clearIncomingCreditNotes = async () => knex('incoming_credit_notes').del();

module.exports = {
  seedIncomingInvoices,
  clearIncomingInvoices,
  clearOutgoingInvoices,

  seedIncomingOrders,
  clearIncomingOrders,
  clearOutgoingOrders,

  seedIncomingCreditNotes,
  clearIncomingCreditNotes,
  clearOutgoingCreditNotes
};
