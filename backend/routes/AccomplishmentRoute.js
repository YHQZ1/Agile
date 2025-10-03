const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const pool = require('../config/db');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // From JWT
    const { title, institution, type, description, accomplishment_date, rank } = req.body;

    // Validate required field
    if (!title) {
        return res.status(400).json({ 
            error: 'Missing required field',
            required: ['title'],
            optional: ['institution', 'type', 'description', 'accomplishment_date', 'rank']
        });
    }

    try {
        // Verify personal details exist (since user_id FK references personal_details)
        const personalExists = await pool.query(
            'SELECT 1 FROM personal_details WHERE user_id = $1',
            [userId]
        );

        if (personalExists.rows.length === 0) {
            return res.status(403).json({
                error: 'Complete profile setup first',
                solution: 'Submit personal details at /api/personal-details-form'
            });
        }

        // Insert with correct RETURNING clause
        const result = await pool.query(
            `INSERT INTO accomplishments (
                user_id, title, institution, 
                type, description, accomplishment_date, rank
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING accomplishment_id`,
            [userId, title, institution, type, description, accomplishment_date, rank]
        );

        return res.status(201).json({
            message: 'Accomplishment record created',
            accomplishment_id: result.rows[0].accomplishment_id,
            user_id: userId
        });

    } catch (error) {
        console.error('Database error:', error);
        
        if (error.code === '23503') {
            return res.status(403).json({
                error: 'Profile incomplete',
                details: 'The referenced user profile does not exist',
                action: 'Complete personal details first'
            });
        }

        return res.status(500).json({
            error: 'Database operation failed',
            details: error.message
        });
    }
});

module.exports = router;