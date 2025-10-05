const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
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

        console.log('Creating contact entry...');
        
        // Create contact entry
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message.trim(),
            subject: subject || 'New Contact Form Submission',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        console.log('Saving contact to database...');
        const savedContact = await contact.save();
        console.log('Contact saved successfully:', savedContact._id);
        console.log('Full saved contact:', savedContact);

        res.status(201).json({
            message: 'Message sent successfully! We will get back to you soon.',
            contact: {
                _id: savedContact._id,
                name: savedContact.name,
                email: savedContact.email,
                subject: savedContact.subject,
                createdAt: savedContact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Server error while sending message',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.json({
            contacts,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            message: 'Server error while fetching contacts',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status (admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be: new, read, replied, or resolved'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        res.json({
            message: `Contact status updated to ${status}`,
            contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            message: 'Server error while updating contact',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ message: 'Contact message deleted successfully' });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            message: 'Server error while deleting contact',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
