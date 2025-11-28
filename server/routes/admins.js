const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public routes - authentication
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected routes - require admin authentication
router.get('/me', adminAuth, adminController.getCurrentAdmin);
router.get('/company/:companyId', adminAuth, adminController.getCompanyAdmins);
router.put('/:id', adminAuth, adminController.updateAdmin);
router.delete('/:id', adminAuth, adminController.deleteAdmin);

module.exports = router;
