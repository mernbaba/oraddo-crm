
const EmployeeTasks = require('../models/employee_Task');

const createEmployeeTask = async (taskData) => {
  try {
    const employeeTask = await EmployeeTasks.create(taskData);
    return employeeTask;
  } catch (error) {
    throw new Error('Error creating employee task');
  }
};

const getAllEmployeeTasks = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const employeeTasks = await EmployeeTasks.findAll();
    return employeeTasks;
  } catch (error) {
    throw new Error('Error retrieving employee tasks');
  }
};

const getEmployeeTaskById = async (id) => {
  try {
    const employeeTask = await EmployeeTasks.findByPk(id);
    return employeeTask;
  } catch (error) {
    throw new Error('Error retrieving employee task by ID');
  }
};

const updateEmployeeTask = async (id, taskData) => {
  try {
    const [updated] = await EmployeeTasks.update(taskData, { where: { id } });
    if (updated) {
      const updatedEmployeeTask = await EmployeeTasks.findByPk(id);
      return updatedEmployeeTask;
    }
    throw new Error('Employee task not found');
  } catch (error) {
    throw new Error('Error updating employee task');
  }
};

const deleteEmployeeTask = async (id) => {
  try {
    const deleted = await EmployeeTasks.destroy({ where: { id } });
    return deleted;
  } catch (error) {
    throw new Error('Error deleting employee task');
  }
};

module.exports = {
  createEmployeeTask,
  getAllEmployeeTasks,
  getEmployeeTaskById,
  updateEmployeeTask,
  deleteEmployeeTask,
};