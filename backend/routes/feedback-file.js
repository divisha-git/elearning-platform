const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const feedbackFilePath = path.join(__dirname, '../storage/feedback.json');

// @route   POST /api/feedback-file
// @desc    Submit feedback (File storage)
// @access  Public
router.post('/', async (req, res) => {
    try {
        console.log('Feedback submission received:', req.body);
        
        const { name, comment, rating, image } = req.body;

        // Validation
        if (!name || !comment || !rating) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                message: 'Name, comment, and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            console.log('Validation failed - invalid rating:', rating);
            return res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
        }

        // Create feedback entry
        const feedbackEntry = {
            _id: Date.now().toString(),
            name: name.trim(),
            comment: comment.trim(),
            rating: parseInt(rating),
            image: image || 'https://via.placeholder.com/150',
            createdAt: new Date().toISOString(),
            isApproved: true
        };

        console.log('Reading existing feedback...');
        
        // Read existing feedback
        let feedback = [];
        try {
            const data = await fs.readFile(feedbackFilePath, 'utf8');
            feedback = JSON.parse(data);
        } catch (error) {
            console.log('No existing feedback file, creating new one');
            feedback = [];
        }

        // Add new feedback
        feedback.push(feedbackEntry);

        console.log('Saving feedback to file...');
        
        // Save to file
        await fs.writeFile(feedbackFilePath, JSON.stringify(feedback, null, 2));
        
        console.log('Feedback saved successfully:', feedbackEntry._id);

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: {
                _id: feedbackEntry._id,
                name: feedbackEntry.name,
                comment: feedbackEntry.comment,
                rating: feedbackEntry.rating,
                image: feedbackEntry.image,
                createdAt: feedbackEntry.createdAt
            }
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            message: 'Server error while submitting feedback',
            error: error.message
        });
    }
});

// @route   GET /api/feedback-file
// @desc    Get all approved feedback
// @access  Public
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(feedbackFilePath, 'utf8');
        const feedback = JSON.parse(data);
        
        // Filter approved feedback and reverse for latest first
        const approvedFeedback = feedback.filter(f => f.isApproved).reverse();
        
        res.json({
            feedback: approvedFeedback,
            total: approvedFeedback.length
        });

    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            message: 'Server error while fetching feedback',
            error: error.message
        });
    }
});

module.exports = router;
