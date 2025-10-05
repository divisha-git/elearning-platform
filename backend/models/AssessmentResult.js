const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: String, required: true },
  assessmentTitle: { type: String },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  takenAt: { type: Date, default: Date.now },
  courseId: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);


