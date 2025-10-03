const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const pool = require('../../config/db');

// GET volunteering details for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT 
                volunteering_id,
                user_id,
                location,
                company_sector,
                task,
                start_date,
                end_date
             FROM volunteering 
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Volunteering details not found',
                solution: 'Submit your volunteering details first'
            });
        }

        // Format dates for better readability
        const volunteeringDetails = result.rows.map(item => ({
            ...item,
            start_date: item.start_date ? item.start_date.toISOString().split('T')[0] : null,
            end_date: item.end_date ? item.end_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Volunteering details retrieved successfully',
            data: volunteeringDetails
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve volunteering details',
            details: error.message
        });
    }
});

// GET volunteering details by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const result = await pool.query(
            `SELECT 
                volunteering_id,
                user_id,
                location,
                company_sector,
                task,
                start_date,
                end_date
             FROM volunteering 
             WHERE user_id = $1`,
            [requestedUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Volunteering details not found for requested user'
            });
        }

        // Format dates for better readability
        const responseData = result.rows.map(item => ({
            volunteering_id: item.volunteering_id,
            user_id: item.user_id,
            location: item.location,
            company_sector: item.company_sector,
            task: item.task,
            start_date: item.start_date ? item.start_date.toISOString().split('T')[0] : null,
            end_date: item.end_date ? item.end_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Volunteering details retrieved successfully',
            data: responseData
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve volunteering details',
            details: error.message
        });
    }
});

module.exports = router;