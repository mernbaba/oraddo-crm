const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const InvoiceManagement = sequelize.define("InvoiceManagement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // invoice: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  billTo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  invoiceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  base: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  amount: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Decline"),
    allowNull: false,
  },
  GST: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Total: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalPrize: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  services: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
} ,
invoiceType:{
  type: DataTypes.STRING,
  allowNull:true,
}
});

module.exports = InvoiceManagement;
