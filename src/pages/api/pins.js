import knex from 'knex';
import knexConfig from '../../../knexfile';
import db from '@/lib/db';

export default async function handler(req, res) {
  // Only run for POST requests (creating new data)
  if (req.method === 'POST') {
    try {
      // grab data sent by frontend (req.body)
      const {
        journey_id,
        pin_title,
        pin_description,
        latitude,
        longitude,
        date_traveled,
        image_url,
      } = req.body;

      const [newPin] = await db('pins')
        .insert({
          journey_id,
          pin_title,
          pin_description,
          latitude,
          longitude,
          date_traveled,
          image_url,
        })
        .returning('*');

      // Send new pin as response
      res.status(201).json({ pin: newPin });
    } catch (error) {
      console.error('Error creating pin:', error);
      res.status(500).json({ pin: 'Failed to create pin' });
    }
  } else if (req.method === 'GET') {
    try {
      // get all pins
      const pins = await db('pins').select('*');

      res.status(200).json({ pins });
    } catch (error) {
      console.error('Error retrieving pins:', error);
      res.status(500).json({ error: 'Failed to GET pins' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
