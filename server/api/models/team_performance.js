const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const team_perfomance = sequelize.define("team_perfomance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  behaviour: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  work_perfomance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  team_performance1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  team_performance2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = team_perfomance;
