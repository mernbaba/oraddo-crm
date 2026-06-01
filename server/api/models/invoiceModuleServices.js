const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const invoiveModuleService = sequelize.define("invoiceModuleServices", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  services: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  base: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  InvoiceId:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  invoiceType:{
    type: DataTypes.STRING,
    allowNull:true,
  }
});

module.exports = invoiveModuleService;
