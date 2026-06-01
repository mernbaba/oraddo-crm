const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Job_Creation = sequelize.define("Job_Creation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  job_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  no_of_applications: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  published_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Close", "Pause", "Active"),
    allowNull: true,
  },
  image_URL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  package: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  job_type: {
    type: DataTypes.ENUM("Work from Home", "Hybrid", "Work from Office"),
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Job_Creation;
