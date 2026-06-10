import { useState, useEffect } from "react";
import {
  DollarSign,
  Download,
  Search,
  Eye,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  ChevronDown,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { salaryService, SalaryRecord } from "../services/salaryService";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Money fields are stored as strings in the DB; parse defensively.
const num = (v?: string | number | null): number => {
  const n = parseFloat(String(v ?? ""));
  return isNaN(n) ? 0 : n;
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

interface SalaryRow {
  id: number; // Salary_Management row id
  empId: number;
  employeeCode: string;
  name: string;
  position: string;
  empType: string;
  avatar: string;
  monthLabel: string;
  basic: number;
  gross: number;
  deductions: number;
  net: number;
  status: "Paid" | "Pending";
  record: SalaryRecord;
}

export function HRSalariesManagement() {
  const now = new Date();
  // month is ZERO-based to match the backend filter (DATE_PART = month + 1).
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth()));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryRow | null>(null);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [rows, setRows] = useState<SalaryRow[]>([]);
  const [totals, setTotals] = useState({ employesCount: 0, totalNetPay: 0, approveCount: 0, totalSalaries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const yearOptions = Array.from({ length: 4 }, (_, i) => String(now.getFullYear() - i));

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
    loadSalaries(orgId, Number(selectedYear), Number(selectedMonth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, selectedYear, selectedMonth]);

  // Rows come back as Salary_Management records with the employee nested
  // under `salary_management` (Emp_onboarding).
  const mapRow = (rec: SalaryRecord): SalaryRow => {
    const emp: any = rec.salary_management || {};
    const empId = Number(rec.empOnboardingId ?? emp.id ?? 0);
    const name = emp.emp_name || `Employee #${empId}`;
    return {
      id: Number(rec.id),
      empId,
      employeeCode: `EMP-${String(empId).padStart(3, "0")}`,
      name,
      position: emp.position || "—",
      empType: emp.employee_type || "—",
      avatar: initialsOf(name),
      monthLabel: rec.salary_date
        ? new Date(rec.salary_date).toLocaleString("default", { month: "long", year: "numeric" })
        : `${MONTH_NAMES[Number(selectedMonth)]} ${selectedYear}`,
      basic: num(rec.basic),
      gross: num(rec.gross_pay),
      deductions: num(rec.gross_deduction),
      net: num(rec.net_pay),
      status: rec.isApproved ? "Paid" : "Pending",
      record: rec,
    };
  };

  const loadSalaries = async (org: number, year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await salaryService.getByOrganization(org, { year, month });
      const data = res.data;
      setRows((data?.salaries ?? []).map(mapRow));
      setTotals({
        employesCount: Number(data?.employesCount ?? 0),
        totalNetPay: num(data?.totalNetPay),
        approveCount: Number(data?.approveCount ?? 0),
        totalSalaries: Number(data?.totalSalaries ?? 0),
      });
    } catch (e) {
      console.error("Failed to load salaries", e);
      setError("Failed to load salary records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaries = rows.filter((salary) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      salary.name.toLowerCase().includes(q) ||
      salary.employeeCode.toLowerCase().includes(q) ||
      salary.position.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === "all" || salary.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Server-side aggregates for the selected month (unaffected by the local
  // search/status filters). employesCount is the org's active head-count.
  const stats = {
    totalEmployees: totals.employesCount,
    totalPayroll: totals.totalNetPay,
    paidCount: totals.approveCount,
    pendingCount: Math.max(0, totals.totalSalaries - totals.approveCount),
    avgSalary: totals.totalSalaries ? Math.round(totals.totalNetPay / totals.totalSalaries) : 0,
  };

  const handleApprove = async (row: SalaryRow) => {
    if (orgId == null) return;
    setApprovingId(row.id);
    try {
      await salaryService.approve(row.id);
      await loadSalaries(orgId, Number(selectedYear), Number(selectedMonth));
    } catch (e) {
      console.error("Failed to approve salary", e);
      alert("Failed to approve the salary. Please try again.");
    } finally {
      setApprovingId(null);
    }
  };

  // Server-generated Excel workbook with the full per-field breakdown.
  const handleExport = async () => {
    if (orgId == null) return;
    setExporting(true);
    try {
      const res = await salaryService.exportByOrganization(orgId, {
        year: Number(selectedYear),
        month: Number(selectedMonth),
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `salaries-${MONTH_NAMES[Number(selectedMonth)]}-${selectedYear}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export salaries", e);
      alert("Failed to export the salary report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Per-employee payslip as CSV, same format the employee portal generates.
  const downloadSlip = (row: SalaryRow) => {
    const r = row.record;
    const lines: [string, string | number][] = [
      ["Period", row.monthLabel],
      ["Employee", row.name],
      ["Employee ID", row.employeeCode],
      ["Position", row.position],
      ["Basic", num(r.basic)],
      ["HRA", num(r.HRA_allowances || r.house_rent_allowance)],
      ["Travel Allowance", num(r.travel_allowances)],
      ["Medical Allowance", num(r.medical_allowances)],
      ["Food Allowance", num(r.food_allowances)],
      ["Special Allowance", num(r.special_allowance)],
      ["Performance Incentives", num(r.perfomance_incentives)],
      ["Gross Pay", row.gross],
      ["Professional Tax", num(r.profetional_tax)],
      ["Income Tax (TDS)", num(r.income_tax)],
      ["PF (Employee)", num(r.pf_emp_contribution)],
      ["ESI Contribution", num(r.emp_ESI_contribution)],
      ["Loss of Pay", num(r.loss_of_pay)],
      ["Gross Deductions", row.deductions],
      ["Net Pay", row.net],
      ["Amount in Words", r.amount_in_words || ""],
      ["Working Days", r.working_days || ""],
      ["Status", row.status],
    ];
    const csv =
      `Payslip - ${row.monthLabel}\n` +
      lines.map(([k, v]) => `"${k}","${String(v).replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${row.employeeCode}-${row.monthLabel.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Earnings / deductions line items for the breakdown modal, from the real
  // record. Zero-valued optional lines are hidden; Basic always shows.
  const earningLines = (r: SalaryRecord): [string, number][] => {
    const lines: [string, number][] = [
      ["Basic Salary", num(r.basic)],
      ["HRA", num(r.HRA_allowances || r.house_rent_allowance)],
      ["Travel Allowance", num(r.travel_allowances)],
      ["Medical Allowance", num(r.medical_allowances)],
      ["Food Allowance", num(r.food_allowances)],
      ["Special Allowance", num(r.special_allowance)],
      ["Performance Incentives", num(r.perfomance_incentives)],
      ["Incentives", num(r.insentives)],
      ["PF (Employer)", num(r.pf_employeer_contribution)],
    ];
    return lines.filter(([, v], i) => i === 0 || v !== 0);
  };

  const deductionLines = (r: SalaryRecord): [string, number][] => {
    const lines: [string, number][] = [
      ["Professional Tax", num(r.profetional_tax)],
      ["Income Tax (TDS)", num(r.income_tax)],
      ["PF (Employee)", num(r.pf_emp_contribution)],
      ["ESI Contribution", num(r.emp_ESI_contribution)],
      ["Insurance", num(r.insurance)],
      ["Loss of Pay", num(r.loss_of_pay)],
      ["Other Deductions", num(r.other_deductions)],
    ];
    return lines.filter(([, v]) => v !== 0);
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <DollarSign className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Salaries Management
            </h2>
            <p className="text-[#5A4079] text-sm">Monthly salary details for all employees</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={exporting || loading || rows.length === 0}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] transition-all"
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Report
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
              onClick={() => loadSalaries(orgId, Number(selectedYear), Number(selectedMonth))}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/40 p-5 shadow-md">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-[#422462]" />
          <div className="flex items-center gap-3 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5A4079]">Select Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((name, idx) => (
                    <SelectItem key={name} value={String(idx)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5A4079]">Select Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/40 p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5A4079] font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-[#200B43] mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Total Payroll</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{formatCurrency(stats.totalPayroll)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Paid</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.paidCount}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{stats.pendingCount}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Avg Salary</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(stats.avgSalary)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]/50" />
          <Input
            placeholder="Search by name, ID, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <table className="w-full table-fixed">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[12%]">
                  Employee
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[12%]">
                  Position
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[8%]">
                  Emp Type
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">
                  Basic Salary
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">
                  Gross Salary
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">
                  Deductions
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">
                  Net Salary
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[10%]">
                  Status
                </th>
                <th className="text-center py-3 px-3 text-white font-semibold text-xs align-middle whitespace-nowrap w-[18%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#422462] mx-auto" />
                    <p className="text-xs text-[#5A4079] mt-2">Loading salaries...</p>
                  </td>
                </tr>
              ) : filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <DollarSign className="h-8 w-8 text-[#937CB4]/50 mx-auto" />
                    <p className="text-sm text-[#5A4079] mt-2">
                      {rows.length === 0
                        ? `No salary records for ${MONTH_NAMES[Number(selectedMonth)]} ${selectedYear}.`
                        : "No employees match the current filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((salary, idx) => (
                  <tr
                    key={salary.id}
                    className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                      idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                    }`}
                  >
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                          {salary.avatar}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">
                            {salary.name}
                          </p>
                          <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{salary.employeeCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-medium text-[#200B43] text-xs truncate">{salary.position}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {salary.empType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-semibold text-[#200B43] text-xs">{formatCurrency(salary.basic)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-semibold text-[#200B43] text-xs">{formatCurrency(salary.gross)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-semibold text-red-600 text-xs">-{formatCurrency(salary.deductions)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <p className="font-bold text-green-600 text-xs">{formatCurrency(salary.net)}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(
                          salary.status
                        )}`}
                      >
                        {getStatusIcon(salary.status)}
                        {salary.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmployee(salary);
                            setShowDetailsModal(true);
                          }}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadSlip(salary)}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Slip
                        </Button>
                        {salary.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={approvingId === salary.id}
                            onClick={() => handleApprove(salary)}
                            className="text-green-700 hover:bg-green-50 h-7 px-2 text-xs"
                          >
                            {approvingId === salary.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            Approve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployee && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEmployee(null);
          }}
          title="Salary Details Breakdown"
          size="lg"
        >
          <div className="space-y-6">

            <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-xl">
                {selectedEmployee.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-[#5A4079]">
                  {selectedEmployee.employeeCode} • {selectedEmployee.position}
                </p>
                <p className="text-xs text-[#5A4079] mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {selectedEmployee.monthLabel}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(selectedEmployee.status)}`}>
                {selectedEmployee.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4">
                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Earnings
                </h4>
                <div className="space-y-2">
                  {earningLines(selectedEmployee.record).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs text-[#5A4079]">{label}</span>
                      <span className="text-sm font-semibold text-[#200B43]">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-green-700">Gross Salary</span>
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(selectedEmployee.gross)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4">
                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Deductions
                </h4>
                <div className="space-y-2">
                  {deductionLines(selectedEmployee.record).length === 0 && (
                    <p className="text-xs text-[#5A4079]">No deductions recorded.</p>
                  )}
                  {deductionLines(selectedEmployee.record).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs text-[#5A4079]">{label}</span>
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-red-700">Total Deductions</span>
                      <span className="text-lg font-bold text-red-700">
                        {formatCurrency(selectedEmployee.deductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#200B43] to-[#422462] p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Net Salary (Take Home)</p>
                  <p className="text-4xl font-bold text-white mt-1">{formatCurrency(selectedEmployee.net)}</p>
                  {selectedEmployee.record.amount_in_words && (
                    <p className="text-white/70 text-xs mt-2">
                      {selectedEmployee.record.amount_in_words}
                    </p>
                  )}
                </div>
                <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Employee Type</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.empType}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Working Days</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.record.working_days || "—"}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Leaves</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.record.leaves ?? "—"}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Monthly LOP</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {selectedEmployee.record.monthly_lop ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => downloadSlip(selectedEmployee)}
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Slip
              </Button>
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedEmployee(null);
                }}
                className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
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
