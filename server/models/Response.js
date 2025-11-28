const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
        index: true
    },
    // Respondent info (optional)
    respondent: {
        email: String,
        name: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    // Answers array
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        // For text, date questions
        textAnswer: String,
        // For radio questions (single answer ID)
        selectedAnswer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        },
        // For checkbox questions (multiple answer IDs)
        selectedAnswers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        // For table questions
        tableAnswers: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }],
    // Metadata
    ipAddress: String,
    userAgent: String,
    completedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
responseSchema.index({ survey: 1, createdAt: -1 });
responseSchema.index({ 'respondent.email': 1 });

module.exports = mongoose.model('Response', responseSchema);
