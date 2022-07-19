const knex = require('./knex');

async function up() {
  return knex.migrate.latest();
}

async function down() {
  return knex.migrate.down();
}

module.exports = {
  up,
  down
};
