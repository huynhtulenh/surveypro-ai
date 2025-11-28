const Admin = require('../models/Admin');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Register new admin
exports.register = async (req, res) => {
    try {
        const { email, password, phone, companyId } = req.body;

        // Validate required fields
        if (!email || !password || !companyId) {
            return res.status(400).json({ error: 'Email, mật khẩu và công ty là bắt buộc' });
        }

        // Check if company exists
        const company = await Company.findById(companyId).notDeleted();
        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email }).notDeleted();
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }

        // Create new admin
        const admin = new Admin({
            company: companyId,
            email,
            password,
            phone
        });

        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, companyId: admin.company },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Đăng ký admin thành công',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                phone: admin.phone,
                company: admin.company
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
        }

        // Find admin (not deleted)
        const admin = await Admin.findOne({ email }).notDeleted().populate('company');

        if (!admin) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        // Check if company is deleted
        if (admin.company.deletedAt) {
            return res.status(403).json({ error: 'Công ty đã bị xóa' });
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, companyId: admin.company._id },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                phone: admin.phone,
                company: {
                    id: admin.company._id,
                    name: admin.company.name
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get current admin
exports.getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId)
            .notDeleted()
            .populate('company')
            .select('-password');

        if (!admin) {
            return res.status(404).json({ error: 'Không tìm thấy admin' });
        }

        res.json({ admin });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get all admins of a company
exports.getCompanyAdmins = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Verify company exists
        const company = await Company.findById(companyId).notDeleted();
        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        const admins = await Admin.find({ company: companyId })
            .notDeleted()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ admins });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).notDeleted();

        if (!admin) {
            return res.status(404).json({ error: 'Không tìm thấy admin' });
        }

        const { email, phone, password } = req.body;

        if (email && email !== admin.email) {
            // Check if new email already exists
            const existingAdmin = await Admin.findOne({
                email,
                _id: { $ne: req.params.id }
            }).notDeleted();

            if (existingAdmin) {
                return res.status(400).json({ error: 'Email đã được sử dụng' });
            }

            admin.email = email;
        }

        if (phone !== undefined) admin.phone = phone;
        if (password) admin.password = password; // Will be hashed by pre-save hook

        await admin.save();

        res.json({
            message: 'Cập nhật admin thành công',
            admin: {
                id: admin._id,
                email: admin.email,
                phone: admin.phone,
                company: admin.company
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Soft delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).notDeleted();

        if (!admin) {
            return res.status(404).json({ error: 'Không tìm thấy admin' });
        }

        await admin.softDelete();

        res.json({ message: 'Xóa admin thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
