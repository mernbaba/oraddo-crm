const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// A single message in a support ticket's conversation thread.
// `sender` is either "user" (the employee who raised the ticket) or
// "support" (the support team). `attachments` holds a JSON-encoded array of
// file references; stored as TEXT so it works on any dialect.
const SupportMessage = sequelize.define(
  "support_messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "user",
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SupportMessage;
