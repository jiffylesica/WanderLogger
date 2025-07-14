// Update with your config settings.
// This is the configuration file that tells Knex
// 1. Which database system to use (PostgreSQL, SQLite, etc)
// 2. How to connect to database (what are are credentials)
// 3. Where to find migration files (files that create database tables)
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

// This says we export config object so Knex can read it
module.exports = {
  // 3 Environments, each can have a different database

  // Development environment: when building on own computer
  development: {
    // Use PostgreSQL database
    client: 'pg',
    // Read connection string from .env file (security practice)
    connection: process.env.DATABASE_URL,
    // Tells Knex where to store migration files (table definitions)
    migrations: {
      directory: './migrations',
    },
    // Where seed files (starting test data) will go
    seeds: {
      directory: './seeds',
    },
  },

  // Staging: for testing before deploying to users
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  // For live, deployed version
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
