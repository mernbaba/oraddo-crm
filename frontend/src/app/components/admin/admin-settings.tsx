import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Settings,
  Save,
  Mail,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Users,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { adminSettingsService, AdminSettingsData } from "../../services/adminSettingsService";

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<AdminSettingsData>({
    siteName: "Oraddo CRM",
    siteUrl: "https://app.oraddo.com",
    supportEmail: "support@oraddo.com",
    timezone: "UTC",
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@oraddo.com",
    smtpPassword: "",
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
    stripePublicKey: "",
    stripeSecretKey: "",
    autoApproveUsers: false,
    defaultPlan: "Free",
    trialPeriod: "14",
    maxUsers: "10000",
  });

  const loadOrgSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminSettingsService.get();
      if (res.data?.data) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      setError(err?.response?.data?.message ?? "Failed to load settings from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrgSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminSettingsService.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ToggleRow = ({ label, settingKey }: { label: string; settingKey: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20">
      <span className="text-sm text-[#200B43]">{label}</span>
      <input
        type="checkbox"
        checked={!!(settings as any)[settingKey]}
        onChange={(e) => updateSetting(settingKey, e.target.checked)}
        className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sticky Save Bar */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF] py-4 -mt-6 -mx-6 px-6 border-b border-[#937CB4]/20">
        <div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button size="sm" variant="outline" className="border-red-300 text-red-700 ml-2" onClick={loadOrgSettings}>
                <RefreshCw className="h-3 w-3 mr-1" /> Reload
              </Button>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-[#5A4079] text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading settings...</span>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </div>
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </Button>
      </div>

      {/* General Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Globe className="h-5 w-5" /> General Settings
            {!loading && <span className="text-xs font-normal text-green-600 ml-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Synced with DB</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Site Name", key: "siteName", type: "text" },
              { label: "Site URL", key: "siteUrl", type: "url" },
              { label: "Support Email", key: "supportEmail", type: "email" },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-[#200B43] mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => updateSetting(field.key, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Timezone</label>
              <select value={settings.timezone} onChange={(e) => updateSetting("timezone", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2"><Mail className="h-5 w-5" /> Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Email Provider</label>
              <select value={settings.emailProvider} onChange={(e) => updateSetting("emailProvider", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="aws-ses">AWS SES</option>
              </select>
            </div>
            {[
              { label: "SMTP Host", key: "smtpHost", type: "text" },
              { label: "SMTP Port", key: "smtpPort", type: "text" },
              { label: "SMTP User", key: "smtpUser", type: "email" },
              { label: "SMTP Password", key: "smtpPassword", type: "password" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#200B43] mb-2">{f.label}</label>
                <input type={f.type} value={(settings as any)[f.key]} onChange={(e) => updateSetting(f.key, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ToggleRow label="Email Notifications" settingKey="emailNotifications" />
            <ToggleRow label="SMS Notifications" settingKey="smsNotifications" />
            <ToggleRow label="Push Notifications" settingKey="pushNotifications" />
            <ToggleRow label="Notify on New User Registration" settingKey="notifyNewUser" />
            <ToggleRow label="Notify on New Query" settingKey="notifyNewQuery" />
            <ToggleRow label="Notify on Payment Received" settingKey="notifyPayment" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2"><Shield className="h-5 w-5" /> Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleRow label="Two-Factor Authentication" settingKey="twoFactorAuth" />
            {[
              { label: "Session Timeout (minutes)", key: "sessionTimeout" },
              { label: "Password Expiry (days)", key: "passwordExpiry" },
              { label: "Max Login Attempts", key: "maxLoginAttempts" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#200B43] mb-2">{f.label}</label>
                <input type="number" value={(settings as any)[f.key]} onChange={(e) => updateSetting(f.key, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Currency</label>
              <select value={settings.currency} onChange={(e) => updateSetting("currency", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
            {[
              { label: "Tax Rate (%)", key: "taxRate", type: "number" },
              { label: "Stripe Public Key", key: "stripePublicKey", type: "text" },
              { label: "Stripe Secret Key", key: "stripeSecretKey", type: "password" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#200B43] mb-2">{f.label}</label>
                <input type={f.type} value={(settings as any)[f.key]} onChange={(e) => updateSetting(f.key, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]" placeholder={f.key.includes("Public") ? "pk_test_..." : f.key.includes("Secret") ? "sk_test_..." : ""} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Settings */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2"><Users className="h-5 w-5" /> User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleRow label="Auto-Approve New Users" settingKey="autoApproveUsers" />
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Default Plan</label>
              <select value={settings.defaultPlan} onChange={(e) => updateSetting("defaultPlan", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
              </select>
            </div>
            {[
              { label: "Trial Period (days)", key: "trialPeriod" },
              { label: "Max Users (Platform Limit)", key: "maxUsers" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[#200B43] mb-2">{f.label}</label>
                <input type="number" value={(settings as any)[f.key]} onChange={(e) => updateSetting(f.key, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
