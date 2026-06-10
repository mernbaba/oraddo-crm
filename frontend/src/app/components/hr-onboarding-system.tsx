import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Download,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { HROnboardingForm } from "./hr-onboarding-form";
import { employeeService, Employee } from "../services/employeeService";

const emptyForm = {
  name: "",
  phone: "",
  alternatePhone: "",
  dateOfBirth: "",
  gender: "",
  religion: "",
  educationQualification: "",
  fatherHusbandName: "",
  fatherHusbandNumber: "",
  motherWifeName: "",
  motherWifeNumber: "",
  currentAddress: "",
  permanentAddress: "",
  city: "",
  panNumber: "",
  aadharNumber: "",
  position: "",
  joiningDate: "",
  empType: "",
  wfhDays: "",
  leaveBalance: "",
  email: "",
  password: "",
  businessEmail: "",
  personalEmail: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  pfUanNumber: "",
  salary: "",
  profileImage: null as File | null,
};

type EmployeeForm = typeof emptyForm;

// form field -> Emp_onboarding column. Used for both create and update.
const FIELD_MAP: [keyof EmployeeForm, string][] = [
  ["name", "emp_name"],
  ["phone", "contact_number"],
  ["alternatePhone", "alternative_number"],
  ["dateOfBirth", "date_of_birth"],
  ["gender", "gender"],
  ["religion", "Religion"],
  ["educationQualification", "education_qualification"],
  ["fatherHusbandName", "father_or_husband_name"],
  ["fatherHusbandNumber", "father_or_husband_number"],
  ["motherWifeName", "mother_name"],
  ["motherWifeNumber", "mother_number"],
  ["currentAddress", "current_address"],
  ["permanentAddress", "permanent_address"],
  ["city", "city"],
  ["panNumber", "pancard"],
  ["aadharNumber", "adharnumber"],
  ["position", "position"],
  ["joiningDate", "date_of_joining"],
  ["empType", "employee_type"],
  ["wfhDays", "wfh_bucket"],
  ["leaveBalance", "leave_bucket"],
  ["email", "userName"],
  ["businessEmail", "bussiness_email"],
  ["personalEmail", "personal_email"],
  ["bankAccountNumber", "bank_account"],
  ["bankName", "bank_name"],
  ["ifscCode", "IFSC_code"],
  ["pfUanNumber", "UAN_Number"],
  ["salary", "salary"],
];

