const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const supabase = require('../../config/supabaseClient');

// GET extra curricular activities for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('extra_curricular')
            .select('activity_name, role, organization, duration')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Extra curricular activities not found',
                solution: 'Submit your extra curricular activities first'
            });
        }

        res.status(200).json({
            message: 'Extra curricular activities retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve extra curricular activities',
            details: error.message
        });
    }
});

// GET extra curricular activities by user ID (admin-only)
router.get('/:userId', authenticateToken, async (req, res) => {
    // Implement admin check here if needed
    const requestedUserId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('extra_curricular')
            .select('activity_name, role, organization, duration')
            .eq('user_id', requestedUserId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Extra curricular activities not found for requested user'
            });
        }

        res.status(200).json({
            message: 'Extra curricular activities retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: 'Failed to retrieve user extra curricular activities',
            details: error.message
        });
    }
});

module.exports = router;