const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Praposal = sequelize.define("Praposal", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approval", "Declined"),
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pricing: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timeline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  service: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  timeline_table: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  resource_table: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  togetstarted: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  currency:{
    type:DataTypes.ENUM("INR","USD","AUD","CAD"),
    allowNull:true,
  }
});

module.exports = Praposal;
