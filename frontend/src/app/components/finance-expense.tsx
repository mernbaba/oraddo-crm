import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Download,
  Eye,
  FileText,
  Receipt,
  Calendar,
  TrendingUp,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Modal } from "./ui/modal";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { expenseService } from "../services/expenseService";
import { employeeService } from "../services/employeeService";

type UIStatus = "approved" | "pending" | "declined";

interface UIExpense {
  id: number;
  code: string; // synthesized display id, e.g. EXP-0001
  submittedBy: string;
  employeeId: number | null;
  employeeCode: string; // synthesized, e.g. EMP-1
  category: string; // model has no category column; expenseTitle doubles as it
  description: string; // notes
  amount: number;
  date: string; // ISO
  status: UIStatus;
  hasReceipt: boolean;
  receiptUrl: string | null;
  raw: any;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORIES = [
  "Travel & Transportation",
  "Software & Subscriptions",
  "Office Supplies",
  "Meals & Entertainment",
  "Training & Development",
  "Equipment & Hardware",
  "Utilities & Rent",
  "Marketing & Advertising",
  "Professional Services",
  "Other",
];

// DB ENUM ("Pending"|"Approved"|"Declined") <-> the lowercase keys this UI uses.
const toUIStatus = (s?: string): UIStatus =>
  s === "Approved" ? "approved" : s === "Declined" ? "declined" : "pending";
const toDbStatus = (s: UIStatus): "Pending" | "Approved" | "Declined" =>
  s === "approved" ? "Approved" : s === "declined" ? "Declined" : "Pending";

// Map an employee_expenses row from the API into the table's shape.
const mapExpense = (e: any): UIExpense => {
  const emp = e.employee || {};
  const empId = e.employeeid ?? emp.id ?? null;
  return {
    id: e.id,
    code: `EXP-${String(e.id).padStart(4, "0")}`,
    submittedBy: emp.emp_name || "—",
    employeeId: empId,
    employeeCode: empId != null ? `EMP-${empId}` : "—",
    category: e.expenseTitle || "Uncategorized",
    description: e.notes || "",
    amount: Number(e.amount) || 0,
    date: e.date || e.createdAt || "",
    status: toUIStatus(e.status),
    hasReceipt: Boolean(e.receipt) || (Array.isArray(e.expensesdocuments) && e.expensesdocuments.length > 0),
    receiptUrl: e.receipt || null,
    raw: e,
  };
};

const yearOf = (d: string): string => {
  const x = new Date(d);
  return isNaN(x.getTime()) ? "" : String(x.getFullYear());
};
const monthOf = (d: string): string => {
  const x = new Date(d);
  return isNaN(x.getTime()) ? "" : MONTHS[x.getMonth()];
};

export function FinanceExpense() {
  const [orgId, setOrgId] = useState<number | null>(null);

  const [expenses, setExpenses] = useState<UIExpense[]>([]);
  const [employees, setEmployees] = useState<{ id: number; emp_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(() => MONTHS[new Date().getMonth()]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<UIExpense | null>(null);

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    employeeId: "",
    receipt: null as File | null,
  });

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setLoading(false);
      setError("You are not logged in.");
      return;
    }
    try {
      const u = JSON.parse(raw);
      const org = u?.organizationId ?? u?.organizationID;
      if (org != null && org !== "") {
        setOrgId(Number(org));
      } else {
        setLoading(false);
        setError("No organization is linked to your account.");
      }
    } catch {
      setLoading(false);
      setError("Could not read your session. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (orgId == null) return;
    loadExpenses(orgId);
    loadEmployees(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const loadExpenses = async (organizationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await expenseService.getByOrg(organizationId, { page: 0, pageSize: 1000 });
      const rows = res.data?.employeeExpenses ?? (Array.isArray(res.data) ? res.data : []);
      setExpenses((Array.isArray(rows) ? rows : []).map(mapExpense));
    } catch (e) {
      console.error("Failed to load expenses", e);
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (organizationId: number) => {
    try {
      const res = await employeeService.getEmployeesByOrg(organizationId);
      const rows = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setEmployees(
        (rows as any[]).map((r) => ({ id: r.id, emp_name: r.emp_name || `Employee #${r.id}` }))
      );
    } catch (e) {
      console.error("Failed to load employees", e);
    }
  };

  // ── Derived: filters, stats ───────────────────────────────────────────────
  const filteredExpenses = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return expenses.filter((exp) => {
      const matchesMonth = monthOf(exp.date) === selectedMonth;
      const matchesYear = yearOf(exp.date) === selectedYear;
      const matchesSearch =
        !q ||
        exp.code.toLowerCase().includes(q) ||
        exp.submittedBy.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q) ||
        exp.description.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || exp.status === filterStatus;
      const matchesCategory = filterCategory === "all" || exp.category === filterCategory;
      return matchesMonth && matchesYear && matchesSearch && matchesStatus && matchesCategory;
    });
  }, [expenses, selectedMonth, selectedYear, searchQuery, filterStatus, filterCategory]);

  const sum = (list: UIExpense[]) => list.reduce((s, e) => s + e.amount, 0);
  const monthlyTotal = sum(filteredExpenses);
  const approvedList = filteredExpenses.filter((e) => e.status === "approved");
  const pendingList = filteredExpenses.filter((e) => e.status === "pending");
  const declinedList = filteredExpenses.filter((e) => e.status === "declined");
  const approvedTotal = sum(approvedList);
  const pendingTotal = sum(pendingList);
  const declinedTotal = sum(declinedList);

  const yearlyTotal = useMemo(
    () => sum(expenses.filter((e) => yearOf(e.date) === selectedYear)),
    [expenses, selectedYear]
  );

  // Year dropdown: every year present in the data, plus the current year.
  const years = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      const y = yearOf(e.date);
      if (y) set.add(y);
    });
    set.add(String(new Date().getFullYear()));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [expenses]);

  const getStatusBadge = (status: UIStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" />
            Declined
          </span>
        );
    }
  };

  const resetForm = () =>
    setNewExpense({
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      employeeId: "",
      receipt: null,
    });

  const handleCreateExpense = async () => {
    if (orgId == null) {
      alert("No organization found for your session. Please log in again.");
      return;
    }
    // Validate with clear feedback instead of silently disabling the button.
    if (!newExpense.category) {
      alert("Please select a category.");
      return;
    }
    if (!newExpense.amount || Number(newExpense.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!newExpense.employeeId) {
      alert("Please select who submitted this expense.");
      return;
    }
    if (!newExpense.description.trim()) {
      alert("Please enter a description.");
      return;
    }
    setIsSaving(true);
    try {
      await expenseService.create({
        expenseTitle: newExpense.category,
        notes: newExpense.description,
        amount: Number(newExpense.amount) || 0,
        date: newExpense.date,
        status: "Pending",
        organizationID: orgId,
        // Required for the row to appear: the org list inner-joins `employee`.
        employeeid: Number(newExpense.employeeId),
        // Receipts aren't stored server-side yet; keep the filename as a marker.
        receipt: newExpense.receipt ? newExpense.receipt.name : undefined,
      });
      setShowCreateModal(false);
      resetForm();
      await loadExpenses(orgId);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Could not create the expense.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeStatus = async (exp: UIExpense, status: UIStatus) => {
    setBusyId(exp.id);
    // Optimistic update; revert on failure.
    const previous = expenses;
    setExpenses((list) => list.map((e) => (e.id === exp.id ? { ...e, status } : e)));
    setSelectedExpense((cur) => (cur && cur.id === exp.id ? { ...cur, status } : cur));
    try {
      await expenseService.update(exp.id, { status: toDbStatus(status) });
    } catch (e) {
      console.error("Failed to update expense status", e);
      setExpenses(previous);
      alert("Could not update the expense status. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteExpense = async (exp: UIExpense) => {
    if (!confirm(`Delete expense ${exp.code}? This cannot be undone.`)) return;
    setBusyId(exp.id);
    try {
      await expenseService.remove(exp.id);
      setShowDetailsModal(false);
      setSelectedExpense(null);
      if (orgId != null) await loadExpenses(orgId);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Could not delete the expense.");
    } finally {
      setBusyId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewExpense({ ...newExpense, receipt: e.target.files[0] });
    }
  };

  const handleViewReceipt = (expense: UIExpense) => {
    if (expense.receiptUrl && /^https?:\/\//.test(expense.receiptUrl)) {
      window.open(expense.receiptUrl, "_blank");
    } else {
      alert(expense.receiptUrl ? `Receipt: ${expense.receiptUrl}` : "No receipt available.");
    }
  };

  const handleExport = () => {
    const rows = [
      ["Expense ID", "Submitted By", "Category", "Description", "Amount", "Date", "Status"],
      ...filteredExpenses.map((e) => [
        e.code,
        e.submittedBy,
        e.category,
        `"${e.description.replace(/"/g, '""')}"`,
        e.amount,
        e.date ? new Date(e.date).toLocaleDateString() : "",
        e.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${selectedMonth}-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <Receipt className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Expense Management
            </h2>
            <p className="text-[#5A4079] text-sm">
              Track and manage company expenses with yearly overview
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Expense
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          {orgId != null && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => loadExpenses(orgId)}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#422462]" />
          <span className="text-sm font-medium text-[#422462]">Period:</span>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-[#422462]" />
          <span className="text-[#5A4079]">Yearly Total ({selectedYear}):</span>
          <span className="font-bold text-[#200B43] text-lg">${yearlyTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/40 p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-[#5A4079] font-medium">Monthly Total</p>
              <p className="text-2xl font-bold text-[#200B43] mt-1">${monthlyTotal.toLocaleString()}</p>
              <p className="text-xs text-[#5A4079] mt-1">{filteredExpenses.length} expenses</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-700 mt-1">${approvedTotal.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{approvedList.length} expenses</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">${pendingTotal.toLocaleString()}</p>
              <p className="text-xs text-yellow-600 mt-1">{pendingList.length} expenses</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-red-600 font-medium">Declined</p>
              <p className="text-2xl font-bold text-red-700 mt-1">${declinedTotal.toLocaleString()}</p>
              <p className="text-xs text-red-600 mt-1">{declinedList.length} expenses</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]/50" />
          <Input
            placeholder="Search by ID, employee, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-56">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
          onClick={handleExport}
          disabled={filteredExpenses.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Expense ID</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Submitted By</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Category</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Description</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Amount</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Date</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Status</th>
                <th className="text-center py-3 px-4 text-white font-semibold text-xs">Receipt</th>
                <th className="text-center py-3 px-4 text-white font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#5A4079]">
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                    Loading expenses…
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#5A4079]">
                    {expenses.length === 0
                      ? "No expenses yet. Create your first expense to get started."
                      : `No expenses for ${selectedMonth} ${selectedYear}.`}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, idx) => (
                  <tr
                    key={expense.id}
                    className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                      idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-[#422462]">{expense.code}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-xs font-semibold text-[#200B43]">{expense.submittedBy}</p>
                        <p className="text-[10px] text-[#5A4079]">{expense.employeeCode}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#F0E9FF] text-[#422462] font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-[#200B43] line-clamp-2 max-w-xs">{expense.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-bold text-[#200B43]">${expense.amount.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-[#5A4079]">
                        {expense.date ? new Date(expense.date).toLocaleDateString() : "—"}
                      </p>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(expense.status)}</td>
                    <td className="py-3 px-4 text-center">
                      {expense.hasReceipt ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewReceipt(expense)}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-xs text-red-500">No receipt</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setShowDetailsModal(true);
                        }}
                        className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Expense"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#422462] mb-2">Category *</label>
              <Select value={newExpense.category} onValueChange={(val) => setNewExpense({ ...newExpense, category: val })}>
                <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#422462] mb-2">Amount *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#422462] mb-2">Date *</label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#422462] mb-2">Submitted By *</label>
              <Select
                value={newExpense.employeeId}
                onValueChange={(val) => setNewExpense({ ...newExpense, employeeId: val })}
              >
                <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462]">
                  <SelectValue placeholder={employees.length ? "Select employee" : "No employees found"} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.emp_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#422462] mb-2">Description *</label>
            <textarea
              rows={3}
              placeholder="Enter expense description..."
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:outline-none focus:ring-2 focus:ring-[#937CB4]/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#422462] mb-2">Upload Receipt/Invoice</label>
            <div className="border-2 border-dashed border-[#937CB4]/30 rounded-lg p-6 text-center hover:border-[#422462] transition-colors">
              {newExpense.receipt ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-[#422462]" />
                  <span className="text-sm text-[#200B43] font-medium">{newExpense.receipt.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewExpense({ ...newExpense, receipt: null })}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 text-[#5A4079] mx-auto mb-2" />
                  <p className="text-sm text-[#5A4079] mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#5A4079]">PDF, PNG, JPG (max. 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateExpense}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create Expense
            </Button>
          </div>
        </div>
      </Modal>

      {selectedExpense && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedExpense(null);
          }}
          title="Expense Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#937CB4]/20">
              <div>
                <h3 className="text-xl font-bold text-[#200B43]">{selectedExpense.code}</h3>
                <p className="text-sm text-[#5A4079] mt-1">{selectedExpense.submittedBy}</p>
                <p className="text-xs text-[#5A4079]">{selectedExpense.employeeCode}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#200B43] mb-2">
                  ${selectedExpense.amount.toLocaleString()}
                </div>
                {getStatusBadge(selectedExpense.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#5A4079] font-medium">Category</p>
                <p className="text-sm font-semibold text-[#200B43]">{selectedExpense.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#5A4079] font-medium">Date</p>
                <p className="text-sm font-semibold text-[#200B43]">
                  {selectedExpense.date ? new Date(selectedExpense.date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[#5A4079] font-medium">Description</p>
              <p className="text-sm text-[#200B43]">{selectedExpense.description || "—"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#5A4079] font-medium">Receipt/Invoice</p>
              {selectedExpense.hasReceipt ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#937CB4]/30 bg-[#F0E9FF]/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-sm font-medium text-[#200B43]">{selectedExpense.receiptUrl}</p>
                      <p className="text-xs text-[#5A4079]">Attachment</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleViewReceipt(selectedExpense)}
                    className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View Receipt
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                  <p className="text-sm text-red-600">No receipt uploaded</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={busyId === selectedExpense.id}
                onClick={() => handleDeleteExpense(selectedExpense)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                {selectedExpense.status !== "approved" && (
                  <Button
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                    disabled={busyId === selectedExpense.id}
                    onClick={() => handleChangeStatus(selectedExpense, "approved")}
                  >
                    {busyId === selectedExpense.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                )}
                {selectedExpense.status !== "declined" && (
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    disabled={busyId === selectedExpense.id}
                    onClick={() => handleChangeStatus(selectedExpense, "declined")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedExpense(null);
                  }}
                  className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
