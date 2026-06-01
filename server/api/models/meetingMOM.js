const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const meetingMOM = sequelize.define("meetingMOM", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attendees:{
    type:DataTypes.STRING,
    allowNull:false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  meeting_notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration_to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = meetingMOM;
