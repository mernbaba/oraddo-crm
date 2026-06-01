const parseRequestFiles = require('../../fileUpload/requestedfile');
const employeeSatisfactionSurveyService = require('../services/employeeSatcfactionSurveyServices');

const createEmployeeSurvey = async (req, res) => {
  try {
    const employeeSurvey = await employeeSatisfactionSurveyService.createEmployeeSurvey(req.body);
    res.status(201).json(employeeSurvey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployeeSurvey = async (req, res) => {
  try {
    const employeeSurvey = await employeeSatisfactionSurveyService.getAllEmployeeSurvey();
    res.status(200).json(employeeSurvey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeSurveyById = async (req, res) => {
  try {
    const employeeSurvey = await employeeSatisfactionSurveyService.getEmployeeSurveyById(req.params.id);
    if (employeeSurvey) {
      res.status(200).json(employeeSurvey);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeSurvey = async (req, res) => {
  try {
    const updatedEmployeeSurvey = await employeeSatisfactionSurveyService.updateEmployeeSurvey(req.params.id, req.body);
    if (updatedEmployeeSurvey) {
      res.status(200).json(updatedEmployeeSurvey);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployeeSurvey = async (req, res) => {
  try {
 await employeeSatisfactionSurveyService.deleteEmployeeSurvey(req.params.id);

      res.status(204).end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployeeSurvey,
  getAllEmployeeSurvey,
  getEmployeeSurveyById,
  updateEmployeeSurvey,
  deleteEmployeeSurvey,
};
