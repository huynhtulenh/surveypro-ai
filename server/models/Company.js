const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
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

// Pre-save middleware to update updatedAt
companySchema.pre('save', function () {
    this.updatedAt = Date.now();
});

// Soft delete method
companySchema.methods.softDelete = function () {
    this.deletedAt = Date.now();
    return this.save();
};

// Query helper to exclude soft deleted
companySchema.query.notDeleted = function () {
    return this.where({ deletedAt: null });
};

module.exports = mongoose.model('Company', companySchema);
