const OUTGOINGINVOICE_TABLE_NAME = 'outgoinginvoice';

exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema
    .createTable(OUTGOINGINVOICE_TABLE_NAME, (table) => {
      table.increments('id').primary().unsigned();
      table.string('uuid').unique().defaultsTo(knex.raw('uuid_generate_v4()'));

      table.string('owneraccount').notNullable();
      table.timestamp('invoicedate').notNullable();
      table.string('invoicenumber').notNullable();
      table.string('regno').notNullable();
      table.json('invoice').defaultTo(null);
      table.jsonb('metadata');

      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
  return true;
};

exports.down = async (knex) => {
  await knex.schema.dropTable(OUTGOINGINVOICE_TABLE_NAME);
};
