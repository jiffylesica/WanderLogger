// src/pages/api/journeys.js
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  // Check the JWT wristband!
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please log in first' });
  }

  const userId = session.user.id; // This comes from the JWT, not the frontend!

  if (req.method === 'POST') {
    try {
      const { journey_title, journey_description } = req.body;
      // Notice: NO user_id from frontend - we use the one from JWT!

      const [newJourney] = await db('journeys')
        .insert({
          user_id: userId, // From JWT, not from user input!
          journey_title,
          journey_description,
        })
        .returning('*');

      res.status(201).json({ journey: newJourney });
    } catch (error) {
      console.error('Error creating journey:', error);
      res.status(500).json({ error: 'Failed to create journey' });
    }
  } else if (req.method === 'GET') {
    try {
      // Only get THIS user's journeys!
      const journeys = await db('journeys')
        .where({ user_id: userId }) // The magic filter!
        .select('*');

      res.status(200).json({ journeys });
    } catch (error) {
      console.error('Error retrieving journeys:', error);
      res.status(500).json({ error: 'Failed to GET journeys' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
