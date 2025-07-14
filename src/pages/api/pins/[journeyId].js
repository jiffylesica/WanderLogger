import db from '@/lib/db';

export default async function handler(req, res) {
  const journeyId = req.query.journeyId;

  if (!journeyId) {
    return res.status(400).json({ error: 'Journey ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const pins = await db('pins').where({ journey_id: journeyId });
      res.status(200).json({ pins });
    } catch (err) {
      console.error('Error fetching pins:', err);
      res.status(500).json({ error: 'Failed to load pins' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
