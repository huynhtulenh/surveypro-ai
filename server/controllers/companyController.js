const Company = require('../models/Company');

// Get all companies (not deleted)
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().notDeleted().sort({ createdAt: -1 });
        res.json({ companies });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get single company
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).notDeleted();

        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        res.json({ company });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Create new company
exports.createCompany = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Tên công ty là bắt buộc' });
        }

        // Check if company name already exists
        const existingCompany = await Company.findOne({ name: name.trim() }).notDeleted();
        if (existingCompany) {
            return res.status(400).json({ error: 'Tên công ty đã tồn tại' });
        }

        const company = new Company({
            name: name.trim()
        });

        await company.save();

        res.status(201).json({
            message: 'Tạo công ty thành công',
            company
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).notDeleted();

        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        const { name } = req.body;

        if (name) {
            // Check if new name already exists (excluding current company)
            const existingCompany = await Company.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id }
            }).notDeleted();

            if (existingCompany) {
                return res.status(400).json({ error: 'Tên công ty đã tồn tại' });
            }

            company.name = name.trim();
        }

        await company.save();

        res.json({
            message: 'Cập nhật công ty thành công',
            company
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Soft delete company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).notDeleted();

        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        await company.softDelete();

        res.json({ message: 'Xóa công ty thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Get company statistics
exports.getCompanyStats = async (req, res) => {
    try {
        const Admin = require('../models/Admin');
        const Survey = require('../models/Survey');
        const Response = require('../models/Response');

        const company = await Company.findById(req.params.id).notDeleted();

        if (!company) {
            return res.status(404).json({ error: 'Không tìm thấy công ty' });
        }

        // First, get all admins for this company
        const admins = await Admin.find({ company: req.params.id, deletedAt: null }).select('_id');
        const adminIds = admins.map(admin => admin._id);

        // Count admins, surveys, and unique respondents for this company
        const [adminCount, surveyCount, surveys] = await Promise.all([
            Admin.countDocuments({ company: req.params.id, deletedAt: null }),
            Survey.countDocuments({ admin: { $in: adminIds }, deletedAt: null }),
            Survey.find({ admin: { $in: adminIds }, deletedAt: null }).select('_id')
        ]);

        // Get unique respondents count from all surveys of this company
        const surveyIds = surveys.map(survey => survey._id);
        const responses = await Response.distinct('respondent.email', {
            survey: { $in: surveyIds },
            'respondent.email': { $exists: true, $ne: null, $ne: '' }
        });
        const userCount = responses.length;

        res.json({
            company,
            stats: {
                admins: adminCount,
                users: userCount,
                surveys: surveyCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
