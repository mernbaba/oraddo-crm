const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Emp_onboarding = require("../models/Emp_onboarding");
const GroupChat = require("./GroupModel");

const GroupMessage = sequelize.define(
  "GroupMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: GroupChat, key: "id" },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Emp_onboarding, key: "id" },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    other_documents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeletedForEveryone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    replyToMessageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "GroupMessages", key: "id" },
    },
    replyType: {
      type: DataTypes.ENUM("group", "private", "personal"),
      allowNull: true,
    },
    replyContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Associations
GroupMessage.belongsTo(GroupChat, { foreignKey: "groupId", as: "group" });
GroupMessage.belongsTo(GroupMessage, {
  foreignKey: "replyToMessageId",
  as: "replyTo",
  constraints: false, // To avoid circular dependency issues on creation
});


module.exports = GroupMessage;
