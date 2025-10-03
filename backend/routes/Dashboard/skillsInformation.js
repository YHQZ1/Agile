const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const pool = require('../../config/db');

// GET skills for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT 
                skill_id,
                skill_name, 
                skill_proficiency,
                user_id
             FROM skills 
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Skills not found',
                solution: 'Add your skills first'
            });
        }

        res.status(200).json({
            message: 'Skills retrieved successfully',
            data: result.rows
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve skills',
            details: error.message
        });
    }
});

// GET skills by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const result = await pool.query(
            `SELECT 
                skill_id,
                skill_name, 
                skill_proficiency,
                user_id
             FROM skills 
             WHERE user_id = $1`,
            [requestedUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Skills not found for requested user'
            });
        }

        res.status(200).json({
            message: 'Skills retrieved successfully',
            data: result.rows
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user skills',
            details: error.message
        });
    }
});

module.exports = router;