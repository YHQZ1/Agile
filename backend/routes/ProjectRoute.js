const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const supabase = require('../config/supabaseClient');
const { NODE_ENV } = require('../config/env');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { project_title, description, tech_stack, project_link, role } = req.body;
    if (NODE_ENV !== 'production') {
        console.log("Received project payload:", { project_title, description, tech_stack, project_link, role });
    }

    // Validate required NOT NULL fields
    if (!project_title || !description || !tech_stack) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        // Verify user exists (since there's a foreign key constraint)
        const { data: userCheck, error: userCheckError } = await supabase
            .from('personal_details')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (userCheckError) {
            throw userCheckError;
        }

        if (!userCheck) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    user_id: userId,
                    project_title,
                    description,
                    tech_stack,
                    project_link: project_link || null,
                    role: role || null,
                },
            ])
            .select('project_id')
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            message: 'Project saved successfully',
            project_id: data.project_id
        });
    } catch (error) {
        console.error('Error saving project:', error);
        
        // Handle foreign key violation
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Invalid user_id' });
        }
        
        return res.status(500).json({ 
            error: 'Failed to save project',
            details: error.message 
        });
    }
});

module.exports = router;