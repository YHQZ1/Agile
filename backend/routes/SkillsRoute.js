const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // From JWT
    const { skill_name, skill_proficiency } = req.body;

    // Validate required fields
    if (!skill_name) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['skill_name'],
            optional: ['skill_proficiency']
        });
    }

    // Validate skill_proficiency if provided
    if (skill_proficiency && !['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill_proficiency)) {
        return res.status(400).json({ 
            error: 'Invalid skill proficiency',
            allowed_values: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
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
            .from('skills')
            .insert([
                {
                    user_id: userId,
                    skill_name,
                    skill_proficiency: skill_proficiency || null,
                },
            ])
            .select('skill_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Skill record created',
            skill_id: data.skill_id,
            user_id: userId
        });

    } catch (error) {
        console.error('Database error:', error);
        
        if (error.code === '23505') { // Unique violation (skill_name)
            return res.status(409).json({
                error: 'Skill already exists',
                details: 'This skill name is already recorded for your account',
                action: 'Use a different skill name or update the existing one'
            });
        }

        if (error.code === '23503') { // Foreign key violation
            return res.status(403).json({
                error: 'Profile incomplete',
                details: 'The referenced user profile does not exist',
                action: 'Complete personal details first'
            });
        }

        if (error.code === '23514') { // Check constraint violation
            return res.status(400).json({
                error: 'Invalid skill proficiency',
                allowed_values: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            });
        }

        return res.status(500).json({
            error: 'Database operation failed',
            details: error.message
        });
    }
});

module.exports = router;