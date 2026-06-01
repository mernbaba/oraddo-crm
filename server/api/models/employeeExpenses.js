const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmployeeExpenses = sequelize.define('employee_expenses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expenseTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  receipt: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status:{
    type:DataTypes.ENUM("Pending","Approved","Declined"),
    allowNull:true
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }

});

module.exports = EmployeeExpenses;
