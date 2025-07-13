import knex from 'knex';
import knexConfig from '../../../knexfile';

// Create connection to development database with Knex
const db = knex(knexConfig.development);

export default async function handler(req, res) {
  // Only run for POST requests (creating new data)
  if (req.method === 'POST') {
    try {
      // grab data sent by frontend (req.body)
      const { user_id, journey_title, journey_description } = req.body;

      const [newJourney] = await db('journeys')
        .insert({ user_id, journey_title, journey_description })
        .returning('*');

      // Send new journey as response
      res.status(201).json({ journey: newJourney });
    } catch (error) {
      console.error('Error creating journey:', error);
      res.status(500).json({ error: 'Failed to create journey' });
    }
  } else if (req.method === 'GET') {
    try {
      const journeys = await db('journeys').select('*');

      res.status(200).json({ journeys });
    } catch (error) {
      console.error('Error retrieving journeys:', error);
      res.status(500).json({ error: 'Failed to GET journeys' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
