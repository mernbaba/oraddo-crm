const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Emp_onboarding = require("./Emp_onboarding");

const GroupChat = sequelize.define(
  "GroupChat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Emp_onboarding,
        key: 'id',
      }
    },
    image_URL:{
      type: DataTypes.STRING,
      allowNull:true,
    },
    organizationID:{
      type: DataTypes.STRING,
      allowNull:true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = GroupChat;
