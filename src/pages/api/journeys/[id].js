// Get and Put journeys by ID
import knex from 'knex';
import knexConfig from '../../../../knexfile';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const id = req.query.id;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!id) {
    return res.status(400).json({ error: 'Journey ID is required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      let query = db('journeys').where({ id });

      // Check ownership
      if (userId) {
        query = query.andWhere({ user_id: userId });
      }

      const journey = await query.first();

      if (!journey) {
        return res.status(404).json({ error: 'Journey not found' });
      }
      res.status(200).json({ journey });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch journeys' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { journey_title, journey_description } = req.body;

      const [updatedJourney] = await db('journeys')
        // Restrict by owner
        .where({ id, user_id: userId })
        .update({ journey_title, journey_description, updated_at: db.fn.now() })
        .returning('*');

      if (!updatedJourney) {
        return res
          .status(403)
          .json({ error: 'Not authorized to access this journey' });
      }

      res.status(200).json({ journey: updatedJourney });
    } catch (error) {
      console.error('Error updating journey:', error);
      res.status(500).json({ error: 'Failed to update journey' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await db('journeys').where({ id, user_id: userId }).del();
      if (deleted === 0) {
        return res
          .status(403)
          .json({ error: 'Not authorized to delete this journey' });
      }
      res.status(200).json({ message: 'Journey Deleted' });
    } catch (error) {
      console.error('Error deleting journey:', error);
      res.status(500).json({ error: 'Failed to delete journey' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
