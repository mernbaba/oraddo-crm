const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RevenueCreation = sequelize.define("RevenueCreation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentDetails: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  debit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  credit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total_calculation: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_credit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_debit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = RevenueCreation;
