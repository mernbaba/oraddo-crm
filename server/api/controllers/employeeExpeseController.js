const parseRequestFiles = require('../../fileUpload/requestedfile');
const employeeExpensesService = require('../services/employeeExpeseService');

const createEmployeeExpense = async (req, res) => {
  console.log(req.body, 'hiiii');

  try {
    // here sending the documents(reciepts) 
    // const payload = await parseRequestFiles(req);
    // req.body = {};
    // for (const [key, value] of Object.entries(payload.fields)) {
    //   req.body[key] = value[0]; // Assuming single value per key
    // }
    // req.files = payload.files;
    // const { body, files } = req;
    console.log("reqqhhhqqq", req.body);

    const payload = req.body;
    console.log("bodyyyyydddyy", payload);
    const employeeExpense = await employeeExpensesService.createEmployeeExpense(payload);
    res.status(201).json(employeeExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployeeExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const employeeExpenses = await employeeExpensesService.getAllEmployeeExpenses();
    console.log(employeeExpenses, 'empllll');

    res.status(200).json(employeeExpenses);
  } catch (error) {
    console.log(error, "njkhjk");

    res.status(500).json({ message: error.message });
  }
};

const getEmployeeExpensesByOrganizationId = async (req, res) => {
  const id = req.params.id
  const { page = 0, pageSize = 10, search = "" } = req.query
  const pageInt = parseInt(page, 10)
  const pageSizeInt = parseInt(pageSize, 10)

  try {
    const employeeExpenses = await employeeExpensesService.getEmployeeExpensesByOrganizationId(id, pageInt, pageSizeInt, search);
    res.status(200).json(employeeExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



const getEmployeeExpenseById = async (req, res) => {
  try {
    const id = req.params.id
    const { page = 0, pageSize = 10, search = "" } = req.query
    const pageInt = parseInt(page, 10)
    const pageSizeInt = parseInt(pageSize, 10)

    const employeeExpense = await employeeExpensesService.getEmployeeExpenseById(id,pageInt,pageSizeInt,search);
    if (employeeExpense) {
      res.status(200).json(employeeExpense);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeExpense = async (req, res) => {
  try {
    const updatedEmployeeExpense = await employeeExpensesService.updateEmployeeExpense(req.params.id, req.body);
    if (updatedEmployeeExpense) {
      res.status(200).json(updatedEmployeeExpense);
    } else {
      res.status(404).json({ message: 'Employee expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployeeExpense = async (req, res) => {
  try {
    const deleted = await employeeExpensesService.deleteEmployeeExpense(req.params.id);
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
  createEmployeeExpense,
  getAllEmployeeExpenses,
  getEmployeeExpensesByOrganizationId,
  getEmployeeExpenseById,
  updateEmployeeExpense,
  deleteEmployeeExpense,
};