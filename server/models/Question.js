const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['text', 'radio', 'checkbox', 'date', 'table-single', 'table-multiple'],
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    required: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    // For table questions
    tableConfig: {
        rows: [String],
        columns: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware
questionSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

// Index for faster queries
questionSchema.index({ survey: 1, order: 1 });

module.exports = mongoose.model('Question', questionSchema);
