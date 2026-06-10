import { useState, useEffect } from "react";
import { FileText, Users, LogOut, Edit, Eye, Trash2, Plus, Download, Upload, Search, Filter, Calendar, Clock, Check, X, AlertCircle, User, Mail, Phone, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { HROrgOnboarding as HROnboardingSystem } from "./hr-onboarding-system";
import { resignationService } from "../services/resignationService";
import { employeeService } from "../services/employeeService";

 
type ApprovalStatus = "Pending" | "Approved" | "Declined";
type ResignationStatus = "Pending" | "Approved" | "Rejected" | "Completed";

interface ResignationRow {
  resignationId: number;
  empId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  position: string;
  submissionDate: string;
  lastWorkingDay: string;
  noticePeriod: string;
  reason: string;
  resignationType: string;
  status: ResignationStatus;
  letterUrl: string | null;
  employeeComments: string;
  hrStatus: ApprovalStatus;
  hrComments: string;
  teamLeadStatus: ApprovalStatus;
  teamLeadComments: string;
  managerStatus: ApprovalStatus;
  managerComments: string;
}

const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : "");

// Mirrors deriveStatus in the employee portal (hr-all-remaining.tsx): any decline
// rejects, HR approval finalizes; "Completed" once the last working day has passed.
const deriveOverallStatus = (rec: any): ResignationStatus => {
  if ([rec?.hr_status, rec?.manager_status, rec?.team_lead_status].includes("Declined")) return "Rejected";
  if (rec?.hr_status === "Approved") {
    const lwd = fmtDate(rec?.last_working_date);
    if (lwd && new Date(lwd) < new Date()) return "Completed";
    return "Approved";
  }
  return "Pending";
};

