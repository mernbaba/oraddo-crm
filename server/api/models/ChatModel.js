// models/ChatModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const GroupMessage = require("./GroupMessages");
const Emp_onboarding = require("../models/Emp_onboarding");

const Message = sequelize.define(
  "MessageTables",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
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
      // Can't reference `Message` here (it's not yet initialized). Use the
      // actual table name 'MessageTables' so ALTER/CREATE will reference the
      // correct relation.
      references: { model: 'MessageTables', key: 'id' },
    },
    replyToGroupMessageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // reference to GroupMessages table id (no model cross-ref here)
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
  {
    timestamps: true,
  }
);

// Junction table to track "Delete for Me" per user
const MessageVisibility = sequelize.define(
  "MessageVisibility",
  {
    messageId: {
      type: DataTypes.INTEGER,
      references: { model: Message, key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: Emp_onboarding, key: "id" },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // New field to track read status
    },
  },  
  {
    timestamps: true, // Optional: No need for timestamps here
  }
);

// Relationships
Message.belongsTo(Emp_onboarding, { foreignKey: "senderId", as: "sender" });
Message.belongsToMany(Emp_onboarding, {
  through: "Chat_Employee",
  as: "receivers",
  foreignKey: "messageId",
  otherKey: "receiverId",
});
Emp_onboarding.belongsToMany(Message, {
  through: "Chat_Employee",
  as: "receivedMessages",
  foreignKey: "receiverId",
  otherKey: "messageId",
});

Message.hasMany(MessageVisibility, { foreignKey: "messageId" });
MessageVisibility.belongsTo(Message, { foreignKey: "messageId" });
MessageVisibility.belongsTo(Emp_onboarding, {
  foreignKey: "userId",
  as: "user",
});

// Self-referencing for personal-to-personal replies
Message.belongsTo(Message, {
  foreignKey: 'replyToMessageId',
  as: 'replyTo',
  constraints: false,
});

// For private replies to a group message
Message.belongsTo(GroupMessage, {
  foreignKey: 'replyToGroupMessageId',
  as: 'replyToGroupMessage',
});

module.exports = { Message, MessageVisibility };
