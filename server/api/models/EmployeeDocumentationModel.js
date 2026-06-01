const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const EmployeeLetter = sequelize.define("EmployeeLetter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emp_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mailId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  joining_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ctc: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  offer_amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  notice_period_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resignation_email_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  intern_working_from_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  intern_working_to_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  working_from_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  working_to_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_working_from_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_working_to_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  internship_position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  emp_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  HRA_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  Speciel_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  travel_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  DNS_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  medical_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  food_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  variable_allowances: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pf_employeer_contribution: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pf_emp_contribution: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  emp_ESI_contribution: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  need_salary_structure:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
});

module.exports = EmployeeLetter;
