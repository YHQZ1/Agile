const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const pool = require('../../config/db');

// GET accomplishments for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT 
                accomplishment_id,
                title, 
                institution,
                type,
                description,
                accomplishment_date,
                rank,
                user_id
             FROM accomplishments 
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Accomplishments not found',
                solution: 'Submit your accomplishments first'
            });
        }

        // Format dates for better readability
        const accomplishments = result.rows.map(accomplishment => ({
            ...accomplishment,
            accomplishment_date: accomplishment.accomplishment_date ? 
                accomplishment.accomplishment_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Accomplishments retrieved successfully',
            data: accomplishments
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve accomplishments',
            details: error.message
        });
    }
});

// GET accomplishments by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const result = await pool.query(
            `SELECT 
                accomplishment_id,
                title, 
                institution,
                type,
                description,
                accomplishment_date,
                rank,
                user_id
             FROM accomplishments 
             WHERE user_id = $1`,
            [requestedUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Accomplishments not found for requested user'
            });
        }

        // Format dates for better readability
        const accomplishments = result.rows.map(accomplishment => ({
            ...accomplishment,
            accomplishment_date: accomplishment.accomplishment_date ? 
                accomplishment.accomplishment_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Accomplishments retrieved successfully',
            data: accomplishments
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user accomplishments',
            details: error.message
        });
    }
});

module.exports = router;