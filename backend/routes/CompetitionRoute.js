const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // From JWT
    const { event_name, event_date, role, achievement, skills } = req.body;

    // Validate required fields
    if (!event_name || !event_date) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['event_name', 'event_date']
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
            .from('competition_events')
            .insert([
                {
                    user_id: userId,
                    event_name,
                    event_date,
                    role: role || null,
                    achievement: achievement || null,
                    skills: skills || null,
                },
            ])
            .select('event_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Competition event record created',
            event_id: data.event_id,
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