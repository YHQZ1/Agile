const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const supabase = require('../../config/supabaseClient');

// GET personal details for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('personal_details')
            .select('first_name, last_name, dob, gender, institute_roll_no, personal_email, phone_number, profile_picture')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                message: 'Personal details not found',
                solution: 'Submit your personal details first'
            });
        }

        const personalDetails = {
            ...data,
            dob: data.dob ? data.dob.split('T')[0] : null
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
        const { data, error } = await supabase
            .from('personal_details')
            .select('first_name, last_name, personal_email, phone_number, dob, gender')
            .eq('user_id', requestedUserId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                message: 'Personal details not found for requested user'
            });
        }

        // Omit sensitive fields for non-admin requests
        const responseData = {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.personal_email,
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