import { useState } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Receipt,
  Calendar,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Modal } from "./ui/modal";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

export function FinanceExpense() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("February");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    submittedBy: "",
    receipt: null as File | null,
  });

  const years = ["2026", "2025", "2024"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const categories = [
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

  const [expenses] = useState([
    {
      id: "EXP-2026-001",
      submittedBy: "John Anderson",
      employeeId: "EMP-2024-001",
      category: "Travel & Transportation",
      description: "Flight tickets and hotel accommodation for client meeting in San Francisco",
      amount: 2450,
      date: "2026-02-15",
      month: "February",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-02-16",
      receiptUrl: "receipt-001.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-002",
      submittedBy: "Emily Chen",
      employeeId: "EMP-2024-002",
      category: "Software & Subscriptions",
      description: "Adobe Creative Cloud annual subscription for design team",
      amount: 599,
      date: "2026-02-12",
      month: "February",
      year: "2026",
      status: "pending",
      receiptUrl: "receipt-002.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-003",
      submittedBy: "Michael Davis",
      employeeId: "EMP-2024-003",
      category: "Meals & Entertainment",
      description: "Business lunch with prospective client and stakeholders",
      amount: 185,
      date: "2026-02-18",
      month: "February",
      year: "2026",
      status: "declined",
      declinedBy: "Sarah Mitchell (CFO)",
      declinedDate: "2026-02-19",
      declinedReason: "Missing itemized receipt. Please resubmit with detailed invoice.",
      receiptUrl: null,
      hasReceipt: false,
    },
    {
      id: "EXP-2026-004",
      submittedBy: "Sarah Williams",
      employeeId: "EMP-2024-004",
      category: "Training & Development",
      description: "AWS Cloud Practitioner Certification exam fee and study materials",
      amount: 850,
      date: "2026-02-10",
      month: "February",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-02-11",
      receiptUrl: "receipt-004.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-005",
      submittedBy: "David Brown",
      employeeId: "EMP-2024-005",
      category: "Equipment & Hardware",
      description: "Ergonomic desk chair and dual monitor stand for home office",
      amount: 425,
      date: "2026-02-14",
      month: "February",
      year: "2026",
      status: "pending",
      receiptUrl: "receipt-005.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-006",
      submittedBy: "Lisa Martinez",
      employeeId: "EMP-2024-006",
      category: "Travel & Transportation",
      description: "Uber rides for multiple client site visits throughout the city",
      amount: 145,
      date: "2026-02-17",
      month: "February",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-02-18",
      receiptUrl: "receipt-006.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-007",
      submittedBy: "James Wilson",
      employeeId: "EMP-2024-007",
      category: "Office Supplies",
      description: "Laptop accessories, wireless mouse, and keyboard",
      amount: 230,
      date: "2026-02-16",
      month: "February",
      year: "2026",
      status: "pending",
      receiptUrl: "receipt-007.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-008",
      submittedBy: "Amanda Taylor",
      employeeId: "EMP-2024-008",
      category: "Utilities & Rent",
      description: "Monthly office internet and phone service charges",
      amount: 295,
      date: "2026-02-13",
      month: "February",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-02-14",
      receiptUrl: "receipt-008.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-009",
      submittedBy: "Robert Lee",
      employeeId: "EMP-2024-009",
      category: "Marketing & Advertising",
      description: "Google Ads campaign for Q1 product launch",
      amount: 1850,
      date: "2026-02-11",
      month: "February",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-02-12",
      receiptUrl: "receipt-009.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-010",
      submittedBy: "Jennifer Garcia",
      employeeId: "EMP-2024-010",
      category: "Professional Services",
      description: "Legal consultation for contract review and compliance",
      amount: 750,
      date: "2026-02-09",
      month: "February",
      year: "2026",
      status: "declined",
      declinedBy: "Sarah Mitchell (CFO)",
      declinedDate: "2026-02-10",
      declinedReason: "Requires prior approval from management. Please get authorization before incurring such expenses.",
      receiptUrl: "receipt-010.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-011",
      submittedBy: "John Anderson",
      employeeId: "EMP-2024-001",
      category: "Travel & Transportation",
      description: "Hotel accommodation for tech conference in Boston",
      amount: 980,
      date: "2026-01-22",
      month: "January",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-01-23",
      receiptUrl: "receipt-011.pdf",
      hasReceipt: true,
    },
    {
      id: "EXP-2026-012",
      submittedBy: "Emily Chen",
      employeeId: "EMP-2024-002",
      category: "Software & Subscriptions",
      description: "Figma Professional team subscription",
      amount: 144,
      date: "2026-01-15",
      month: "January",
      year: "2026",
      status: "approved",
      approvedBy: "Sarah Mitchell (CFO)",
      approvedDate: "2026-01-16",
      receiptUrl: "receipt-012.pdf",
      hasReceipt: true,
    },
  ]);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesMonth = exp.month === selectedMonth;
    const matchesYear = exp.year === selectedYear;
    const matchesSearch =
      exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || exp.status === filterStatus;
    const matchesCategory = filterCategory === "all" || exp.category === filterCategory;

    return matchesMonth && matchesYear && matchesSearch && matchesStatus && matchesCategory;
  });

  const monthlyTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedTotal = filteredExpenses
    .filter((exp) => exp.status === "approved")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingTotal = filteredExpenses
    .filter((exp) => exp.status === "pending")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const declinedTotal = filteredExpenses
    .filter((exp) => exp.status === "declined")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const approvedCount = filteredExpenses.filter((exp) => exp.status === "approved").length;
  const pendingCount = filteredExpenses.filter((exp) => exp.status === "pending").length;
  const declinedCount = filteredExpenses.filter((exp) => exp.status === "declined").length;

  const yearlyTotal = expenses
    .filter((exp) => exp.year === selectedYear)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const getStatusBadge = (status: string) => {
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
      default:
        return null;
    }
  };

  const handleCreateExpense = () => {
    console.log("Creating expense:", newExpense);
    setShowCreateModal(false);

    setNewExpense({
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      submittedBy: "",
      receipt: null,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewExpense({ ...newExpense, receipt: e.target.files[0] });
    }
  };

  const handleViewReceipt = (expense: any) => {
    console.log("Viewing receipt for:", expense.id);
    alert(`Viewing receipt: ${expense.receiptUrl}`);
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
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Expense
        </Button>
      </div>

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
            {months.map((month) => (
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
              <p className="text-2xl font-bold text-[#200B43] mt-1">
                ${monthlyTotal.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-green-700 mt-1">
                ${approvedTotal.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">{approvedCount} expenses</p>
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
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                ${pendingTotal.toLocaleString()}
              </p>
              <p className="text-xs text-yellow-600 mt-1">{pendingCount} expenses</p>
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
              <p className="text-2xl font-bold text-red-700 mt-1">
                ${declinedTotal.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 mt-1">{declinedCount} expenses</p>
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
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
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
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">
                  Expense ID
                </th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Submitted By</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Category</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Amount</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Date</th>
                <th className="text-left py-3 px-4 text-white font-semibold text-xs">Status</th>
                <th className="text-center py-3 px-4 text-white font-semibold text-xs">
                  Receipt
                </th>
                <th className="text-center py-3 px-4 text-white font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                    idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                  }`}
                >
                  <td className="py-3 px-4">
                    <p className="text-xs font-semibold text-[#422462]">{expense.id}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-xs font-semibold text-[#200B43]">{expense.submittedBy}</p>
                      <p className="text-[10px] text-[#5A4079]">{expense.employeeId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#F0E9FF] text-[#422462] font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-[#200B43] line-clamp-2 max-w-xs">
                      {expense.description}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-[#200B43]">
                      ${expense.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-[#5A4079]">
                      {new Date(expense.date).toLocaleDateString()}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewExpense({
            category: "",
            description: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            submittedBy: "",
            receipt: null,
          });
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
                  {categories.map((cat) => (
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
              <Input
                type="text"
                placeholder="Employee name"
                value={newExpense.submittedBy}
                onChange={(e) => setNewExpense({ ...newExpense, submittedBy: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
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
            <label className="block text-sm font-medium text-[#422462] mb-2">
              Upload Receipt/Invoice *
            </label>
            <div className="border-2 border-dashed border-[#937CB4]/30 rounded-lg p-6 text-center hover:border-[#422462] transition-colors">
              {newExpense.receipt ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-[#422462]" />
                  <span className="text-sm text-[#200B43] font-medium">
                    {newExpense.receipt.name}
                  </span>
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
                  <p className="text-sm text-[#5A4079] mb-1">
                    Click to upload or drag and drop
                  </p>
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
                setNewExpense({
                  category: "",
                  description: "",
                  amount: "",
                  date: new Date().toISOString().split("T")[0],
                  submittedBy: "",
                  receipt: null,
                });
              }}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateExpense}
              disabled={
                !newExpense.category ||
                !newExpense.amount ||
                !newExpense.description ||
                !newExpense.submittedBy ||
                !newExpense.receipt
              }
              className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
            >
              <Plus className="mr-2 h-4 w-4" />
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
                <h3 className="text-xl font-bold text-[#200B43]">{selectedExpense.id}</h3>
                <p className="text-sm text-[#5A4079] mt-1">{selectedExpense.submittedBy}</p>
                <p className="text-xs text-[#5A4079]">{selectedExpense.employeeId}</p>
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
                  {new Date(selectedExpense.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[#5A4079] font-medium">Description</p>
              <p className="text-sm text-[#200B43]">{selectedExpense.description}</p>
            </div>

            {selectedExpense.status === "approved" && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-700">Approved</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-green-600">Approved By</p>
                    <p className="font-medium text-green-700">{selectedExpense.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Approved Date</p>
                    <p className="font-medium text-green-700">
                      {new Date(selectedExpense.approvedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedExpense.status === "pending" && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <p className="font-semibold text-yellow-700">
                    Pending approval from finance manager
                  </p>
                </div>
              </div>
            )}

            {selectedExpense.status === "declined" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <p className="font-semibold text-red-700">Declined</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-red-600">Declined By</p>
                    <p className="font-medium text-red-700">{selectedExpense.declinedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600">Declined Date</p>
                    <p className="font-medium text-red-700">
                      {new Date(selectedExpense.declinedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600">Reason</p>
                    <p className="font-medium text-red-700">{selectedExpense.declinedReason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-[#5A4079] font-medium">Receipt/Invoice</p>
              {selectedExpense.hasReceipt ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#937CB4]/30 bg-[#F0E9FF]/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-sm font-medium text-[#200B43]">
                        {selectedExpense.receiptUrl}
                      </p>
                      <p className="text-xs text-[#5A4079]">PDF Document</p>
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

            <div className="flex justify-end gap-3 pt-4">
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
        </Modal>
      )}
    </div>
  );
}
