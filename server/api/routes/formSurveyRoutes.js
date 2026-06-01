const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/formSurveyController');

// Routes
router.post('/surveys/create', surveyController.createSurvey);
router.post('/surveys/:surveyId/questions', surveyController.addQuestions);
router.get('/surveys/:surveyId', surveyController.getSurveyDetails);
router.get('/surveys', surveyController.getAllSurveyDetails);
router.post('/surveys/:surveyId/submit', surveyController.submitResponses);
router.get('/:surveyId/responses', surveyController.getSurveyResponses);
router.get('/surveyssssssssss/responsessssssss', surveyController.getAllResponses);

module.exports = router;
