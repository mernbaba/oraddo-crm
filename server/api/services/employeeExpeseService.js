const ALLOWED_EMP_DOC_TYPES = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const EmployeeExpenses = require('../models/employeeExpenses');
const Emp_onboarding = require("../models/Emp_onboarding")
const Employee_documents = require("../models/empDocuments");
const Organization = require('../models/OrganizationModule');
const { Op } = require('sequelize');

const uploadFiles = async (files) => {
  const uploadPromises = files.map(file =>
    uploadFile(file, ALLOWED_EMP_DOC_TYPES)
  );
  try {
    const results = await Promise.all(uploadPromises);
    const uploadedData = {
      receipt: results[0].success ? results[0].url : null,
    }
    return uploadedData;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
}


const createEmployeeExpense = async (expenseData) => {
  console.log(expenseData, "files form post")
  try {
    // const uploadData = await uploadFiles([
    //     files.receipt[0]
    //   ])
    //   expenseData.receipt = uploadData.receipt;

    //   console.log("expense part2");

    const employeeExpense = await EmployeeExpenses.create(expenseData);
    return employeeExpense;
  } catch (error) {
    throw new Error('Error creating employee expense');
  }
};

const getAllEmployeeExpenses = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const employeeExpenses = await EmployeeExpenses.findAll({
      // limit,
      // offset,
      include: [{
        model: Emp_onboarding,
        as: "employee"
      },
      {
        model: Employee_documents,
        as: "expensesdocuments"
      }
      ]
    });
    return employeeExpenses;
  } catch (error) {
    throw new Error('Error retrieving employee expenses');
  }
};


const getEmployeeExpensesByOrganizationId = async (organizationID, page, pageSize, search) => {
  try {
    const offset = page * pageSize

    let whereEMPCondition = {}; // Ensure this is always an object
    if (search) {
      whereEMPCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    const totalExpenses = await EmployeeExpenses.count({
      where: { organizationID: organizationID },
      include: [{
        model: Emp_onboarding,
        as: "employee",
        where: whereEMPCondition
      }
      ]
    });

    console.log(totalExpenses, "orgId")
    const employeeExpenses = await EmployeeExpenses.findAll({
      where: { organizationID: organizationID },
      offset: offset,
      limit: pageSize,
      include: [{
        model: Emp_onboarding,
        as: "employee",
        where: whereEMPCondition
      },
      {
        model: Employee_documents,
        as: "expensesdocuments"
      }
      ]
    });
    console.log(organizationID, "idddd")
    return { employeeExpenses, totalCount: totalExpenses };
  } catch (error) {
    throw new Error('Error retrieving employee expenses by organization ID');
  }
};



const getEmployeeExpenseById = async (id, page, pageSize, search) => {
  console.log(id, "from employeeid")
  try {

    const offset = page * pageSize
    let whereEMPCondition = {}; // Ensure this is always an object
    if (search) {
      whereEMPCondition.expenseTitle = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }
    const employeeExpenseCount = await Emp_onboarding.count({
      where: { id: id },
      include: [{
        model: EmployeeExpenses,
        as: "employeeExpenses",
        where: whereEMPCondition
      }],
    });

    const employeeExpense = await Emp_onboarding.findByPk(id,
      {
        include: [{
          model: EmployeeExpenses,
          as: "employeeExpenses",
          offset: offset,
          limit: pageSize,
          where: whereEMPCondition,
          include: [
            {
              model: Employee_documents,
              as: "expensesdocuments"
            }
          ]
        }],
      });
    return { employeeExpense, totalCount: employeeExpenseCount }
  } catch (error) {
    throw new Error('Error retrieving employee expense by ID');
  }
};

const updateEmployeeExpense = async (id, expenseData) => {
  try {
    const [updated] = await EmployeeExpenses.update(expenseData, { where: { id } });
    if (updated) {
      const updatedEmployeeExpense = await EmployeeExpenses.findByPk(id);
      return updatedEmployeeExpense;
    }
    throw new Error('Employee expense not found');
  } catch (error) {
    throw new Error('Error updating employee expense');
  }
};

const deleteEmployeeExpense = async (id) => {
  try {
    const deleted = await EmployeeExpenses.destroy({ where: { id } });
    return deleted;
  } catch (error) {
    throw new Error('Error deleting employee expense');
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