const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // From JWT
    const { activity_name, role, organization, duration } = req.body;

    // Validate required fields - at least one should be provided
    if (!activity_name && !role && !organization && !duration) {
        return res.status(400).json({ 
            error: 'At least one field must be provided',
            possible_fields: ['activity_name', 'role', 'organization', 'duration']
        });
    }

    try {
        // Verify personal details exist (since user_id FK references personal_details)
        const { data: personalExists, error: personalError } = await supabase
            .from('personal_details')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (personalError) {
            throw personalError;
        }

        if (!personalExists) {
            return res.status(403).json({
                error: 'Complete profile setup first',
                solution: 'Submit personal details at /api/personal-details-form'
            });
        }

        const { data, error } = await supabase
            .from('extra_curricular')
            .insert([
                {
                    user_id: userId,
                    activity_name: activity_name || null,
                    role: role || null,
                    organization: organization || null,
                    duration: duration || null,
                },
            ])
            .select('extra_curricular_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Extra curricular record created',
            extra_curricular_id: data.extra_curricular_id,
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