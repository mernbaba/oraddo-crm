const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Emp_Satisfation_Servey= sequelize.define("Emp_Satisfaction_Survey", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date:{
type:DataTypes.DATE,
allowNull:false
  },
  employee_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department:{
    type:DataTypes.STRING,
    allowNull:false
  },
  survey_question1:{
    type:DataTypes.STRING,
    allowNull:false
  },
  survey_question2:{
    type:DataTypes.STRING,
    allowNull:true
  },
  survey_question3:{
    type:DataTypes.STRING,
    allowNull:true
  },
  survey_question4:{
    type:DataTypes.STRING,
    allowNull:true
  },
  survey_question5:{
    type:DataTypes.STRING,
    allowNull:true
  },
  survey_question6:{
    type:DataTypes.STRING,
    allowNull:true
  },
});

module.exports = Emp_Satisfation_Servey;
