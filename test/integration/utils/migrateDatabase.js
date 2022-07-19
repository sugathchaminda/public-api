const knex = require('../../../knex');

const runMigrations = async () => {
  await knex.migrate.latest();
};

module.exports = { runMigrations };
