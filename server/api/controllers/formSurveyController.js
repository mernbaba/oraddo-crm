const surveyService = require('../services/formSurveyService');

// Controller to create a new survey
const createSurvey = async (req, res) => {
  try {
    const payload = req.body;
    console.log('mmmmmmmmm',payload);
    
    const survey = await surveyService.createSurvey(payload);
    res.status(201).json({ survey });
  } catch (error) {
    res.status(500).json({ error: 'Error creating survey. Please try again.' });
  }
};

// Controller to add questions to a survey
const addQuestions = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { questions } = req.body;
    const response = await surveyService.addQuestions(surveyId, questions);
    res.status(201).json({ message: 'Questions added successfully.', data: response });
  } catch (error) {
    res.status(500).json({ error: 'Error adding questions. Please try again.' });
  }
};

// Controller to get All survey details
const getAllSurveyDetails = async (req, res) => {
  try {
    const survey = await surveyService.getAllSurveyDetails();
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found.' });
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching survey details. Please try again.' });
  }
};

// Controller to get survey details
const getSurveyDetails = async (req, res) => {
  try {
    const  {surveyId}  = req.params;
    console.log("surveyId",surveyId)
    const survey = await surveyService.getSurveyDetails(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found.' });
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching survey aaaa details. Please try again.' });
  }
};

// Controller to submit survey responses
const submitResponses = async (req, res) => {
  try {
    const { surveyId } = req.params;
    console.log("ygyfy",surveyId);
    
    const { user_id, responses } = req.body;
    console.log(responses,"jhegedgs")
    const response = await surveyService.submitResponses(surveyId, user_id, responses);
    res.status(201).json({ message: 'Responses submitted successfully.', data : response});
  } catch (error) {
    res.status(500).json({ error: 'Error submitting responses. Please try again.' });
  }
};

// Controller to get all responses for a survey
const getSurveyResponses = async (req, res) => {
  try {
    const { surveyId } = req.params;
    console.log("responsedhbhsgjbed", )
    const responses = await surveyService.getSurveyResponses(surveyId);
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching survey responses. Please try again.' });
  }
};

const getAllResponses = async (req, res) => {
  try {
    // const { surveyId } = req.params;
    console.log("allllllllllllllllllll", )
    const responses = await surveyService.getAllResponses();
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all responses. Please try again.' });
  }
};

module.exports = {
  createSurvey,
  addQuestions,
  getSurveyDetails,
  submitResponses,
  getAllSurveyDetails,
  getSurveyResponses,
  getAllResponses
};
