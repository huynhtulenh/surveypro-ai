const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const adminAuth = require('../middleware/adminAuth');

// Public route - submit response
router.post('/survey/:surveyId', responseController.submitResponse);

// Protected routes - require admin authentication
router.get('/survey/:surveyId', adminAuth, responseController.getSurveyResponses);
router.get('/survey/:surveyId/analytics', adminAuth, responseController.getSurveyAnalytics);
router.get('/survey/:surveyId/export', adminAuth, responseController.exportResponses);

module.exports = router;
