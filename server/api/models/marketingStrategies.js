const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const MarketingStrategies = sequelize.define("MarketingStrategies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  explanation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  work_progress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  task_assignment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  strategy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationID:{
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = MarketingStrategies;
