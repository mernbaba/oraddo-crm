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
  // Optional display line for the pricing block (e.g. "+ GST" or a fully
  // custom sentence). When empty, the preview generates a default sentence
  // from `pricing` + `currency`.
  pricing_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timeline: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Each entry is a section of the proposal:
  //   { title: string, content: string /* markdown */ }
  service: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  // The raw prompt used to (dummy) generate this proposal, kept for re-runs.
  ai_prompt: {
    type: DataTypes.TEXT,
    allowNull: true,
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
