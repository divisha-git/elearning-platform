const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150',
        validate: {
            validator: function(v) {
                // Basic URL validation
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid image URL'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous feedback
    },
    isApproved: {
        type: Boolean,
        default: true // Auto-approve for now, can be changed later
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
