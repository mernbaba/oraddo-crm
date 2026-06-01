const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmployeeDocument = sequelize.define('employee_documents', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  moduleName: {
    type: DataTypes.ENUM('Module1','Module2','Module3'),
    allowNull: false,
  },
  date_Of_Purchesing: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plan_mode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purchasing_mode:{
    type: DataTypes.ENUM('One Time','Renew'),
    allowNull: false
  },
  payment_mode:{
    type: DataTypes.ENUM('Credit Card','Debit Card', "Net Banking", "UPI", "Wallets (e.g., Paytm, Google Pay, PhonePe)",'Bank Transfer (NEFT/RTGS/IMPS)', 'Cash', 'Cheque','EMI through Bank','Direct Debit (Auto Debit from Bank Account)'),
    allowNull: false
  },
  status:{
    type: DataTypes.ENUM('Pending','Approved')
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

});

module.exports = EmployeeDocument;
