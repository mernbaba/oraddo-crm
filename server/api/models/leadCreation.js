const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const LeadCreation = sequelize.define("LeadCreations", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company_website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company_linkedIn_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  no_ofEmployees: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  person_linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  address_line: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  area_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sub_industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SIC_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  NAIC_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revenue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_count: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtube_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebook_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Request: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Intro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Remainder: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Follow_Up: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Job_Title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Job_Link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationID:{
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = LeadCreation;
