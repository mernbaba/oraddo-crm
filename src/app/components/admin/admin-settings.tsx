import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Settings,
  Save,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  CreditCard,
  Users,
  Sparkles
} from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "BPM Platform",
    siteUrl: "https://bpmplatform.com",
    supportEmail: "support@bpmplatform.com",
    timezone: "UTC",
    
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@bpmplatform.com",
    
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyNewUser: true,
    notifyNewQuery: true,
    notifyPayment: true,
    
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    
    currency: "USD",
    taxRate: "0",
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    
    autoApproveUsers: false,
    defaultPlan: "Free",
    trialPeriod: "14",
    maxUsers: "10000"
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end sticky top-0 z-10 bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF] py-4 -mt-6 -mx-6 px-6">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Settings Saved!" : "Save All Changes"}
        </Button>
      </div>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => updateSetting("siteUrl", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Email Provider
              </label>
              <select
                value={settings.emailProvider}
                onChange={(e) => updateSetting("emailProvider", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              >
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="aws-ses">AWS SES</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => updateSetting("smtpHost", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => updateSetting("smtpPort", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                SMTP User
              </label>
              <input
                type="email"
                value={settings.smtpUser}
                onChange={(e) => updateSetting("smtpUser", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">SMS Notifications</span>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => updateSetting("smsNotifications", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Push Notifications</span>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting("pushNotifications", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Notify on New User Registration</span>
              <input
                type="checkbox"
                checked={settings.notifyNewUser}
                onChange={(e) => updateSetting("notifyNewUser", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Notify on New Query</span>
              <input
                type="checkbox"
                checked={settings.notifyNewQuery}
                onChange={(e) => updateSetting("notifyNewQuery", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Notify on Payment Received</span>
              <input
                type="checkbox"
                checked={settings.notifyPayment}
                onChange={(e) => updateSetting("notifyPayment", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => updateSetting("passwordExpiry", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting("maxLoginAttempts", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting("currency", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => updateSetting("taxRate", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Stripe Public Key
              </label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={(e) => updateSetting("stripePublicKey", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) => updateSetting("stripeSecretKey", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="sk_test_..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
              <span className="text-sm text-[#200B43]">Auto-Approve New Users</span>
              <input
                type="checkbox"
                checked={settings.autoApproveUsers}
                onChange={(e) => updateSetting("autoApproveUsers", e.target.checked)}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Default Plan
              </label>
              <select
                value={settings.defaultPlan}
                onChange={(e) => updateSetting("defaultPlan", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              >
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Trial Period (days)
              </label>
              <input
                type="number"
                value={settings.trialPeriod}
                onChange={(e) => updateSetting("trialPeriod", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Max Users (Platform Limit)
              </label>
              <input
                type="number"
                value={settings.maxUsers}
                onChange={(e) => updateSetting("maxUsers", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Settings Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
