const knex = require('../../knex');

exports.run = async () => {
  try {
    await knex.migrate.latest();
    const migrations = await knex.migrate.list();
    knex.destroy(); // We need to manually destroy the connection in order for the lambda to exit.
    return {
      status: 'success',
      message: `migrations completed :) Database: ${process.env.PG_DATABASE} Host: ${process.env.PG_HOST}`,
      currentMigrations: migrations
    };
  } catch (err) {
    console.error('Error running migrations: ', err);
    return `Error running migrations: ${err}`;
  }
};
