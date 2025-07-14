import knex from 'knex';
import knexConfig from '../../../knexfile';
import db from '@/lib/db';

export default async function handler(req, res) {
  // Only run for POST requests (creating new data)
  if (req.method === 'POST') {
    try {
      // grab data sent by frontend (req.body)
      const { username, email } = req.body;

      // Save user to database (add new row)
      // .returning('*') returns new users data
      const [newUser] = await db('users')
        .insert({ username, email })
        .returning('*');

      // Send new user as response
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else if (req.method === 'GET') {
    try {
      // get all users
      const users = await db('users').select('*');

      res.status(200).json({ users });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Failed to GET users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
