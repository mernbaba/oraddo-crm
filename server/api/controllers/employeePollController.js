const parseRequestFiles = require('../../fileUpload/requestedfile');
// const employeeExpensesService = require('../services/employeeExpeseService');
const employeePollService=require("../services/employeePollServices")
const createEmployeePoll = async (req, res) => {
  try {
    const employeePoll = await employeePollService.createEmployeePoll(req.body);
    res.status(201).json(employeePoll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployeePoll = async (req, res) => {
  try {
    const employeePoll = await employeePollService.getAllEmployeePoll();
    res.status(200).json(employeePoll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeePollById = async (req, res) => {
  try {
    const employeePoll = await employeePollService.getEmployeePollById(req.params.id);
    if (employeePoll) {
      res.status(200).json(employeePoll);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeePoll = async (req, res) => {
  try {
    const updatedemployeePoll = await employeePollService.updateEmployeePoll(req.params.id, req.body);
    if (updatedemployeePoll) {
      res.status(200).json(updatedemployeePoll);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployeePoll = async (req, res) => {
  try {
    const deleted = await employeePollService.deleteEmployeePoll(req.params.id);
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployeePoll,
  getAllEmployeePoll,
  getEmployeePollById,
  updateEmployeePoll,
  deleteEmployeePoll,
};
