const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public (no authentication required)
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

        console.log('Creating feedback entry...');
        
        // Create feedback
        const feedback = new Feedback({
            name: name.trim(),
            comment: comment.trim(),
            rating: parseInt(rating),
            image: image || 'https://via.placeholder.com/150'
        });

        console.log('Saving feedback to database...');
        const savedFeedback = await feedback.save();
        console.log('Feedback saved successfully:', savedFeedback._id);

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: {
                _id: savedFeedback._id,
                name: savedFeedback.name,
                comment: savedFeedback.comment,
                rating: savedFeedback.rating,
                image: savedFeedback.image,
                createdAt: savedFeedback.createdAt
            }
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({
            message: 'Server error while submitting feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/feedback
// @desc    Get all approved feedback
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const feedback = await Feedback.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Feedback.countDocuments({ isApproved: true });

        res.json({
            feedback,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            message: 'Server error while fetching feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin only for now)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        await Feedback.findByIdAndDelete(req.params.id);

        res.json({ message: 'Feedback deleted successfully' });

    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            message: 'Server error while deleting feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/feedback/:id/approve
// @desc    Approve/disapprove feedback (admin only)
// @access  Private
router.put('/:id/approve', auth, async (req, res) => {
    try {
        const { isApproved } = req.body;
        
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { isApproved: Boolean(isApproved) },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json({
            message: `Feedback ${isApproved ? 'approved' : 'disapproved'} successfully`,
            feedback
        });

    } catch (error) {
        console.error('Approve feedback error:', error);
        res.status(500).json({
            message: 'Server error while updating feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
