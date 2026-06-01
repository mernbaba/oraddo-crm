const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Inbound_Leads = sequelize.define("Inbound_Leads", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prospect_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  services: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source_lead: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "InProgress", "Approve", "Declaine"),
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  website_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
module.exports = Inbound_Leads;
