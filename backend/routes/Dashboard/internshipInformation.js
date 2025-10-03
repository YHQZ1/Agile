const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const pool = require('../../config/db');

// GET internships for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT 
                internship_id,
                user_id,
                company_name,
                job_title,
                location,
                company_sector,
                start_date,
                end_date,
                stipend_salary
             FROM internships 
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Internship details not found',
                solution: 'Submit your internship details first'
            });
        }

        // Format dates for better readability
        const internships = result.rows.map(internship => ({
            ...internship,
            start_date: internship.start_date ? internship.start_date.toISOString().split('T')[0] : null,
            end_date: internship.end_date ? internship.end_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Internship details retrieved successfully',
            data: internships
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve internship details',
            details: error.message
        });
    }
});

// GET internship details by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const result = await pool.query(
            `SELECT 
                internship_id,
                user_id,
                company_name,
                job_title,
                location,
                company_sector,
                start_date,
                end_date,
                stipend_salary
             FROM internships 
             WHERE user_id = $1`,
            [requestedUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Internship details not found for requested user'
            });
        }

        // Format dates for better readability
        const internships = result.rows.map(internship => ({
            ...internship,
            start_date: internship.start_date ? internship.start_date.toISOString().split('T')[0] : null,
            end_date: internship.end_date ? internship.end_date.toISOString().split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Internship details retrieved successfully',
            data: internships
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user internship details',
            details: error.message
        });
    }
});

module.exports = router;