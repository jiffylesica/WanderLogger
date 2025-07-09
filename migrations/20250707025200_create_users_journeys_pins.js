
// exports.up is where you create tables --> what happens when you run migration
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    /*
    Create table of users. Each user has a:
    1. id
    2. username
    3. email
    4. timestamps of when their entry was created_at and updated_at
    */
    .createTable('users', function(table) {
        // Primary key (identifier) for user is a id value which auto increments
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.timestamps(true, true);
    })
    .createTable('journeys', function(table) {
        table.increments('id').primary();
        // IMPORTANT, REFERENCE USER TABLE to give each journey a user id
        /*
        each journey has an integer user_id which is taken as the id of the current
        user from the users table. onDelete('CASCADE') means when you delete a user,
        their journeys will also get deleted

        YOU make sure the right user ID is accessed in the POST request to the backend
        */
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('journey_title');
        table.text('journey_description');
        table.timestamps(true, true);
    })
    .createTable('pins', function(table) {
        table.increments('id').primary();
        table.integer('journey_id').references('id').inTable('journeys').onDelete('CASCADE')
        table.string('pin_title');
        table.text('pin_description');
        table.float('latitude');
        table.float('longitude');
        table.date('date_traveled');
        table.string('image_url');
        table.timestamps(true, true);
    })
};

// What happens when you rollback (undo) migration
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('pins')
    .dropTableIfExists('journeys')
    .dropTableIfExists('users');
};