const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export function HROrgOnboarding() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [formData, setFormData] = useState<EmployeeForm>({ ...emptyForm });

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
    loadEmployees(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const loadEmployees = async (org: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeeService.getEmployeesByOrg(org);
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      // The endpoint returns soft-deleted rows too — hide them here.
      setEmployees((data as Employee[]).filter((e) => e.isDelete !== true));
    } catch (e) {
      console.error("Failed to load employees", e);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      (emp.emp_name || "").toLowerCase().includes(q) ||
      `emp-${String(emp.id).padStart(3, "0")}`.includes(q) ||
      (emp.bussiness_email || "").toLowerCase().includes(q) ||
      (emp.personal_email || "").toLowerCase().includes(q) ||
      (emp.position || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: employees.length,
    permanent: employees.filter((e) => e.employee_type === "Permanent").length,
    internship: employees.filter((e) => e.employee_type === "Internship").length,
    teamLeads: employees.filter((e) => e.isTeamLead === true).length,
  };

  // Build the multipart body the formidable-parsed endpoints expect.
  // skipEmpty: on update, empty form fields are left out instead of clearing
  // columns (empty strings error on numeric/date/enum columns server-side).
  const buildFormData = (data: EmployeeForm, opts: { includePassword: boolean; skipEmpty: boolean }) => {
    const form = new FormData();
    FIELD_MAP.forEach(([formKey, column]) => {
      const value = data[formKey];
      if (typeof value !== "string") return;
      if (opts.skipEmpty && value === "") return;
      form.append(column, value);
    });
    if (opts.includePassword && data.password) form.append("password", data.password);
    if (orgId != null) form.append("orgnaizationId", String(orgId));
    if (data.profileImage) form.append("image_URL", data.profileImage);
    return form;
  };

  const handleCreate = async () => {
    if (orgId == null) return;
    // The backend hashes the password unconditionally and dedupes on
    // personal_email, so these must be present.
    if (!formData.name || !formData.email || !formData.password) {
      alert("Name, User Name/Email and Password are required.");
      return;
    }
    if (!formData.personalEmail && !formData.businessEmail) {
      alert("Please provide a business or personal email.");
      return;
    }
    if (!formData.personalEmail) {
      formData.personalEmail = formData.businessEmail;
    }
    setSubmitting(true);
    try {
      const res = await employeeService.create(buildFormData(formData, { includePassword: true, skipEmpty: false }));
      if (!res.data?.id) {
        // The create service swallows model validation errors and returns an
        // empty 201 — surface that instead of silently "succeeding".
        alert("The employee may not have been created — please check the form values and the list.");
      }
      setShowCreateModal(false);
      setFormData({ ...emptyForm });
      await loadEmployees(orgId);
    } catch (e: any) {
      console.error("Failed to create employee", e);
      alert(e?.response?.data?.error || e?.response?.data?.message || "Failed to create the employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setFormData({
      ...emptyForm,
      name: emp.emp_name || "",
      phone: emp.contact_number || "",
      alternatePhone: emp.alternative_number || "",
      dateOfBirth: (emp.date_of_birth || "").slice(0, 10),
      gender: emp.gender || "",
      religion: emp.Religion || "",
      educationQualification: emp.education_qualification || "",
      fatherHusbandName: emp.father_or_husband_name || "",
      fatherHusbandNumber: emp.father_or_husband_number || "",
      motherWifeName: emp.mother_name || "",
      motherWifeNumber: emp.mother_number || "",
      currentAddress: emp.current_address || "",
      permanentAddress: emp.permanent_address || "",
      city: emp.city || "",
      panNumber: emp.pancard || "",
      aadharNumber: emp.adharnumber || "",
      position: emp.position || "",
      joiningDate: (emp.date_of_joining || "").slice(0, 10),
      empType: emp.employee_type || "",
      wfhDays: emp.wfh_bucket != null ? String(emp.wfh_bucket) : "",
      leaveBalance: emp.leave_bucket != null ? String(emp.leave_bucket) : "",
      email: emp.userName || "",
      businessEmail: emp.bussiness_email || "",
      personalEmail: emp.personal_email || "",
      bankAccountNumber: emp.bank_account || "",
      bankName: emp.bank_name || "",
      ifscCode: emp.IFSC_code || "",
      pfUanNumber: emp.UAN_Number || "",
      salary: emp.salary != null ? String(emp.salary) : "",
    });
  };

  const handleUpdate = async () => {
    if (orgId == null || editTarget == null) return;
    setSubmitting(true);
    try {
      await employeeService.update(
        editTarget.id,
        buildFormData(formData, { includePassword: false, skipEmpty: true })
      );
      setEditTarget(null);
      setFormData({ ...emptyForm });
      await loadEmployees(orgId);
    } catch (e: any) {
      console.error("Failed to update employee", e);
      alert(e?.response?.data?.error || "Failed to update the employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (orgId == null) return;
    if (!confirm(`Remove ${emp.emp_name || "this employee"} from the organization?`)) return;
    setDeletingId(emp.id);
    try {
      await employeeService.changeStatus(emp.id, true, orgId);
      await loadEmployees(orgId);
    } catch (e: any) {
      console.error("Failed to delete employee", e);
      alert(e?.response?.data?.message || "Failed to remove the employee.");
    } finally {
      setDeletingId(null);
    }
  };

  // Server-generated Excel workbook with every employee field.
  const handleExport = async () => {
    if (orgId == null) return;
    setExporting(true);
    try {
      const res = await employeeService.exportByOrg(orgId);
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employees-${new Date().toISOString().split("T")[0]}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export employees", e);
      alert("Failed to export employees. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (orgId == null || !importFile) return;
    setImporting(true);
    setImportMessage(null);
    try {
      const res = await employeeService.bulkUpload(importFile, orgId);
      setImportMessage({ ok: true, text: res.data?.message || "Employees uploaded successfully." });
      setImportFile(null);
      await loadEmployees(orgId);
    } catch (e: any) {
      console.error("Bulk upload failed", e);
      setImportMessage({
        ok: false,
        text: e?.response?.data?.message || e?.response?.data?.error || "Upload failed. Please check the file.",
      });
    } finally {
      setImporting(false);
    }
  };

  // Column headers must match Emp_onboarding field names — this is what the
  // bulk-upload endpoint inserts verbatim.
  const downloadTemplate = () => {
    const headers = [
      "emp_name", "personal_email", "bussiness_email", "userName", "password",
      "contact_number", "alternative_number", "date_of_birth", "date_of_joining",
      "position", "department", "employee_type", "gender", "salary",
      "leave_bucket", "wfh_bucket", "city", "current_address", "permanent_address",
      "education_qualification", "Religion", "pancard", "adharnumber",
      "bank_account", "bank_name", "IFSC_code", "UAN_Number",
    ];
    const example = [
      "Jane Doe", "jane@personal.com", "jane@company.com", "jane@company.com", "Welcome@123",
      "9876543210", "9876543211", "1995-04-20", "2026-06-01",
      "Software Engineer", "Engineering", "Permanent", "Female", "50000",
      "18", "4", "Bengaluru", "Current address", "Permanent address",
      "B.Tech", "", "ABCDE1234F", "123412341234",
      "00112233445", "HDFC Bank", "HDFC0001234", "",
    ];
    const csv = [headers, example].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEmpTypeColor = (type?: string) => {
    switch (type) {
      case "Permanent":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Internship":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <Users className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Employee Onboarding
            </h2>
            <p className="text-[#5A4079] text-sm">Manage new employee onboarding processes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setImportMessage(null);
              setImportFile(null);
              setShowImportModal(true);
            }}
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] transition-all"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={exporting || loading || employees.length === 0}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] transition-all"
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button
            onClick={() => {
              setFormData({ ...emptyForm });
              setShowCreateModal(true);
            }}
            className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] transition-all shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
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
              onClick={() => loadEmployees(orgId)}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/40 p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079] font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-[#200B43] mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Permanent</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.permanent}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Internship</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{stats.internship}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Team Leads</p>
              <p className="text-3xl font-bold text-orange-700 mt-1">{stats.teamLeads}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]/50" />
          <Input
            placeholder="Search by name, ID, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <table className="w-full table-fixed">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[14%]">Employee</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[14%]">Contact</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[11%]">Job Title</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[9%]">Joining Date</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[9%]">Date of Birth</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[9%]">Emp Type</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[8%]">Salary</th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">Leave Balance</th>
                <th className="text-center py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[16%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#422462] mx-auto" />
                    <p className="text-xs text-[#5A4079] mt-2">Loading employees...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Users className="h-8 w-8 text-[#937CB4]/50 mx-auto" />
                    <p className="text-sm text-[#5A4079] mt-2">
                      {employees.length === 0
                        ? "No employees onboarded yet. Use Add Employee or Import to get started."
                        : "No employees match the current search."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <tr
                    key={emp.id}
                    className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                      idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                    }`}
                  >
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0 overflow-hidden">
                          {emp.image_URL ? (
                            <img src={emp.image_URL} alt={emp.emp_name} className="h-full w-full object-cover" />
                          ) : (
                            initialsOf(emp.emp_name || "")
                          )}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">{emp.emp_name || `Employee #${emp.id}`}</p>
                          <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{`EMP-${String(emp.id).padStart(3, "0")}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="min-w-0 overflow-hidden">
                        <p className="text-xs text-[#200B43] whitespace-nowrap truncate">
                          {emp.bussiness_email || emp.personal_email || "—"}
                        </p>
                        <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{emp.contact_number || "—"}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-medium text-[#200B43] text-xs truncate">{emp.position || "—"}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="text-xs text-[#200B43]">{fmtDate(emp.date_of_joining)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="text-xs text-[#200B43]">{fmtDate(emp.date_of_birth)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${getEmpTypeColor(
                          emp.employee_type
                        )}`}
                      >
                        {emp.employee_type || "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-semibold text-[#200B43] text-xs">
                        {emp.salary != null
                          ? formatCurrency(emp.salary)
                          : emp.stipend != null
                          ? formatCurrency(emp.stipend)
                          : "—"}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-[10px] shadow-md flex-shrink-0">
                          {emp.leave_balance ?? 0}
                        </div>
                        <span className="text-[10px] text-[#5A4079]">days</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setShowViewModal(true);
                          }}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 w-7 p-0"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(emp)}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 w-7 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={deletingId === emp.id}
                          onClick={() => handleDelete(emp)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-600 h-7 w-7 p-0"
                        >
                          {deletingId === emp.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
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

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Employee - Comprehensive Details" size="xl">
        <HROnboardingForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          submitting={submitting}
          mode="create"
        />
      </Modal>

      <Modal
        isOpen={editTarget != null}
        onClose={() => setEditTarget(null)}
        title={`Edit Employee${editTarget?.emp_name ? ` - ${editTarget.emp_name}` : ""}`}
        size="xl"
      >
        <HROnboardingForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onCancel={() => setEditTarget(null)}
          submitting={submitting}
          mode="edit"
        />
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Employees (Bulk Upload)"
        size="lg"
      >
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#937CB4]/40 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-xl">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#200B43]">Upload Employee Data</h4>
                <p className="text-sm text-[#5A4079] mt-1">
                  {importFile
                    ? `Selected: ${importFile.name}`
                    : "Upload a CSV or Excel file containing employee information"}
                </p>
              </div>
              <label className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-md bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] h-9 px-4 text-sm font-medium transition-all">
                <Upload className="h-4 w-4" />
                Choose File
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    setImportFile(e.target.files?.[0] ?? null);
                    setImportMessage(null);
                  }}
                />
              </label>
            </div>
          </div>

          {importMessage && (
            <div
              className={`flex items-center gap-2 p-4 rounded-xl border ${
                importMessage.ok
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {importMessage.ok ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm">{importMessage.text}</p>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-[#200B43] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#422462]" />
              File Format Requirements
            </h4>
            <div className="space-y-2 text-sm text-[#5A4079]">
              <p>• File should be in CSV or Excel (.xlsx / .xls) format</p>
              <p>
                • Column headers must match the system field names — e.g. emp_name, personal_email,
                userName, password, position, employee_type (Permanent/Internship), date_of_joining
              </p>
              <p>• password and personal_email are required for every row</p>
              <p>• First row should contain column headers</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Download our{" "}
              <button onClick={downloadTemplate} className="font-semibold underline">
                sample template
              </button>{" "}
              to ensure proper formatting
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(false)}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
            >
              {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload & Process
            </Button>
          </div>
        </div>
      </Modal>

      {selectedEmployee && (
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEmployee(null);
          }}
          title="Employee Onboarding Details"
          size="xl"
        >
          <div className="space-y-6">

            <div className="flex items-center gap-4 pb-6 border-b border-[#937CB4]/20">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-2xl shadow-xl relative overflow-hidden">
                {selectedEmployee.image_URL ? (
                  <img
                    src={selectedEmployee.image_URL}
                    alt={selectedEmployee.emp_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="relative z-10">{initialsOf(selectedEmployee.emp_name || "")}</span>
                  </>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
                  {selectedEmployee.emp_name || `Employee #${selectedEmployee.id}`}
                </h3>
                <p className="text-sm text-[#5A4079]">
                  {`EMP-${String(selectedEmployee.id).padStart(3, "0")}`} • {selectedEmployee.position || "—"}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getEmpTypeColor(
                  selectedEmployee.employee_type
                )}`}
              >
                {selectedEmployee.employee_type || "—"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Business Email</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.bussiness_email || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Personal Email</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.personal_email || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Contact Number</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.contact_number || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Alternate Number</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.alternative_number || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Department</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.department || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Gender</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.gender || "—"}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Joining Date</h4>
                <p className="text-sm font-medium text-[#200B43]">{fmtDate(selectedEmployee.date_of_joining)}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Date of Birth</h4>
                <p className="text-sm font-medium text-[#200B43]">{fmtDate(selectedEmployee.date_of_birth)}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Salary</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.salary != null
                    ? formatCurrency(selectedEmployee.salary)
                    : selectedEmployee.stipend != null
                    ? `${formatCurrency(selectedEmployee.stipend)} (stipend)`
                    : "—"}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Leave Balance / WFH Days</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.leave_balance ?? 0} days / {selectedEmployee.wfh_bucket ?? 0} days
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md col-span-2">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Current Address</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.current_address || "—"}
                  {selectedEmployee.city ? `, ${selectedEmployee.city}` : ""}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/30 p-5 shadow-md">
              <h4 className="font-bold text-[#200B43] mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#422462]" />
                Banking & ID Details
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">Bank</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.bank_name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">Account No.</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.bank_account || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">IFSC</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.IFSC_code || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">UAN</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.UAN_Number || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">PAN</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.pancard || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4079]">Aadhar</span>
                  <span className="font-medium text-[#200B43]">{selectedEmployee.adharnumber || "—"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedEmployee(null);
                }}
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
