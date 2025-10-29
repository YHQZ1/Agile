const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const supabase = require('../../config/supabaseClient');

// GET competition events for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('competition_events')
            .select('event_id, event_name, event_date, role, achievement, skills, user_id')
            .eq('user_id', userId)
            .order('event_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Competition events not found',
                solution: 'Submit your competition events first'
            });
        }

        const competitionEvents = data.map(event => ({
            ...event,
            event_date: event.event_date ? event.event_date.split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Competition events retrieved successfully',
            data: competitionEvents
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve competition events',
            details: error.message
        });
    }
});

// GET competition events by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('competition_events')
            .select('event_id, event_name, event_date, role, achievement, skills, user_id')
            .eq('user_id', requestedUserId)
            .order('event_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Competition events not found for requested user'
            });
        }

        const responseData = data.map(event => ({
            ...event,
            event_date: event.event_date ? event.event_date.split('T')[0] : null
        }));

        res.status(200).json({
            message: 'Competition events retrieved successfully',
            data: responseData
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user competition events',
            details: error.message
        });
    }
});

module.exports = router;