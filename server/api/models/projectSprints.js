const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Sprints = sequelize.define("Sprints", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration_to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // empOnboardingId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  status: {
    type: DataTypes.ENUM("Pending", "On Going", "Next Sprint"),
    allowNull: false,
  },

  // ── Sprint Kanban Board fields (additive / nullable) ───────────────────────
  // `kanban_status` is the board's source of truth ("active" | "planned" |
  // "completed"); the required ENUM `status` above is mapped to a valid value
  // on create so we never have to alter the ENUM.
  kanban_status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER, // target story points for the sprint
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER, // scopes a sprint to an organization
    allowNull: true,
  },
});

module.exports = Sprints;
