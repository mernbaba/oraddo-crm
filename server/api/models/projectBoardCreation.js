const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ProjectBoard = sequelize.define("ProjectBoard", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  segment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  segment_duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    team_lead: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  document_url:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  from_date:{
    type:DataTypes.DATE,
    allowNull:false
  },
  to_date:{
    type:DataTypes.DATE,
    allowNull:false
  },
  team_Assigned:{
    type:DataTypes.STRING,
    allowNull:true
  },
  isHold:{
    type:DataTypes.BOOLEAN,
    allowNull:true
  },
  organizationID:{
    type: DataTypes.INTEGER,
    allowNull:true,
  },
  isComplete:{
    type: DataTypes.BOOLEAN,
    allowNull:true
  },
  // Completed-project metadata surfaced on the employee "Completed Projects" page.
  client:{
    type: DataTypes.STRING,
    allowNull:true
  },
  budget:{
    type: DataTypes.STRING,
    allowNull:true
  },
  rating:{
    type: DataTypes.FLOAT,
    allowNull:true
  },
  deliverables:{
    type: DataTypes.INTEGER,
    allowNull:true
  },
  team_size:{
    type: DataTypes.INTEGER,
    allowNull:true
  }
});



module.exports = ProjectBoard;
