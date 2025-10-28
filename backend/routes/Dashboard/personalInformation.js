const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const pool = require('../../config/db');

// GET personal details for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT 
                first_name, 
                last_name,
                dob,
                gender,
                institute_roll_no,
                personal_email, 
                phone_number,
                profile_picture
             FROM personal_details 
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Personal details not found',
                solution: 'Submit your personal details first'
            });
        }

        // Format date of birth for better readability
        const personalDetails = {
            ...result.rows[0],
            dob: result.rows[0].dob ? result.rows[0].dob.toISOString().split('T')[0] : null
        };

        res.status(200).json({
            message: 'Personal details retrieved successfully',
            data: personalDetails
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve personal details',
            details: error.message
        });
    }
});

// GET personal details by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const result = await pool.query(
            `SELECT 
                first_name, 
                last_name,
                personal_email,
                phone_number,
                dob,
                gender
             FROM personal_details 
             WHERE user_id = $1`,
            [requestedUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Personal details not found for requested user'
            });
        }

        // Omit sensitive fields for non-admin requests
        const responseData = {
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            email: result.rows[0].personal_email,
            // Add other non-sensitive fields as needed
        };

        res.status(200).json({
            message: 'Personal details retrieved successfully',
            data: responseData
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user details',
            details: error.message
        });
    }
});

module.exports = router;