// src/pages/api/pins.js
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  // Step 1: Check the wristband!
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Please log in first' });
  }

  const userId = session.user.id;

  if (req.method === 'POST') {
    try {
      const {
        journey_id,
        pin_title,
        pin_description,
        latitude,
        longitude,
        date_traveled,
        image_url,
      } = req.body;

      // Step 2: Verify this user OWNS the journey they're adding a pin to!
      const journey = await db('journeys')
        .where({
          id: journey_id,
          user_id: userId, // Make sure it's THEIR journey
        })
        .first();

      if (!journey) {
        return res.status(403).json({
          error: 'You can only add pins to your own journeys!',
        });
      }

      // Step 3: Now safe to create the pin
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

      res.status(201).json({ pin: newPin });
    } catch (error) {
      console.error('Error creating pin:', error);
      res.status(500).json({ error: 'Failed to create pin' });
    }
  } else if (req.method === 'GET') {
    try {
      // Step 4: Only get pins from THIS user's journeys
      const pins = await db('pins')
        .join('journeys', 'pins.journey_id', 'journeys.id')
        .where('journeys.user_id', userId)
        .select('pins.*'); // Select only pin columns, not journey data

      res.status(200).json({ pins });
    } catch (error) {
      console.error('Error retrieving pins:', error);
      res.status(500).json({ error: 'Failed to GET pins' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
