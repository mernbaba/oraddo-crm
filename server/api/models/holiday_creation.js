const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const holiday_creation = sequelize.define("Holiday_Creation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  occation:{
    type: DataTypes.STRING,
    allowNull: false
  },
  organizationId:{
    type: DataTypes.INTEGER,
    allowNull:true
  }
});

module.exports = holiday_creation;
