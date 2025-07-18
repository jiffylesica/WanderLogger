import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  // Check the JWT
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please log in first' });
  }

  const userId = session.user.id;
  const journeyId = req.query.journeyId;

  if (!journeyId) {
    return res.status(400).json({ error: 'Journey ID is required' });
  }

  if (req.method === 'GET') {
    try {
      // Step 2: First check if this user OWNS this journey
      const journey = await db('journeys')
        .where({
          id: journeyId,
          user_id: userId,
        })
        .first();

      if (!journey) {
        return res.status(403).json({
          error: 'You can only view pins from your own journeys!',
        });
      }

      // Step 3: Now safe to get the pins
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
