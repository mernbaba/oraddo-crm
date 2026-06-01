const express = require('express');
const router = express.Router();
const employeeExpensesController = require('../controllers/employeeExpeseController');
const { Middleware } = require('../middleware/authMiddleware');


router.post('/employee-expenses', employeeExpensesController.createEmployeeExpense);
router.get('/employee-expenses', employeeExpensesController.getAllEmployeeExpenses);
router.get('/employeeExpensesOrganizationId/:id',employeeExpensesController.getEmployeeExpensesByOrganizationId)
router.get('/employee-expenses/:id', employeeExpensesController.getEmployeeExpenseById);
router.put('/employee-expenses/:id', employeeExpensesController.updateEmployeeExpense);
router.delete('/employee-expenses/:id', employeeExpensesController.deleteEmployeeExpense);

module.exports = router;
