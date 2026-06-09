import api from "../api";

export interface AdminSettingsData {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  timezone: string;
  emailProvider: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyNewUser: boolean;
  notifyNewQuery: boolean;
  notifyPayment: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
  maxLoginAttempts: string;
  currency: string;
  taxRate: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  smtpPassword: string;
  autoApproveUsers: boolean;
  defaultPlan: string;
  trialPeriod: string;
  maxUsers: string;
}

export const adminSettingsService = {
  get: () => api.get<{ data: AdminSettingsData }>("/api/admin-settings"),
  update: (data: Partial<AdminSettingsData>) =>
    api.put<{ message: string; data: AdminSettingsData }>("/api/admin-settings", data),
};
