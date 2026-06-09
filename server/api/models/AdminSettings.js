const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const AdminSettings = sequelize.define("AdminSettings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // General
  siteName: { type: DataTypes.STRING, defaultValue: "Oraddo CRM" },
  siteUrl: { type: DataTypes.STRING, defaultValue: "https://app.oraddo.com" },
  supportEmail: { type: DataTypes.STRING, defaultValue: "support@oraddo.com" },
  timezone: { type: DataTypes.STRING, defaultValue: "UTC" },
  // Email
  emailProvider: { type: DataTypes.STRING, defaultValue: "smtp" },
  smtpHost: { type: DataTypes.STRING, defaultValue: "smtp.gmail.com" },
  smtpPort: { type: DataTypes.STRING, defaultValue: "587" },
  smtpUser: { type: DataTypes.STRING, defaultValue: "noreply@oraddo.com" },
  // Notifications
  emailNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
  smsNotifications: { type: DataTypes.BOOLEAN, defaultValue: false },
  pushNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
  notifyNewUser: { type: DataTypes.BOOLEAN, defaultValue: true },
  notifyNewQuery: { type: DataTypes.BOOLEAN, defaultValue: true },
  notifyPayment: { type: DataTypes.BOOLEAN, defaultValue: true },
  // Security
  twoFactorAuth: { type: DataTypes.BOOLEAN, defaultValue: true },
  sessionTimeout: { type: DataTypes.STRING, defaultValue: "30" },
  passwordExpiry: { type: DataTypes.STRING, defaultValue: "90" },
  maxLoginAttempts: { type: DataTypes.STRING, defaultValue: "5" },
  // Payment
  currency: { type: DataTypes.STRING, defaultValue: "USD" },
  taxRate: { type: DataTypes.STRING, defaultValue: "0" },
  stripePublicKey: { type: DataTypes.TEXT, defaultValue: "" },
  stripeSecretKey: { type: DataTypes.TEXT, defaultValue: "" },
  smtpPassword: { type: DataTypes.STRING, defaultValue: "" },
  // User management
  autoApproveUsers: { type: DataTypes.BOOLEAN, defaultValue: false },
  defaultPlan: { type: DataTypes.STRING, defaultValue: "Free" },
  trialPeriod: { type: DataTypes.STRING, defaultValue: "14" },
  maxUsers: { type: DataTypes.STRING, defaultValue: "10000" },
});

module.exports = AdminSettings;
