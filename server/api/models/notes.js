const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const EmpNotes = sequelize.define("employee_notes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // JSON-encoded array of tag strings. Stored as TEXT so it works on any
  // dialect; the service handles serialize/deserialize.
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Hex color string (e.g. "#422462") used as the card accent.
  color: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  isedited: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
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
  }
});

module.exports = EmpNotes;
