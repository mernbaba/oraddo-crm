const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  minPurchase: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  maxDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  validFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  validUntil: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  applicablePlans: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

module.exports = Coupon;
