const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// A technical support ticket raised from the employee portal Support page.
// `ticketCode` is the human-facing identifier (e.g. "TECH-1001"); it is
// derived from the auto-increment id right after creation so it stays unique
// and sortable. `priority`/`status` are kept as plain strings (validated at
// the application layer) to avoid ENUM migration headaches under
// `sequelize.sync({ alter: true })`.
const SupportTicket = sequelize.define(
  "support_tickets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issueType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Bug/Error",
    },
    priority: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "open",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stepsToReproduce: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    browserInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Owner of the ticket. Nullable so a ticket created without a logged-in
    // employee context still saves (mirrors the notes module behaviour).
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SupportTicket;
