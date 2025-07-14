// Shared database instance
import knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NODE_ENV || 'development';

// Ensure the knex instance is reused across hot reloads (important in dev)
let db;

if (!global.__knexInstance) {
  db = knex(knexConfig[env]);
  global.__knexInstance = db;
} else {
  db = global.__knexInstance;
}

export default db;
