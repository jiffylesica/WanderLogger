import knex from '../../../../knexfile';
import knexLib from 'knex';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const db = knexLib(knex.development);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const [newUser] = await db('users')
      .insert({ email, username, password: hashedPassword })
      .returning(['id', 'email', 'username']);

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
