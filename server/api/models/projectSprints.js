const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Sprints = sequelize.define("Sprints", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration_to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // empOnboardingId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  status: {
    type: DataTypes.ENUM("Pending", "On Going", "Next Sprint"),
    allowNull: false,
  },
});

module.exports = Sprints;
