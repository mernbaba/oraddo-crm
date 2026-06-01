const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const testCandidate = sequelize.define("CandidateDetails", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidate_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  college_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  job_type: {
    type: DataTypes.ENUM("Technical", "NonTechnical"),
    allowNull: true,
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Qualified", "DisQualified"),
    allowNull: true,
  },
  taskId:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  tabSwitchCount:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  taskLink:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  techround: {
    type: DataTypes.ENUM("Pending", "Qualified","DisQualified"),
    allowNull: true,
  },
  finalround: {
    type: DataTypes.ENUM("Pending", "Qualified","DisQualified"),
    allowNull: true,
  },
  GD_batch: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = testCandidate;
