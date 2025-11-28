const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const adminAuth = require('../middleware/adminAuth');

// Protected routes - require admin authentication
router.get('/', adminAuth, surveyController.getAllSurveys);
router.get('/:id', adminAuth, surveyController.getSurvey);
router.post('/', adminAuth, surveyController.createSurvey);
router.put('/:id', adminAuth, surveyController.updateSurvey);
router.delete('/:id', adminAuth, surveyController.deleteSurvey);

// Public route - for respondents
router.get('/public/:id', surveyController.getPublicSurvey);

module.exports = router;
