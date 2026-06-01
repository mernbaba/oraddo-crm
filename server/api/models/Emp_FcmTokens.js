const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Emp_onboarding = require("./Emp_onboarding");

const Emp_FcmTokens = sequelize.define("Emp_FcmTokens", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Emp_onboarding,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  fcm_token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  device_type: {
    type: DataTypes.ENUM("android", "ios", "web"),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Emp_onboarding.hasMany(Emp_FcmTokens, { foreignKey: "empId", onDelete: "CASCADE" });
Emp_FcmTokens.belongsTo(Emp_onboarding, { foreignKey: "empId" });

module.exports = Emp_FcmTokens;
