const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const faq = sequelize.define("faq", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ticketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Working", "Resolved"),
    allowNull: true,
  },
});

module.exports = faq;
