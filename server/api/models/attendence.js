const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    punch_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    punch_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // date: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Full Day",
        "Half Day",
        "Absent",
        "Present",
        "Pending"
      ),
      allowNull: true,
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // latitude: {
    //   type: DataTypes.FLOAT, // Store latitude as a FLOAT
    //   allowNull: true,       // Set allowNull as true to accept optional input
    // },
    // longitude: {
    //   type: DataTypes.FLOAT, // Store longitude as a FLOAT
    //   allowNull: true,
    // },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attendance_lop: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Organizations", key: "id" },
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    empAttendence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Emp_onboardings", key: "id" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Attendance;
