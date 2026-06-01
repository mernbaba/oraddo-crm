const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Gratuity_Settlement = sequelize.define("Gratuity_Settlement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // employe[e_name: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // employee_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // department:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // date_of_joining: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // last_working_date: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // salary_payslip: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // basic_salary: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // designation: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // personal_mobile_number: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // team_lead: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  total_years_worked: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_leaves_taken: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //  employee_onboarding_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  gratuity_calculation_year:{
    type:DataTypes.STRING,
    allowNull:false
  },
  gratuity_payment:{
    type:DataTypes.STRING,
    allowNull:false
  },
  gratuity_status:{
    type: DataTypes.ENUM('Approved', 'Declined'),
    allowNull:false
  },
  comments:{
    type:DataTypes.STRING,
    allowNull:true
  },
  leave_balance:{
    type:DataTypes.STRING,
    allowNull:false
  },
  
  // pf_account_number:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // last_salary_amount:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // gratuity_payment:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // pf_amount:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  leave_balance_amount:{
    type:DataTypes.STRING,
    allowNull:true
  },
  incentives_bonus:{
    type:DataTypes.STRING,
    allowNull:true
  },
  total_amount:{
    type:DataTypes.STRING,
    allowNull:true
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true
  },
});

module.exports = Gratuity_Settlement;
