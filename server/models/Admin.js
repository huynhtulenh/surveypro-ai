const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        maxlength: 100
    },
    phone: {
        type: String,
        maxlength: 20,
        default: null
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

// Pre-save middleware to hash password and update timestamp
adminSchema.pre('save', async function () {
    this.updatedAt = Date.now();

    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Soft delete method
adminSchema.methods.softDelete = function () {
    this.deletedAt = Date.now();
    return this.save();
};

// Query helper to exclude soft deleted
adminSchema.query.notDeleted = function () {
    return this.where({ deletedAt: null });
};

module.exports = mongoose.model('Admin', adminSchema);
