const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Employee_Poll = sequelize.define("Employee_Poll", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
 department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poll_1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poll_2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poll_3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poll_4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poll_5: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poll_6: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
});

module.exports = Employee_Poll;
