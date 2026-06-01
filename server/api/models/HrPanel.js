const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const HrPanel = sequelize.define("HrPanel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  punchInTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  punchOutTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  gracePeriod: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  leaveBuckets: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  renewalMonth: {
    type: DataTypes.STRING, // Best fit for storing "January", "February", etc.
    allowNull: true,
    validate: {
      isIn: {
        args: [
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        msg: "Must be a valid month name",
      },
    },
  },
  considerLOP: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  wfhDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  screenTracking: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "Organizations", key: "id" },
  },
  late_punchin: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  is_Employee_Editable:{
    type: DataTypes.BOOLEAN,
    allowNull:true,
    defaultValue: false,
  },
  team_performance: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  team_metrics: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  leaveBucket_Interns:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leaves_for_month:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  follow_punchin_system:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
});

module.exports = HrPanel;
