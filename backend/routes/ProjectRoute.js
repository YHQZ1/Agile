const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const pool = require('../config/db');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { project_title, description, tech_stack, project_link, role } = req.body;
    if (process.env.NODE_ENV !== 'production') {
        console.log("Received project payload:", { project_title, description, tech_stack, project_link, role });
    }

    // Validate required NOT NULL fields
    if (!project_title || !description || !tech_stack) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        // Verify user exists (since there's a foreign key constraint)
        const userCheck = await pool.query(
            'SELECT 1 FROM personal_details WHERE user_id = $1', 
            [userId]
        );
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const query = `
            INSERT INTO projects (
                user_id, project_title, description, 
                tech_stack, project_link, role
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING project_id
        `;
        const values = [
            userId, project_title, description, 
            tech_stack, project_link, role
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: 'Project saved successfully',
            project_id: result.rows[0].project_id
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