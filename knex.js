/*
 * NB! This KNEX file is only used for MIGRATIONS!
 * AURORA DATA-API is used for any DB operation in code!
*/
const knex = require('knex');
const knexConfig = require('./knexfile');

module.exports = knex(knexConfig);
