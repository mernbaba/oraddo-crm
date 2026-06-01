const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Announcement = sequelize.define("Announcement", {
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
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Announcement;
