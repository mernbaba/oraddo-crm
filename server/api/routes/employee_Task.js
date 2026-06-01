const express = require('express');
const router = express.Router();
const employeeTasksController = require('../controllers/employee_TaskController');
const { Middleware } = require('../middleware/authMiddleware');

// Create a new employee task
router.post('/employeeTasks', employeeTasksController.createEmployeeTask);

// Get all employee tasks
router.get('/employeeTasks', employeeTasksController.getAllEmployeeTasks);

// Get a specific employee task by ID
router.get('/employeeTasks/:id', employeeTasksController.getEmployeeTaskById);

// Update an employee task by ID
router.put('/employeeTasks/:id',employeeTasksController.updateEmployeeTask);

// Delete an employee task by ID
router.delete('/employeeTasks/:id', employeeTasksController.deleteEmployeeTask);

module.exports = router;

