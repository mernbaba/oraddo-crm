const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ProjectDetails = sequelize.define("ProjectDetails", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description:{
    type: DataTypes.STRING,
    allowNull:true
  },
  segment:{
    type: DataTypes.STRING,
    allowNull:true
  },
  duration_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration_to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = ProjectDetails;
