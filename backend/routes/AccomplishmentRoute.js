const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');

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
            .from('accomplishments')
            .insert([
                {
                    user_id: userId,
                    title,
                    institution: institution || null,
                    type: type || null,
                    description: description || null,
                    accomplishment_date: accomplishment_date || null,
                    rank: rank || null,
                },
            ])
            .select('accomplishment_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Accomplishment record created',
            accomplishment_id: data.accomplishment_id,
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