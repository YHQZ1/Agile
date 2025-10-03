const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticationToken');
const pool = require('../config/db');

router.post('/', authenticateToken, async (req, res) => {
    const { first_name, last_name, dob, gender, institute_roll_no, personal_email, phone_number } = req.body;
    console.log("Received data:", req.body);

    // Validate required fields
    if (!first_name || !last_name || !dob || !institute_roll_no || !phone_number) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
        return res.status(400).json({ error: 'Invalid gender value' });
    }

    // Basic date validation
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for dob' });
    }
    if (dobDate > new Date()) {
        return res.status(400).json({ error: 'Date of birth cannot be in the future' });
    }

    try {
        const query = `
            INSERT INTO personal_details (
                first_name, last_name, dob, gender, 
                institute_roll_no, personal_email, phone_number
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING user_id
        `;
        const values = [
            first_name, last_name, dob, gender, 
            institute_roll_no, personal_email, phone_number
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: 'Personal information saved successfully',
            user_id: result.rows[0].user_id
        });
    } catch (error) {
        console.error('Error saving personal information:', error);
        
        // Handle unique constraint violations
        if (error.code === '23505') {
            if (error.constraint === 'authentication_institute_roll_no_key') {
                return res.status(400).json({ error: 'Institute roll number already exists' });
            }
            if (error.constraint === 'authentication_phone_number_key') {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
        }

        return res.status(500).json({ 
            error: 'Failed to save personal information',
            details: error.message 
        });
    }
});

module.exports = router;