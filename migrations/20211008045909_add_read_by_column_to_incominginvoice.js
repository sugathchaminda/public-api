const tableName = 'incominginvoice';

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table.string('readBy').defaultTo(null);
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table.dropColumn('readBy');
  });
};
