const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ContactDetails = sequelize.define("ContactDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CompanyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Converted", "Dead", "Processing"),
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high", "urgent"),
    allowNull: true,
    defaultValue: "medium",
  },
  category: {
    type: DataTypes.ENUM("technical", "billing", "feature-request", "general"),
    allowNull: true,
    defaultValue: "general",
  },
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = ContactDetails;
