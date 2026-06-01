const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const Training_Management = sequelize.define("Training_Management", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    work_progress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    explaination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   requirements: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_assignment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      
  });
  
  module.exports = Training_Management;
  