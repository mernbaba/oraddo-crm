const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Employee_Tasks = sequelize.define("employee_Tasks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pending: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inprogres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employeeid:{
    type: DataTypes.INTEGER,
    allowNull:true,
  }
}); 

module.exports = Employee_Tasks;