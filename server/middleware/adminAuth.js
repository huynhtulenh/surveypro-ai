const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Không có token xác thực' });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.adminId = decoded.adminId;
        req.companyId = decoded.companyId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};
