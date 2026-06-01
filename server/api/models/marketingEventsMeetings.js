const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Organization = require("./OrganizationModule");


const MarketingEventsMeetings = sequelize.define('MarketingEventsMeetings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull:true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    occasion: {
      type: DataTypes.ENUM("Event", "Meeting","Compaign","Post"),
      allowNull: true,
    },
    Compaign_Type:{
        type:DataTypes.STRING,
        allowNull:true
    },
    post:{
        type:DataTypes.STRING,
        allowNull:true
    },
    organizationID:{
      type:DataTypes.INTEGER,
      allowNull:true
  }
  });

 module.exports = MarketingEventsMeetings;
  