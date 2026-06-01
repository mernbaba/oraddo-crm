const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const GroupMessage = require("../models/GroupMessages");
const Emp_onboarding = require("../models/Emp_onboarding");

const GroupMessageVisibility = sequelize.define(
  "GroupMessageVisibility",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: GroupMessage, key: "id" },
      onDelete: "CASCADE",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Emp_onboarding, key: "id" },
      onDelete: "CASCADE",
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  { timestamps: true }
);

// Associations
GroupMessageVisibility.belongsTo(GroupMessage, { foreignKey: "messageId" });
GroupMessageVisibility.belongsTo(Emp_onboarding, { foreignKey: "userId" });

module.exports = GroupMessageVisibility;
