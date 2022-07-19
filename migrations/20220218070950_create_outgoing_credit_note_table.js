const OUTGOING_CREDIT_NOTE_TABLE_NAME = 'outgoing_credit_notes';

exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable(OUTGOING_CREDIT_NOTE_TABLE_NAME, (table) => {
    table.increments('id').primary().unsigned();
    table.string('uuid').unique().defaultsTo(knex.raw('uuid_generate_v4()'));
    table.string('owner_account').notNullable();
    table.timestamp('credit_note_date').notNullable();
    table.string('credit_note_number').notNullable();
    table.string('reg_no').notNullable();
    table.json('credit_note').defaultTo(null);
    table.jsonb('meta_data');

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  return true;
};

exports.down = async (knex) => {
  await knex.schema.dropTable(OUTGOING_CREDIT_NOTE_TABLE_NAME);
};
