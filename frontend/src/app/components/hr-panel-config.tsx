import { useState, useEffect } from "react";
import { Users, Clock, Calendar, Briefcase, Check, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { hrPanelService, HrPanelData } from "../services/hrPanelService";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "HH:MM[:SS]" -> minutes since midnight (null when unset/invalid)
const timeToMinutes = (t?: string | null): number | null => {
  if (!t) return null;
  const [h, m] = String(t).split(":").map(Number);
  if (isNaN(h)) return null;
  return h * 60 + (isNaN(m) ? 0 : m);
};

const minutesToTime = (min: number) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}:00`;

interface FormState {
  followPunchSystem: boolean;
  officeStart: string; // "HH:MM"
  officeEnd: string;
  considerLateLOP: boolean;
  lateThresholdMin: string; // minutes after office start
  leaveBucket: string;
  internLeaveBucket: string;
  wfhDays: string;
  renewalMonth: string;
  leavesPerMonth: string;
  empEditable: boolean;
  screenTracking: boolean;
  teamPerformance: boolean;
}

const defaultForm: FormState = {
  followPunchSystem: true,
  officeStart: "09:00",
  officeEnd: "18:00",
  considerLateLOP: false,
  lateThresholdMin: "15",
  leaveBucket: "",
  internLeaveBucket: "",
  wfhDays: "",
  renewalMonth: "January",
  leavesPerMonth: "",
  empEditable: false,
  screenTracking: false,
  teamPerformance: false,
};

export function HROrgHRPanel() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [panelExists, setPanelExists] = useState(false);
  const [form, setForm] = useState<FormState>({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setError("No organization is linked to your account. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const u = JSON.parse(raw);
      const org = u?.organizationId != null ? Number(u.organizationId) : null;
      setOrgId(org);
      if (org == null) {
        setError("No organization is linked to your account. Please log in again.");
        setLoading(false);
      }
    } catch {
      setError("Could not read your session. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orgId == null) return;
    loadPanel(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const loadPanel = async (org: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrPanelService.getByOrg(org);
      const data = res.data;
      if (data && data.id != null) {
        setPanelExists(true);
        // gracePeriod is an absolute clock time; show it as minutes after start
        const startMin = timeToMinutes(data.punchInTime) ?? 9 * 60;
        const graceMin = timeToMinutes(data.gracePeriod);
        setForm({
          followPunchSystem: data.follow_punchin_system ?? true,
          officeStart: (data.punchInTime || "09:00").slice(0, 5),
          officeEnd: (data.punchOutTime || "18:00").slice(0, 5),
          considerLateLOP: data.late_punchin ?? false,
          lateThresholdMin: graceMin != null ? String(Math.max(0, graceMin - startMin)) : "15",
          leaveBucket: data.leaveBuckets != null ? String(data.leaveBuckets) : "",
          internLeaveBucket: data.leaveBucket_Interns != null ? String(data.leaveBucket_Interns) : "",
          wfhDays: data.wfhDays != null ? String(data.wfhDays) : "",
          renewalMonth: data.renewalMonth || "January",
          leavesPerMonth: data.leaves_for_month != null ? String(data.leaves_for_month) : "",
          empEditable: data.is_Employee_Editable ?? false,
          screenTracking: data.screenTracking ?? false,
          teamPerformance: data.team_performance ?? false,
        });
      } else {
        setPanelExists(false);
        setForm({ ...defaultForm });
      }
    } catch (e) {
      console.error("Failed to load HR panel configuration", e);
      setError("Failed to load the HR configuration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toInt = (v: string): number | null => {
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orgId == null) return;
    if (!form.officeStart || !form.officeEnd) {
      alert("Please set both office start and end times — punch in/out validation depends on them.");
      return;
    }
    const startMin = timeToMinutes(form.officeStart) ?? 9 * 60;
    const lateMin = Math.max(0, toInt(form.lateThresholdMin) ?? 0);

    const payload: HrPanelData = {
      follow_punchin_system: form.followPunchSystem,
      punchInTime: minutesToTime(startMin),
      punchOutTime: minutesToTime(timeToMinutes(form.officeEnd) ?? 18 * 60),
      late_punchin: form.considerLateLOP,
      considerLOP: form.considerLateLOP,
      // absolute late-threshold time = office start + threshold minutes
      gracePeriod: form.considerLateLOP ? minutesToTime(startMin + lateMin) : null,
      leaveBuckets: toInt(form.leaveBucket),
      leaveBucket_Interns: toInt(form.internLeaveBucket),
      wfhDays: toInt(form.wfhDays),
      renewalMonth: form.renewalMonth,
      leaves_for_month: toInt(form.leavesPerMonth),
      is_Employee_Editable: form.empEditable,
      screenTracking: form.screenTracking,
      team_performance: form.teamPerformance,
    };

    setSaving(true);
    setError(null);
    try {
      if (panelExists) {
        await hrPanelService.update(orgId, payload);
      } else {
        await hrPanelService.create({ ...payload, organizationID: orgId });
        setPanelExists(true);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save HR panel configuration", err);
      setError(err?.response?.data?.error || "Failed to save the HR configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const radioGroup = (
    name: string,
    value: boolean,
    onChange: (v: boolean) => void
  ) => (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value}
          onChange={() => onChange(true)}
          className="w-4 h-4 text-[#422462]"
        />
        <span className="text-sm font-medium text-[#200B43]">Yes</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={!value}
          onChange={() => onChange(false)}
          className="w-4 h-4 text-[#422462]"
        />
        <span className="text-sm font-medium text-[#200B43]">No</span>
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#422462] mx-auto" />
        <p className="text-sm text-[#5A4079] mt-3">Loading HR configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Users className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">HR Panel - System Configuration</h2>
            <p className="text-[#5A4079]">Control and configure all HR policies and rules</p>
          </div>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-300">
            <Check className="h-5 w-5" />
            <span className="font-medium">Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
          {orgId != null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadPanel(orgId)}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reload
            </Button>
          )}
        </div>
      )}

      {!panelExists && !error && (
        <div className="flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          No HR configuration exists for your organization yet — saving will create it. Punch in/out
          stops working for employees until office timings are configured.
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">

        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#200B43]">Attendance System Configuration</h3>
              <p className="text-sm text-[#5A4079]">Configure punch-in/out and office timing policies</p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div>
                <Label className="text-base font-semibold text-[#200B43]">Will you follow Punch-In and Punch-Out System?</Label>
                <p className="text-sm text-[#5A4079] mt-1">Enable or disable attendance tracking via punch system</p>
              </div>
              {radioGroup("punchSystem", form.followPunchSystem, (v) => set("followPunchSystem", v))}
            </div>

            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Office Timings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officeStartTime" className="text-sm text-[#5A4079]">Office Start Time</Label>
                  <Input
                    id="officeStartTime"
                    type="time"
                    value={form.officeStart}
                    onChange={(e) => set("officeStart", e.target.value)}
                    className="border-[#937CB4]/30 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="officeEndTime" className="text-sm text-[#5A4079]">Office End Time</Label>
                  <Input
                    id="officeEndTime"
                    type="time"
                    value={form.officeEnd}
                    onChange={(e) => set("officeEnd", e.target.value)}
                    className="border-[#937CB4]/30 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold text-[#200B43]">Will you consider LOP for Late Punch-Ins?</Label>
                  <p className="text-sm text-[#5A4079] mt-1">Loss of Pay for employees who punch-in late</p>
                </div>
                {radioGroup("lopPolicy", form.considerLateLOP, (v) => set("considerLateLOP", v))}
              </div>
              <div>
                <Label htmlFor="lateThreshold" className="text-sm text-[#5A4079]">Late Threshold (minutes after office start time)</Label>
                <Input
                  id="lateThreshold"
                  type="number"
                  min="0"
                  value={form.lateThresholdMin}
                  onChange={(e) => set("lateThresholdMin", e.target.value)}
                  disabled={!form.considerLateLOP}
                  placeholder="15"
                  className="border-[#937CB4]/30 mt-1"
                />
                {form.considerLateLOP && form.officeStart && (
                  <p className="text-xs text-[#5A4079] mt-1">
                    Punch-ins after{" "}
                    <strong>
                      {minutesToTime(
                        (timeToMinutes(form.officeStart) ?? 540) +
                          Math.max(0, toInt(form.lateThresholdMin) ?? 0)
                      ).slice(0, 5)}
                    </strong>{" "}
                    will be marked late.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#200B43]">Leave Management Configuration</h3>
              <p className="text-sm text-[#5A4079]">Configure leave buckets and policies for employees and interns</p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Leave Buckets</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leaveBucket" className="text-sm text-[#5A4079]">Employee Leave Bucket (days per year)</Label>
                  <Input
                    id="leaveBucket"
                    type="number"
                    min="0"
                    value={form.leaveBucket}
                    onChange={(e) => set("leaveBucket", e.target.value)}
                    placeholder="18"
                    className="border-[#937CB4]/30 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="internLeaves" className="text-sm text-[#5A4079]">Intern Leave Bucket (days per year)</Label>
                  <Input
                    id="internLeaves"
                    type="number"
                    min="0"
                    value={form.internLeaveBucket}
                    onChange={(e) => set("internLeaveBucket", e.target.value)}
                    placeholder="10"
                    className="border-[#937CB4]/30 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Work from Home (WFH) Policy</Label>
              <div>
                <Label htmlFor="wfhDays" className="text-sm text-[#5A4079]">WFH Days Allowed (per month)</Label>
                <Input
                  id="wfhDays"
                  type="number"
                  min="0"
                  value={form.wfhDays}
                  onChange={(e) => set("wfhDays", e.target.value)}
                  placeholder="4"
                  className="border-[#937CB4]/30 mt-1"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Leave Bucket Renewal Configuration</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="renewalMonth" className="text-sm text-[#5A4079]">Renewal Month</Label>
                  <select
                    id="renewalMonth"
                    value={form.renewalMonth}
                    onChange={(e) => set("renewalMonth", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none mt-1"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="leavesPerMonth" className="text-sm text-[#5A4079]">How many leaves credited per month?</Label>
                  <Input
                    id="leavesPerMonth"
                    type="number"
                    min="0"
                    step="1"
                    value={form.leavesPerMonth}
                    onChange={(e) => set("leavesPerMonth", e.target.value)}
                    placeholder="2"
                    className="border-[#937CB4]/30 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#200B43]">Additional HR Policies</h3>
              <p className="text-sm text-[#5A4079]">Configure other HR-related policies</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div>
                <Label className="text-base font-semibold text-[#200B43]">Allow Employees to Edit Their Profile?</Label>
                <p className="text-sm text-[#5A4079] mt-1">Employees can update their own personal details</p>
              </div>
              {radioGroup("empEditable", form.empEditable, (v) => set("empEditable", v))}
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div>
                <Label className="text-base font-semibold text-[#200B43]">Enable Screen Tracking?</Label>
                <p className="text-sm text-[#5A4079] mt-1">Track employee screens during work hours</p>
              </div>
              {radioGroup("screenTracking", form.screenTracking, (v) => set("screenTracking", v))}
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div>
                <Label className="text-base font-semibold text-[#200B43]">Enable Team Performance Reviews?</Label>
                <p className="text-sm text-[#5A4079] mt-1">Monthly performance scoring for employees</p>
              </div>
              {radioGroup("teamPerformance", form.teamPerformance, (v) => set("teamPerformance", v))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={saving || orgId == null}
            onClick={() => orgId != null && loadPanel(orgId)}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 hover:text-[#422462]"
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            disabled={saving || orgId == null}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Save HR Configuration
          </Button>
        </div>
      </form>

      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-blue-50/50 backdrop-blur-xl p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Important Notice</h4>
            <p className="text-sm text-blue-800">
              These configurations will affect the entire HR system including attendance tracking, leave management,
              salary calculations, and employee reports. Please review all settings carefully before saving.
              Changes will be applied system-wide immediately after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
