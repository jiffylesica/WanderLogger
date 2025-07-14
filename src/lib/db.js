// db.js
import knex from 'knex';
import knexConfig from '../../knexfile';

const env =
  process.env.VERCEL_ENV === 'production'
    ? 'production'
    : process.env.NODE_ENV || 'development';

let db;

if (!global.__knexInstance) {
  db = knex(knexConfig[env]);
  global.__knexInstance = db;
} else {
  db = global.__knexInstance;
}

export default db;
