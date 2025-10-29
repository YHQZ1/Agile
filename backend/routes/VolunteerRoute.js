const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // From JWT
    const { location, company_sector, task, start_date, end_date } = req.body;

    // Validate required fields
    if (!location || !company_sector || !task || !start_date || !end_date) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['location', 'company_sector', 'task', 'start_date', 'end_date']
        });
    }

    // Validate date range
    if (new Date(start_date) >= new Date(end_date)) {
        return res.status(400).json({ 
            error: 'Invalid date range',
            message: 'End date must be after start date'
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
            .from('volunteering')
            .insert([
                {
                    user_id: userId,
                    location,
                    company_sector,
                    task,
                    start_date,
                    end_date,
                },
            ])
            .select('volunteering_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Volunteering record created',
            volunteering_id: data.volunteering_id,
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