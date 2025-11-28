const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const adminAuth = require('../middleware/adminAuth');

// Public routes (if needed)
// router.get('/public', companyController.getPublicCompanies);

// Public routes - for registration flow
router.get('/', companyController.getAllCompanies);
router.post('/', companyController.createCompany);

// Protected routes - require admin authentication
router.get('/:id', adminAuth, companyController.getCompany);
router.get('/:id/stats', adminAuth, companyController.getCompanyStats);
router.put('/:id', adminAuth, companyController.updateCompany);
router.delete('/:id', adminAuth, companyController.deleteCompany);

module.exports = router;
