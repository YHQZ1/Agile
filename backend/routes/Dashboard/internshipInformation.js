const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticationToken');
const supabase = require('../../config/supabaseClient');

// GET internships for authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('internships')
            .select('internship_id, user_id, company_name, job_title, location, company_sector, start_date, end_date, stipend_salary')
            .eq('user_id', userId)
            .order('start_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Internship details not found',
                solution: 'Submit your internship details first'
            });
        }

        const internships = data.map(internship => ({
            ...internship,
            start_date: internship.start_date ? internship.start_date.split('T')[0] : null,
            end_date: internship.end_date ? internship.end_date.split('T')[0] : null
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
        const { data, error } = await supabase
            .from('internships')
            .select('internship_id, user_id, company_name, job_title, location, company_sector, start_date, end_date, stipend_salary')
            .eq('user_id', requestedUserId)
            .order('start_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'Internship details not found for requested user'
            });
        }

        const internships = data.map(internship => ({
            ...internship,
            start_date: internship.start_date ? internship.start_date.split('T')[0] : null,
            end_date: internship.end_date ? internship.end_date.split('T')[0] : null
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