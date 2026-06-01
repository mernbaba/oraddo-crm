

const employeeTasksService = require('../services/employee_Task');

const createEmployeeTask = async (req, res) => {
  try {
    const employeeTask = await employeeTasksService.createEmployeeTask(req.body);
    res.status(201).json(employeeTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEmployeeTasks = async (req, res) => {
  try {
    // const page = parseInt(req.query.page);
    // const limit = parseInt(req.query.limit);
    const employeeTasks = await employeeTasksService.getAllEmployeeTasks();
    res.status(200).json(employeeTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeTaskById = async (req, res) => {
  try {
    const employeeTask = await employeeTasksService.getEmployeeTaskById(req.params.id);
    if (employeeTask) {
      res.status(200).json(employeeTask);
    } else {
      res.status(404).json({ message: 'Employee task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployeeTask = async (req, res) => {
  try {
    const employeeTask = await employeeTasksService.updateEmployeeTask(req.params.id, req.body);
    if (employeeTask) {
      res.status(200).json(employeeTask);
    } else {
      res.status(404).json({ message: 'Employee task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployeeTask = async (req, res) => {
  try {
    const deleted = await employeeTasksService.deleteEmployeeTask(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Employee task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployeeTask,
  getAllEmployeeTasks,
  getEmployeeTaskById,
  updateEmployeeTask,
  deleteEmployeeTask,
};