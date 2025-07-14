import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    const users = await db('users').select('*').limit(1);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
}