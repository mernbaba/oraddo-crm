const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Shift_Creation = sequelize.define("Shift_Creation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shift_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hours_type: {
    type:DataTypes.ENUM("Daily","Monthly"),
        allowNull:true
  },
  time_zone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shift_in_timing: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shift_out_timing: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shift_hours_duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Shift_Creation;
