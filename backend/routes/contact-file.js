const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const contactsFilePath = path.join(__dirname, '../storage/contacts.json');

// @route   POST /api/contact-file
// @desc    Submit contact form (File storage)
// @access  Public
router.post('/', async (req, res) => {
    try {
        console.log('Contact form submission received:', req.body);
        
        const { name, email, phone, message, subject } = req.body;

        // Validation
        if (!name || !email || !phone || !message) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                message: 'Name, email, phone, and message are required'
            });
        }

        // Create contact entry
        const contactEntry = {
            _id: Date.now().toString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message.trim(),
            subject: subject || 'New Contact Form Submission',
            createdAt: new Date().toISOString(),
            status: 'new'
        };

        console.log('Reading existing contacts...');
        
        // Read existing contacts
        let contacts = [];
        try {
            const data = await fs.readFile(contactsFilePath, 'utf8');
            contacts = JSON.parse(data);
        } catch (error) {
            console.log('No existing contacts file, creating new one');
            contacts = [];
        }

        // Add new contact
        contacts.push(contactEntry);

        console.log('Saving contact to file...');
        
        // Save to file
        await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
        
        console.log('Contact saved successfully:', contactEntry._id);

        res.status(201).json({
            message: 'Message sent successfully! We will get back to you soon.',
            contact: {
                _id: contactEntry._id,
                name: contactEntry.name,
                email: contactEntry.email,
                subject: contactEntry.subject,
                createdAt: contactEntry.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            message: 'Server error while sending message',
            error: error.message
        });
    }
});

// @route   GET /api/contact-file
// @desc    Get all contact messages
// @access  Public
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(contactsFilePath, 'utf8');
        const contacts = JSON.parse(data);
        
        res.json({
            contacts: contacts.reverse(), // Latest first
            total: contacts.length
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            message: 'Server error while fetching contacts',
            error: error.message
        });
    }
});

module.exports = router;
