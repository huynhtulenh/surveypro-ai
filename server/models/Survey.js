const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'closed'],
        default: 'active'
    },
    // Settings
    settings: {
        allowAnonymous: {
            type: Boolean,
            default: true
        },
        multipleResponses: {
            type: Boolean,
            default: false
        },
        showResults: {
            type: Boolean,
            default: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

// Pre-save middleware
surveySchema.pre('save', function () {
    this.updatedAt = Date.now();
});

// Soft delete method
surveySchema.methods.softDelete = function () {
    this.deletedAt = Date.now();
    return this.save();
};

// Query helper
surveySchema.query.notDeleted = function () {
    return this.where({ deletedAt: null });
};

// Index for faster queries
surveySchema.index({ admin: 1, status: 1 });
surveySchema.index({ status: 1, deletedAt: 1 });

module.exports = mongoose.model('Survey', surveySchema);
