// Get and Put journeys by ID
import knex from "knex";
import knexConfig from '../../../../knexfile';

const db = knex(knexConfig.development);

export default async function handler(req, res) {
    const {id} = req.query

    if (req.method === 'GET') {
        try {
            const journey = await db('journeys').where({id}).first();
            if (journey) {
                res.status(200).json({journey});
            } else {
                res.status(404).json({ error: 'Journey not found'});
            } 
        } catch (error) {
            console.error('Error fetching journeys', error);
            res.status(500).json({error: 'Failed to fetch journey'});
        }
    }

    else if (req.method === 'PUT') {
        try {
            const {journey_title, journey_description} = req.body;

            const [updatedJourney] = await db('journeys')
                .where({id})
                .update({journey_title, journey_description, updated_at: db.fn.now()})
                .returning('*')

            res.status(200).json({journey: updatedJourney});
        } catch (error) {
            console.error('Error updating journey:', error)
            res.status(500).json({error: 'Failed to update journey'})
        }
    }

    else if (req.method === "DELETE") {
        try {
            await db ('journeys').where({ id }).del();
            res.status(200).json({message: "Journey Deleted"})
        } catch (error) {
            console.error('Error deleting journey:', error)
            res.status(500).json({error: 'Failed to delete journey'})
        }
    }
    
    else {
        res.status(405).json({error: 'Method not allowed'})
    }
}