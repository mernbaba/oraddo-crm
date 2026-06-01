const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmployeeDocument = sequelize.define('employee_documents', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  form_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expensesId:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  employeeid:{
    type: DataTypes.INTEGER,
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
  }
});

module.exports = EmployeeDocument;
