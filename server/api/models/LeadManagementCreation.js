const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ManagementCreation = sequelize.define("ManagementCreation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  client_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tenure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  service_modules: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true,
  }
});

module.exports = ManagementCreation;
