import { useState } from "react";
import { Users, Clock, Calendar, Briefcase, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
 
export function HROrgHRPanel() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="punchSystem" value="yes" defaultChecked className="w-4 h-4 text-[#422462]" />
                  <span className="text-sm font-medium text-[#200B43]">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="punchSystem" value="no" className="w-4 h-4 text-[#422462]" />
                  <span className="text-sm font-medium text-[#200B43]">No</span>
                </label>
              </div>
            </div>
 
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Office Timings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officeStartTime" className="text-sm text-[#5A4079]">Office Start Time</Label>
                  <Input 
                    id="officeStartTime" 
                    type="time" 
                    defaultValue="09:00"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="officeEndTime" className="text-sm text-[#5A4079]">Office End Time</Label>
                  <Input 
                    id="officeEndTime" 
                    type="time" 
                    defaultValue="18:00"
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
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="lopPolicy" value="yes" className="w-4 h-4 text-[#422462]" />
                    <span className="text-sm font-medium text-[#200B43]">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="lopPolicy" value="no" defaultChecked className="w-4 h-4 text-[#422462]" />
                    <span className="text-sm font-medium text-[#200B43]">No</span>
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="lateThreshold" className="text-sm text-[#5A4079]">Late Threshold (minutes after office start time)</Label>
                <Input 
                  id="lateThreshold" 
                  type="number" 
                  defaultValue="15"
                  placeholder="15"
                  className="border-[#937CB4]/30 mt-1" 
                />
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
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Leave Bucket for Employees</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="casualLeaves" className="text-sm text-[#5A4079]">Casual Leaves (per year)</Label>
                  <Input 
                    id="casualLeaves" 
                    type="number" 
                    defaultValue="12"
                    placeholder="12"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="sickLeaves" className="text-sm text-[#5A4079]">Sick Leaves (per year)</Label>
                  <Input 
                    id="sickLeaves" 
                    type="number" 
                    defaultValue="10"
                    placeholder="10"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="paidLeaves" className="text-sm text-[#5A4079]">Paid Leaves (per year)</Label>
                  <Input 
                    id="paidLeaves" 
                    type="number" 
                    defaultValue="18"
                    placeholder="18"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
              </div>
            </div>
 
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold text-[#200B43]">Work from Home (WFH) Policy</Label>
                  <p className="text-sm text-[#5A4079] mt-1">Allow employees to work from home</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="wfhPolicy" value="yes" defaultChecked className="w-4 h-4 text-[#422462]" />
                    <span className="text-sm font-medium text-[#200B43]">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="wfhPolicy" value="no" className="w-4 h-4 text-[#422462]" />
                    <span className="text-sm font-medium text-[#200B43]">No</span>
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="wfhDays" className="text-sm text-[#5A4079]">WFH Days Allowed (per month)</Label>
                <Input 
                  id="wfhDays" 
                  type="number" 
                  defaultValue="4"
                  placeholder="4"
                  className="border-[#937CB4]/30 mt-1" 
                />
              </div>
            </div>
 
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Leave Bucket for Interns</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internLeaves" className="text-sm text-[#5A4079]">Total Leaves (per year)</Label>
                  <Input 
                    id="internLeaves" 
                    type="number" 
                    defaultValue="10"
                    placeholder="10"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="internWfh" className="text-sm text-[#5A4079]">WFH Days (per month)</Label>
                  <Input 
                    id="internWfh" 
                    type="number" 
                    defaultValue="2"
                    placeholder="2"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
              </div>
            </div>
 
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Leave Bucket Renewal Configuration</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="renewalMonth" className="text-sm text-[#5A4079]">Renewal Month</Label>
                  <select 
                    id="renewalMonth" 
                    defaultValue="January"
                    className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none mt-1"
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="leavesPerMonth" className="text-sm text-[#5A4079]">How many leaves credited per month?</Label>
                  <Input 
                    id="leavesPerMonth" 
                    type="number" 
                    step="0.5"
                    defaultValue="1.5"
                    placeholder="1.5"
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
            {/* Probation Period */}
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Probation Period Configuration</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="probationPeriod" className="text-sm text-[#5A4079]">Probation Period (months)</Label>
                  <Input 
                    id="probationPeriod" 
                    type="number" 
                    defaultValue="3"
                    placeholder="3"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="noticePeriod" className="text-sm text-[#5A4079]">Notice Period (days)</Label>
                  <Input 
                    id="noticePeriod" 
                    type="number" 
                    defaultValue="30"
                    placeholder="30"
                    className="border-[#937CB4]/30 mt-1" 
                  />
                </div>
              </div>
            </div>
 
            <div className="flex items-center justify-between p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <div>
                <Label className="text-base font-semibold text-[#200B43]">Overtime Compensation</Label>
                <p className="text-sm text-[#5A4079] mt-1">Provide overtime pay for extra hours worked</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="overtimePolicy" value="yes" defaultChecked className="w-4 h-4 text-[#422462]" />
                  <span className="text-sm font-medium text-[#200B43]">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="overtimePolicy" value="no" className="w-4 h-4 text-[#422462]" />
                  <span className="text-sm font-medium text-[#200B43]">No</span>
                </label>
              </div>
            </div>
 
            <div className="p-4 bg-[#F0E9FF]/30 rounded-lg border border-[#937CB4]/20">
              <Label className="text-base font-semibold text-[#200B43] mb-3 block">Half Day Configuration</Label>
              <div>
                <Label htmlFor="halfDayHours" className="text-sm text-[#5A4079]">Minimum hours for half day</Label>
                <Input 
                  id="halfDayHours" 
                  type="number" 
                  step="0.5"
                  defaultValue="4"
                  placeholder="4"
                  className="border-[#937CB4]/30 mt-1" 
                />
              </div>
            </div>
          </div>
        </div>
 
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            Reset to Default
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Check className="mr-2 h-4 w-4" />
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
