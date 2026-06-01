const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const empRoles = sequelize.define("empRoles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = empRoles;
