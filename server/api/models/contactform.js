const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ContactDetails = sequelize.define("ContactDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Ensures uniqueness and non-null
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
    allowNull: true,
      },
});

module.exports = ContactDetails;
