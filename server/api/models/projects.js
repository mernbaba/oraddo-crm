const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Projects = sequelize.define("Projects", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {         
    type: DataTypes.STRING,
    allowNull: false,
  },
  company_website: {         
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lead_count: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // no_of_employees: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  createdAt:{
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt:{
    type: DataTypes.DATE,
    allowNull: true,
  },
 
  // employeeProjectId:{
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  Criteria:{
    type:DataTypes.STRING,
    allowNull:true
  },
  total_leads:{
    type:DataTypes.STRING,
    allowNull:true
  },
  duration:{
    type:DataTypes.STRING,
    allowNull:true
  },
  teamLead:{
    type:DataTypes.STRING,
    allowNull:true
  },
  management:{
    type:DataTypes.STRING,
    allowNull:true
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true
  }
});

module.exports = Projects;