export function HROrgResignationManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<number | null>(null);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [resignations, setResignations] = useState<ResignationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [employees, setEmployees] = useState<{ id: number; emp_name: string; personal_email?: string; bussiness_email?: string }[]>([]);
  const emptyCreateForm = {
    empId: "",
    resignationDate: new Date().toISOString().slice(0, 10),
    lastWorkingDay: "",
    noticePeriod: "30",
    resignationType: "Voluntary",
    reason: "",
  };
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  const [editForm, setEditForm] = useState({
    lastWorkingDay: "",
    noticePeriod: "",
    reason: "",
    teamLeadStatus: "Pending" as ApprovalStatus,
    teamLeadComments: "",
    managerStatus: "Pending" as ApprovalStatus,
    managerComments: "",
    hrStatus: "Pending" as ApprovalStatus,
    hrComments: "",
  });
  const [saving, setSaving] = useState(false);

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
    loadResignations(orgId);
    loadEmployees(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // Rows come back as Emp_onboarding records with the resignation nested
  // under emp_Resignation (hasOne), so employee fields live on the outer row.
  const mapRow = (r: any): ResignationRow | null => {
    const rec = r?.emp_Resignation;
    if (!rec?.id) return null;
    return {
      resignationId: Number(rec.id),
      empId: Number(r.id),
      employeeName: r.emp_name || `Employee #${r.id}`,
      employeeCode: `EMP-${String(r.id).padStart(3, "0")}`,
      department: r.department || "—",
      position: r.position || "—",
      submissionDate: fmtDate(rec.resignation_date || rec.createdAt) || "—",
      lastWorkingDay: fmtDate(rec.last_working_date) || "—",
      noticePeriod: rec.notice_period ? `${String(rec.notice_period).replace(/\D/g, "") || rec.notice_period} days` : "—",
      reason: rec.resignation_reason || "—",
      resignationType: rec.resignation_type || "—",
      status: deriveOverallStatus(rec),
      letterUrl: rec.resignation_letter || null,
      employeeComments: rec.employee_comments || "",
      hrStatus: rec.hr_status || "Pending",
      hrComments: rec.hr_comments || "",
      teamLeadStatus: rec.team_lead_status || "Pending",
      teamLeadComments: rec.team_lead_comments || "",
      managerStatus: rec.manager_status || "Pending",
      managerComments: rec.manager_comments || "",
    };
  };

  const loadResignations = async (org: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resignationService.getByOrg(org);
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setResignations((data as any[]).map(mapRow).filter((x): x is ResignationRow => x !== null));
    } catch (e) {
      console.error("Failed to load resignations", e);
      setError("Failed to load resignation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (org: number) => {
    try {
      const res = await employeeService.getEmployeesByOrg(org);
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setEmployees(
        (data as any[]).map((e) => ({
          id: Number(e.id),
          emp_name: e.emp_name || `Employee #${e.id}`,
          personal_email: e.personal_email,
          bussiness_email: e.bussiness_email,
        }))
      );
    } catch (e) {
      console.error("Failed to load employees", e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orgId == null) return;
    const emp = employees.find((x) => x.id === Number(createForm.empId));
    if (!emp) {
      alert("Please select an employee.");
      return;
    }
    const empEmail = emp.personal_email || emp.bussiness_email;
    if (!empEmail) {
      alert("This employee has no email address on file. Please add one to their onboarding record first.");
      return;
    }
    if (!createForm.lastWorkingDay) {
      alert("Please choose the last working day.");
      return;
    }
    if (!createForm.reason.trim()) {
      alert("Please enter the reason for resignation.");
      return;
    }
    setCreating(true);
    try {
      const res = await resignationService.create({
        emp_onboarding_id: emp.id,
        personal_email_address: empEmail,
        resignation_reason: createForm.reason.trim(),
        resignation_type: createForm.resignationType,
        notice_period: createForm.noticePeriod,
        last_working_date: createForm.lastWorkingDay,
        resignation_date: createForm.resignationDate,
        organizationID: orgId,
        hr_status: "Pending",
        team_lead_status: "Pending",
        manager_status: "Pending",
      });
      // The server answers 201 with { success:false } when the employee still
      // has an open salary loan — treat it as a validation failure.
      if (res.data?.success === false) {
        alert(res.data.message || "Unable to process this resignation.");
        return;
      }
      setShowCreateModal(false);
      setCreateForm(emptyCreateForm);
      await loadResignations(orgId);
    } catch (err) {
      console.error("Failed to create resignation", err);
      alert("Failed to process the resignation. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (row: ResignationRow) => {
    setEditForm({
      lastWorkingDay: row.lastWorkingDay !== "—" ? row.lastWorkingDay : "",
      noticePeriod: row.noticePeriod !== "—" ? row.noticePeriod.replace(/\D/g, "") : "",
      reason: row.reason !== "—" ? row.reason : "",
      teamLeadStatus: row.teamLeadStatus,
      teamLeadComments: row.teamLeadComments,
      managerStatus: row.managerStatus,
      managerComments: row.managerComments,
      hrStatus: row.hrStatus,
      hrComments: row.hrComments,
    });
    setViewModal(null);
    setEditModal(row.resignationId);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal == null || orgId == null) return;
    setSaving(true);
    try {
      await resignationService.update(editModal, {
        // null (not undefined) so an emptied field actually clears in the DB;
        // axios drops undefined keys. resignation_reason is NOT NULL, so skip it when empty.
        last_working_date: editForm.lastWorkingDay || null,
        notice_period: editForm.noticePeriod || null,
        resignation_reason: editForm.reason || undefined,
        team_lead_status: editForm.teamLeadStatus,
        team_lead_comments: editForm.teamLeadComments,
        manager_status: editForm.managerStatus,
        manager_comments: editForm.managerComments,
        hr_status: editForm.hrStatus,
        hr_comments: editForm.hrComments,
      });
      setEditModal(null);
      await loadResignations(orgId);
    } catch (err) {
      console.error("Failed to update resignation", err);
      alert("Failed to save the updates. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name: string) =>
    name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <LogOut className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Employee Resignation Management</h2>
            <p className="text-[#5A4079]">Manage employee resignation processes</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Process Resignation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Total Resignations</p>
              <p className="text-2xl font-bold text-[#200B43]">{resignations.length}</p>
            </div>
            <FileText className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Pending</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {resignations.filter(r => r.status === "Pending").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Approved</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {resignations.filter(r => r.status === "Approved").length}
              </p>
            </div>
            <Check className="h-8 w-8 text-blue-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Completed</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {resignations.filter(r => r.status === "Completed").length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600/30" />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#200B43] mb-4">Resignation Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#937CB4]/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Submission Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Last Working Day</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Notice Period</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex items-center justify-center gap-3 text-sm text-[#5A4079]">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[#422462]"></div>
                        Loading resignation requests…
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-red-600">{error}</p>
                        {orgId != null && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadResignations(orgId)}
                            className="border-[#937CB4]/30"
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : resignations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-[#5A4079]">
                      No resignation requests yet.
                    </td>
                  </tr>
                ) : (
                  resignations.map((resignation) => (
                    <tr key={resignation.resignationId} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-[#200B43]">{resignation.employeeName}</p>
                          <p className="text-xs text-[#5A4079]">{resignation.employeeCode}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5A4079]">{resignation.department}</td>
                      <td className="py-3 px-4 text-sm text-[#5A4079]">{resignation.submissionDate}</td>
                      <td className="py-3 px-4 text-sm text-[#5A4079]">{resignation.lastWorkingDay}</td>
                      <td className="py-3 px-4 text-sm text-[#5A4079]">{resignation.noticePeriod}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(resignation.status)}`}>
                          {resignation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewModal(resignation.resignationId)}
                            className="text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(resignation)}
                            className="text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Process Resignation" size="lg">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div>
            <Label htmlFor="employee">Employee</Label>
            <select
              id="employee"
              value={createForm.empId}
              onChange={(e) => setCreateForm({ ...createForm, empId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none text-sm"
            >
              <option value="">Select an employee…</option>
              {employees
                .filter((emp) => !resignations.some((r) => r.empId === emp.id))
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.emp_name} (EMP-{String(emp.id).padStart(3, "0")})
                  </option>
                ))}
            </select>
            <p className="text-xs text-[#5A4079] mt-1">Employees with an existing resignation are not listed.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="submissionDate">Submission Date</Label>
              <Input
                id="submissionDate"
                type="date"
                value={createForm.resignationDate}
                onChange={(e) => setCreateForm({ ...createForm, resignationDate: e.target.value })}
                className="border-[#937CB4]/30"
              />
            </div>
            <div>
              <Label htmlFor="lastWorkingDay">Last Working Day</Label>
              <Input
                id="lastWorkingDay"
                type="date"
                value={createForm.lastWorkingDay}
                onChange={(e) => setCreateForm({ ...createForm, lastWorkingDay: e.target.value })}
                className="border-[#937CB4]/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create-notice-period">Notice Period (days)</Label>
              <Input
                id="create-notice-period"
                type="number"
                min={0}
                value={createForm.noticePeriod}
                onChange={(e) => setCreateForm({ ...createForm, noticePeriod: e.target.value })}
                className="border-[#937CB4]/30"
              />
            </div>
            <div>
              <Label htmlFor="resignationType">Resignation Type</Label>
              <select
                id="resignationType"
                value={createForm.resignationType}
                onChange={(e) => setCreateForm({ ...createForm, resignationType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none text-sm"
              >
                <option value="Voluntary">Voluntary</option>
                <option value="Retirement">Retirement</option>
                <option value="Relocation">Relocation</option>
                <option value="Personal Reasons">Personal Reasons</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Reason for Resignation</Label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Enter reason..."
              value={createForm.reason}
              onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
              className="border-[#937CB4]/30"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="border-[#937CB4]/30">
              Cancel
            </Button>
            <Button type="submit" disabled={creating} className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">
              {creating ? "Processing…" : "Process Resignation"}
            </Button>
          </div>
        </form>
      </Modal>
 
      {viewModal !== null && (
        <Modal isOpen={true} onClose={() => setViewModal(null)} title="Resignation & Exit Process Timeline" size="lg">
          {resignations.filter((r) => r.resignationId === viewModal).map((resignation) => (
            <div key={resignation.resignationId} className="space-y-6">
              {/* Employee Info Card */}
              <div className="bg-gradient-to-r from-[#F0E9FF] to-[#FFFFFF] rounded-lg p-4 border border-[#937CB4]/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold">
                    {initials(resignation.employeeName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#200B43]">{resignation.employeeName}</h3>
                    <p className="text-sm text-[#5A4079]">{resignation.employeeCode} • {resignation.department} • {resignation.position}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#5A4079]">Submission Date</p>
                    <p className="font-medium text-[#200B43]">{resignation.submissionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079]">Last Working Day</p>
                    <p className="font-medium text-[#200B43]">{resignation.lastWorkingDay}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079]">Notice Period</p>
                    <p className="font-medium text-[#200B43]">{resignation.noticePeriod}</p>
                  </div>
                </div>
              </div>
 
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#200B43] flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#422462]" />
                  Resignation & Exit Process Steps
                </h3>

                {[
                  {
                    title: "Step 1: Resignation Submission",
                    state: "done",
                    badge: "Completed",
                    description: "Resignation request recorded",
                    details: (
                      <>
                        <p><strong>Date:</strong> {resignation.submissionDate}</p>
                        <p><strong>Reason:</strong> {resignation.reason}</p>
                        <p><strong>Type:</strong> {resignation.resignationType}</p>
                        <p><strong>Notice Period:</strong> {resignation.noticePeriod}</p>
                        {resignation.employeeComments && <p><strong>Employee Comments:</strong> {resignation.employeeComments}</p>}
                        {resignation.letterUrl && (
                          <p>
                            <strong>Resignation Letter:</strong>{" "}
                            <a href={resignation.letterUrl} target="_blank" rel="noreferrer" className="text-[#422462] underline">
                              View letter
                            </a>
                          </p>
                        )}
                      </>
                    ),
                  },
                  ...[
                    { title: "Step 2: Team Lead Approval", status: resignation.teamLeadStatus, comments: resignation.teamLeadComments, description: "Team lead reviews the resignation request" },
                    { title: "Step 3: Manager Approval", status: resignation.managerStatus, comments: resignation.managerComments, description: "Manager reviews the resignation request" },
                    { title: "Step 4: HR Approval", status: resignation.hrStatus, comments: resignation.hrComments, description: "HR reviews and finalizes the resignation" },
                  ].map((s) => ({
                    title: s.title,
                    state: s.status === "Approved" ? "done" : s.status === "Declined" ? "declined" : "pending",
                    badge: s.status,
                    description: s.description,
                    details: (
                      <>
                        <p><strong>Status:</strong> {s.status}</p>
                        {s.comments && <p><strong>Comments:</strong> {s.comments}</p>}
                      </>
                    ),
                  })),
                  {
                    title: "Step 5: Exit Complete",
                    state: resignation.status === "Completed" ? "done" : "pending",
                    badge: resignation.status === "Completed" ? "Completed" : "Pending",
                    description: "Final exit on the last working day",
                    details: (
                      <>
                        <p><strong>Last Working Day:</strong> {resignation.lastWorkingDay}</p>
                        <p><strong>Status:</strong> {resignation.status === "Completed" ? "Exit completed" : "Process ongoing"}</p>
                      </>
                    ),
                  },
                ].map((step, index, steps) => (
                  <div
                    key={step.title}
                    className={`relative pl-8 ${
                      index < steps.length - 1
                        ? `pb-8 border-l-2 ${step.state === "pending" ? "border-[#937CB4]/30" : "border-[#422462]"}`
                        : ""
                    }`}
                  >
                    <div
                      className={`absolute -left-3 top-0 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center ${
                        step.state === "done" ? "bg-green-500" : step.state === "declined" ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      {step.state === "done" ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : step.state === "declined" ? (
                        <X className="h-3 w-3 text-white" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <div className={`bg-white rounded-lg p-4 border border-[#937CB4]/20 shadow-sm ${step.state === "pending" ? "opacity-60" : ""}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#200B43]">{step.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            step.state === "done"
                              ? "bg-green-100 text-green-800"
                              : step.state === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-sm text-[#5A4079] mb-2">{step.description}</p>
                      <div className="text-xs text-[#5A4079]">{step.details}</div>
                    </div>
                  </div>
                ))}
              </div>
 
              <div className="flex gap-3 justify-end pt-4 border-t border-[#937CB4]/20">
                <Button 
                  variant="outline" 
                  onClick={() => setViewModal(null)} 
                  className="border-[#937CB4]/30"
                >
                  Close
                </Button>
                <Button
                  onClick={() => openEdit(resignation)}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Update Process Steps
                </Button>
              </div>
            </div>
          ))}
        </Modal>
      )}
 
      {editModal !== null && (
        <Modal isOpen={true} onClose={() => setEditModal(null)} title="Update Resignation & Exit Process" size="lg">
          {resignations.filter((r) => r.resignationId === editModal).map((resignation) => (
            <form key={resignation.resignationId} className="space-y-6 max-h-[70vh] overflow-y-auto" onSubmit={handleSave}>
              {/* Employee Info (Read-only) */}
              <div className="bg-[#F0E9FF]/30 rounded-lg p-4 border border-[#937CB4]/20 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-sm">
                    {initials(resignation.employeeName)}
                  </div>
                  <div>
                    <p className="font-medium text-[#200B43]">{resignation.employeeName}</p>
                    <p className="text-xs text-[#5A4079]">{resignation.employeeCode} • {resignation.department}</p>
                  </div>
                </div>
              </div>
 
              <div className="border border-[#937CB4]/20 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-[#200B43] mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#422462] text-white flex items-center justify-center text-xs">1</div>
                  Resignation Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-lwd">Last Working Day</Label>
                    <Input
                      id="edit-lwd"
                      type="date"
                      value={editForm.lastWorkingDay}
                      onChange={(e) => setEditForm({ ...editForm, lastWorkingDay: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-notice">Notice Period (days)</Label>
                    <Input
                      id="edit-notice"
                      type="number"
                      min={0}
                      value={editForm.noticePeriod}
                      onChange={(e) => setEditForm({ ...editForm, noticePeriod: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-reason">Resignation Reason</Label>
                    <Textarea
                      id="edit-reason"
                      rows={2}
                      value={editForm.reason}
                      onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#937CB4]/20 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-[#200B43] mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#422462] text-white flex items-center justify-center text-xs">2</div>
                  Team Lead Approval
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-tl-status">Approval Status</Label>
                    <select
                      id="edit-tl-status"
                      value={editForm.teamLeadStatus}
                      onChange={(e) => setEditForm({ ...editForm, teamLeadStatus: e.target.value as ApprovalStatus })}
                      className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-tl-comments">Team Lead Comments</Label>
                    <Textarea
                      id="edit-tl-comments"
                      rows={2}
                      placeholder="Comments..."
                      value={editForm.teamLeadComments}
                      onChange={(e) => setEditForm({ ...editForm, teamLeadComments: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#937CB4]/20 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-[#200B43] mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#422462] text-white flex items-center justify-center text-xs">3</div>
                  Manager Approval
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-mgr-status">Approval Status</Label>
                    <select
                      id="edit-mgr-status"
                      value={editForm.managerStatus}
                      onChange={(e) => setEditForm({ ...editForm, managerStatus: e.target.value as ApprovalStatus })}
                      className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-mgr-comments">Manager Comments</Label>
                    <Textarea
                      id="edit-mgr-comments"
                      rows={2}
                      placeholder="Comments..."
                      value={editForm.managerComments}
                      onChange={(e) => setEditForm({ ...editForm, managerComments: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#937CB4]/20 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-[#200B43] mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#422462] text-white flex items-center justify-center text-xs">4</div>
                  HR Decision
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-hr-status">Approval Status</Label>
                    <select
                      id="edit-hr-status"
                      value={editForm.hrStatus}
                      onChange={(e) => setEditForm({ ...editForm, hrStatus: e.target.value as ApprovalStatus })}
                      className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-hr-comments">HR Comments</Label>
                    <Textarea
                      id="edit-hr-comments"
                      rows={2}
                      placeholder="Comments..."
                      value={editForm.hrComments}
                      onChange={(e) => setEditForm({ ...editForm, hrComments: e.target.value })}
                      className="border-[#937CB4]/30 text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#5A4079] mt-2">
                  HR approval finalizes the resignation. Declining any step marks the request as rejected.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModal(null)}
                  className="border-[#937CB4]/30"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {saving ? "Saving…" : "Save All Updates"}
                </Button>
              </div>
            </form>
          ))}
        </Modal>
      )}
    </div>
  );
}
 
export function HROrgDailyReport() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState<number | null>(null);

  const reports = [
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP-001",
      date: "2024-01-15",
      workHours: "8.5",
      tasksCompleted: 5,
      projectName: "Website Redesign",
      summary: "Completed homepage mockups and started working on navigation components",
      status: "Submitted",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP-002",
      date: "2024-01-15",
      workHours: "7.0",
      tasksCompleted: 3,
      projectName: "Mobile App Development",
      summary: "Fixed authentication bugs and implemented user profile screen",
      status: "Approved",
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      employeeId: "EMP-003",
      date: "2024-01-15",
      workHours: "9.0",
      tasksCompleted: 6,
      projectName: "API Integration",
      summary: "Completed payment gateway integration and tested endpoints",
      status: "Submitted",
    },
  ];

  return (
    <div className="space-y-6">
  
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Daily Report Management</h2>
            <p className="text-[#5A4079]">Monitor and manage daily employee reports</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 hover:text-[#422462]">
            <Filter className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>
 
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Today's Reports</p>
              <p className="text-2xl font-bold text-[#200B43]">{reports.length}</p>
            </div>
            <FileText className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Avg Work Hours</p>
              <p className="text-2xl font-bold text-[#200B43]">8.2</p>
            </div>
            <Clock className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Tasks Completed</p>
              <p className="text-2xl font-bold text-[#200B43]">14</p>
            </div>
            <Check className="h-8 w-8 text-green-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Pending Approval</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {reports.filter(r => r.status === "Submitted").length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600/30" />
          </div>
        </div>
      </div>
 
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-sm">
                  {report.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-[#200B43]">{report.employeeName}</h4>
                  <p className="text-xs text-[#5A4079]">{report.employeeId} • {report.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                report.status === "Approved" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {report.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#5A4079]" />
                <div>
                  <p className="text-xs text-[#5A4079]">Work Hours</p>
                  <p className="text-sm font-semibold text-[#200B43]">{report.workHours}h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#5A4079]" />
                <div>
                  <p className="text-xs text-[#5A4079]">Tasks Completed</p>
                  <p className="text-sm font-semibold text-[#200B43]">{report.tasksCompleted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#5A4079]" />
                <div>
                  <p className="text-xs text-[#5A4079]">Project</p>
                  <p className="text-sm font-semibold text-[#200B43]">{report.projectName}</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-[#5A4079] mb-1">Summary:</p>
              <p className="text-sm text-[#200B43]">{report.summary}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
                onClick={() => setViewDetailsModal(report.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              {report.status === "Submitted" && (
                <>
                  <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
 
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Submit Daily Report" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" className="border-[#937CB4]/30" />
            </div>
            <div>
              <Label htmlFor="workHours">Work Hours</Label>
              <Input id="workHours" type="number" step="0.5" placeholder="8.0" className="border-[#937CB4]/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tasksCompleted">Tasks Completed</Label>
              <Input id="tasksCompleted" type="number" placeholder="5" className="border-[#937CB4]/30" />
            </div>
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" placeholder="Project name" className="border-[#937CB4]/30" />
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Work Summary</Label>
            <Textarea id="summary" rows={4} placeholder="Describe your work for today..." className="border-[#937CB4]/30" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="border-[#937CB4]/30">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
 
      {viewDetailsModal !== null && (() => {
        const report = reports.find(r => r.id === viewDetailsModal);
        if (!report) return null;
        
        return (
          <Modal 
            isOpen={true} 
            onClose={() => setViewDetailsModal(null)} 
            title="Daily Report Details" 
            size="lg"
          >
            <div className="space-y-6">
 
              <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {report.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#200B43]">{report.employeeName}</h3>
                  <p className="text-sm text-[#5A4079]">Employee ID: {report.employeeId}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  report.status === "Approved" 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                }`}>
                  {report.status}
                </span>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Report Date</p>
                      <p className="text-lg font-bold text-[#200B43]">{report.date}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Clock className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Work Hours</p>
                      <p className="text-lg font-bold text-[#200B43]">{report.workHours} hours</p>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF] p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center shadow-sm">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Tasks Completed</p>
                      <p className="text-lg font-bold text-[#200B43]">{report.tasksCompleted}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF] p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#5A4079] to-[#937CB4] flex items-center justify-center shadow-sm">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Project</p>
                      <p className="text-sm font-bold text-[#200B43]">{report.projectName}</p>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-5 shadow-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-sm">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#200B43] text-lg">Work Summary</h4>
                    <p className="text-xs text-[#5A4079]">Detailed description of today's work</p>
                  </div>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-[#200B43] leading-relaxed bg-[#F0E9FF]/30 p-4 rounded-lg">
                    {report.summary}
                  </p>
                </div>
              </div>
 
              {report.status === "Submitted" && (
                <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Report
                  </Button>
                </div>
              )}
 
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDetailsModal(null)}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
 
export function HROrgDocumentation() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState<number | null>(null);
  const [selectedDocType, setSelectedDocType] = useState("");

  const documents = [
    {
      id: 1,
      employeeName: "Alice Johnson",
      employeeId: "EMP-001",
      documentType: "Offer Letter",
      documentName: "Offer_Letter_Alice_Johnson.pdf",
      uploadedDate: "2024-01-10",
      uploadedBy: "HR Admin",
      size: "2.4 MB",
      status: "Approved",
      createdBy: "System Generated",
    },
    {
      id: 2,
      employeeName: "Bob Smith",
      employeeId: "EMP-002",
      documentType: "Employment Agreement",
      documentName: "Employment_Agreement_Bob_Smith.pdf",
      uploadedDate: "2024-01-08",
      uploadedBy: "HR Admin",
      size: "1.8 MB",
      status: "Pending Approval",
      createdBy: "System Generated",
    },
    {
      id: 3,
      employeeName: "Carol Williams",
      employeeId: "EMP-003",
      documentType: "Relieving Letter",
      documentName: "Relieving_Letter_Carol.pdf",
      uploadedDate: "2024-01-05",
      uploadedBy: "HR Manager",
      size: "3.2 MB",
      status: "Approved",
      createdBy: "Manual Upload",
    },
    {
      id: 4,
      employeeName: "David Lee",
      employeeId: "EMP-004",
      documentType: "Internship Certificate",
      documentName: "Internship_Certificate_David.pdf",
      uploadedDate: "2024-01-12",
      uploadedBy: "HR Admin",
      size: "1.5 MB",
      status: "Pending Approval",
      createdBy: "System Generated",
    },
    {
      id: 5,
      employeeName: "Emma Wilson",
      employeeId: "EMP-005",
      documentType: "NDA",
      documentName: "NDA_Emma_Wilson.pdf",
      uploadedDate: "2024-01-15",
      uploadedBy: "HR Admin",
      size: "0.8 MB",
      status: "Approved",
      createdBy: "System Generated",
    },
  ];

  const documentTypes = [
    "Offer Letter",
    "Joining Letter",
    "Experience Letter",
    "Letter of Recommendation",
    "Internship Certificate",
    "Contract Document",
    "Employment Agreement",
    "Non-Disclosure Agreement (NDA)",
    "Appraisal Document",
    "Relieving Letter",
  ];

  return (
    <div className="space-y-6">
   
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Employee Documentation</h2>
            <p className="text-[#5A4079]">Manage employee documents and records</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#5A4079] to-[#937CB4] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-lg"
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Document
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>
 
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Total Documents</p>
              <p className="text-2xl font-bold text-[#200B43]">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Approved</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {documents.filter(d => d.status === "Approved").length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Pending Approval</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {documents.filter(d => d.status === "Pending Approval").length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Document Types</p>
              <p className="text-2xl font-bold text-[#200B43]">{documentTypes.length}</p>
            </div>
            <FileText className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
      </div>
 
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
          <Input
            placeholder="Search documents by employee name, ID, or document type..."
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 hover:text-[#422462]">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#200B43] mb-4">Employee Documents</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-[#937CB4]/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[15%]">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[15%]">Document Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[20%]">Document Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[12%]">Upload Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[8%]">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[12%]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[18%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors">
                    <td className="py-3 px-4 align-middle">
                      <div>
                        <p className="text-sm font-medium text-[#200B43] truncate">{doc.employeeName}</p>
                        <p className="text-xs text-[#5A4079]">{doc.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle">
                      <span className="line-clamp-2">{doc.documentType}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle">
                      <span className="line-clamp-2" title={doc.documentName}>{doc.documentName}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{doc.uploadedDate}</td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{doc.size}</td>
                    <td className="py-3 px-4 align-middle">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        doc.status === "Approved" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewModal(doc.id)}
                          className="text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.status === "Pending Approval" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                            title="Approve & Send to Employee"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input id="employeeId" placeholder="EMP-XXX" className="border-[#937CB4]/30" />
            </div>
            <div>
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input id="employeeName" placeholder="Full name" className="border-[#937CB4]/30" />
            </div>
          </div>
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <select id="documentType" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none">
              <option value="">Select document type</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="documentName">Document Name</Label>
            <Input id="documentName" placeholder="Document name" className="border-[#937CB4]/30" />
          </div>
          <div>
            <Label htmlFor="file">Upload File</Label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#937CB4]/30 border-dashed rounded-lg cursor-pointer bg-[#F0E9FF]/20 hover:bg-[#F0E9FF]/40 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-[#422462]" />
                  <p className="mb-2 text-sm text-[#5A4079]">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#5A4079]">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
                </div>
                <input id="file" type="file" className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)} className="border-[#937CB4]/30">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
 
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Document" size="xl">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="createEmployeeId">Employee ID</Label>
              <Input id="createEmployeeId" placeholder="EMP-XXX" className="border-[#937CB4]/30" />
            </div>
            <div>
              <Label htmlFor="createEmployeeName">Employee Name</Label>
              <Input id="createEmployeeName" placeholder="Full name" className="border-[#937CB4]/30" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="createDocumentType">Document Type</Label>
            <select 
              id="createDocumentType" 
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
            >
              <option value="">Select document type</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {selectedDocType && (
            <div className="space-y-4 p-4 border border-[#937CB4]/30 rounded-lg bg-[#F0E9FF]/10">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[#422462]" />
                <h4 className="font-semibold text-[#200B43]">Document Details for {selectedDocType}</h4>
              </div>
 
              {selectedDocType === "Offer Letter" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" placeholder="e.g. Senior Developer" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="e.g. Engineering" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary">Annual Salary (CTC)</Label>
                      <Input id="salary" type="number" placeholder="e.g. 1200000" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input id="joiningDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="workLocation">Work Location</Label>
                    <Input id="workLocation" placeholder="e.g. Mumbai, India" className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Joining Letter" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="actualJoiningDate">Actual Joining Date</Label>
                      <Input id="actualJoiningDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="reportingManager">Reporting Manager</Label>
                      <Input id="reportingManager" placeholder="Manager name" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="workSchedule">Work Schedule</Label>
                    <Input id="workSchedule" placeholder="e.g. Monday - Friday, 9 AM - 6 PM" className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Experience Letter" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expStartDate">Employment Start Date</Label>
                      <Input id="expStartDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="expEndDate">Employment End Date</Label>
                      <Input id="expEndDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" placeholder="Final designation" className="border-[#937CB4]/30" />
                  </div>
                  <div>
                    <Label htmlFor="responsibilities">Key Responsibilities</Label>
                    <Textarea id="responsibilities" rows={3} placeholder="Describe key responsibilities..." className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Letter of Recommendation" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recPosition">Position Held</Label>
                      <Input id="recPosition" placeholder="Position" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="recDuration">Duration</Label>
                      <Input id="recDuration" placeholder="e.g. 2 years" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="strengths">Key Strengths</Label>
                    <Textarea id="strengths" rows={3} placeholder="Describe employee's key strengths..." className="border-[#937CB4]/30" />
                  </div>
                  <div>
                    <Label htmlFor="achievements">Notable Achievements</Label>
                    <Textarea id="achievements" rows={3} placeholder="List notable achievements..." className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Internship Certificate" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="internStartDate">Internship Start Date</Label>
                      <Input id="internStartDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="internEndDate">Internship End Date</Label>
                      <Input id="internEndDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="internProject">Project/Domain</Label>
                    <Input id="internProject" placeholder="e.g. Web Development" className="border-[#937CB4]/30" />
                  </div>
                  <div>
                    <Label htmlFor="internPerformance">Performance Rating</Label>
                    <select id="internPerformance" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] outline-none">
                      <option>Excellent</option>
                      <option>Very Good</option>
                      <option>Good</option>
                      <option>Satisfactory</option>
                    </select>
                  </div>
                </>
              )}
 
              {selectedDocType === "Contract Document" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractType">Contract Type</Label>
                      <select id="contractType" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] outline-none">
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Contractual</option>
                        <option>Freelance</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="contractDuration">Contract Duration</Label>
                      <Input id="contractDuration" placeholder="e.g. 1 year" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="noticePeriod">Notice Period</Label>
                    <Input id="noticePeriod" placeholder="e.g. 30 days" className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Employment Agreement" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agreementStartDate">Agreement Start Date</Label>
                      <Input id="agreementStartDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="probationPeriod">Probation Period</Label>
                      <Input id="probationPeriod" placeholder="e.g. 3 months" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="benefits">Benefits & Perks</Label>
                    <Textarea id="benefits" rows={2} placeholder="List benefits..." className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Non-Disclosure Agreement (NDA)" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ndaEffectiveDate">Effective Date</Label>
                      <Input id="ndaEffectiveDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="ndaValidity">Validity Period</Label>
                      <Input id="ndaValidity" placeholder="e.g. 2 years" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confidentialInfo">Confidential Information Scope</Label>
                    <Textarea id="confidentialInfo" rows={3} placeholder="Describe what information is confidential..." className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              {selectedDocType === "Appraisal Document" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appraisalPeriod">Appraisal Period</Label>
                      <Input id="appraisalPeriod" placeholder="e.g. Jan 2024 - Dec 2024" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="performanceRating">Performance Rating</Label>
                      <select id="performanceRating" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] outline-none">
                        <option>Outstanding (5)</option>
                        <option>Exceeds Expectations (4)</option>
                        <option>Meets Expectations (3)</option>
                        <option>Needs Improvement (2)</option>
                        <option>Unsatisfactory (1)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryIncrement">Salary Increment (%)</Label>
                      <Input id="salaryIncrement" type="number" placeholder="e.g. 15" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="newDesignation">New Designation (if promoted)</Label>
                      <Input id="newDesignation" placeholder="Leave blank if no promotion" className="border-[#937CB4]/30" />
                    </div>
                  </div>
                </>
              )}
 
              {selectedDocType === "Relieving Letter" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastWorkingDate">Last Working Date</Label>
                      <Input id="lastWorkingDate" type="date" className="border-[#937CB4]/30" />
                    </div>
                    <div>
                      <Label htmlFor="reasonForLeaving">Reason for Leaving</Label>
                      <select id="reasonForLeaving" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] outline-none">
                        <option>Resignation</option>
                        <option>Better Opportunity</option>
                        <option>Personal Reasons</option>
                        <option>Higher Education</option>
                        <option>Relocation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clearanceStatus">Clearance Status</Label>
                    <select id="clearanceStatus" className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] outline-none">
                      <option>All Dues Cleared</option>
                      <option>Pending Clearance</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="conduct">Conduct & Performance Summary</Label>
                    <Textarea id="conduct" rows={2} placeholder="Brief summary..." className="border-[#937CB4]/30" />
                  </div>
                </>
              )}
 
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea id="additionalNotes" rows={2} placeholder="Any additional information..." className="border-[#937CB4]/30" />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-[#937CB4]/20">
            <Button type="button" variant="outline" onClick={() => { setShowCreateModal(false); setSelectedDocType(""); }} className="border-[#937CB4]/30">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
              disabled={!selectedDocType}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function HROrgLeaveManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Leave Management</h2>
          <p className="text-[#5A4079]">Manage organization leave requests</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Leave Request {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}

export function HROrgAttendanceManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Attendance Management</h2>
          <p className="text-[#5A4079]">Monitor organization attendance records</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Record {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}

export function HROrgOnboarding() {
  return <HROnboardingSystem />;
}


export function HROrgSalaries() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Salaries Management</h2>
          <p className="text-[#5A4079]">Manage employee salaries and payroll</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Salary Item {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}


export function HROrgTeamPerformance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Team Performance Management</h2>
          <p className="text-[#5A4079]">Track and analyze team performance</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Performance Metric {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}

export function HROrgSalaryAdvance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileText className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Salaries Advance/Loan Requests</h2>
          <p className="text-[#5A4079]">Review and approve salary advance requests</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Request {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}