import { useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

export function HRSalariesManagement() {
  const [selectedMonth, setSelectedMonth] = useState("2024-02");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
 
  const [salaries] = useState([
    {
      id: 1,
      employeeId: "EMP-2024-001",
      name: "Alice Johnson",
      position: "Senior Software Engineer",
      empType: "Full-Time",
      month: "February 2024",
      basicSalary: 70000,
      hra: 14000,
      conveyanceAllowance: 2000,
      medicalAllowance: 1250,
      specialAllowance: 7750,
      providentFund: 8400,
      professionalTax: 200,
      incomeTax: 12000,
      grossSalary: 95000,
      totalDeductions: 20600,
      netSalary: 74400,
      status: "Paid",
      paidDate: "2024-02-28",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 2,
      employeeId: "EMP-2024-002",
      name: "Michael Chen",
      position: "Marketing Manager",
      empType: "Full-Time",
      month: "February 2024",
      basicSalary: 60000,
      hra: 12000,
      conveyanceAllowance: 2000,
      medicalAllowance: 1250,
      specialAllowance: 9750,
      providentFund: 7200,
      professionalTax: 200,
      incomeTax: 9500,
      grossSalary: 85000,
      totalDeductions: 16900,
      netSalary: 68100,
      status: "Paid",
      paidDate: "2024-02-28",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 3,
      employeeId: "EMP-2024-003",
      name: "Sarah Davis",
      position: "Financial Analyst",
      empType: "Full-Time",
      month: "February 2024",
      basicSalary: 55000,
      hra: 11000,
      conveyanceAllowance: 1800,
      medicalAllowance: 1250,
      specialAllowance: 5950,
      providentFund: 6600,
      professionalTax: 200,
      incomeTax: 8000,
      grossSalary: 75000,
      totalDeductions: 14800,
      netSalary: 60200,
      status: "Paid",
      paidDate: "2024-02-28",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 4,
      employeeId: "EMP-2024-004",
      name: "James Wilson",
      position: "HR Coordinator",
      empType: "Contract",
      month: "February 2024",
      basicSalary: 48000,
      hra: 9600,
      conveyanceAllowance: 1600,
      medicalAllowance: 1250,
      specialAllowance: 4550,
      providentFund: 0,
      professionalTax: 200,
      incomeTax: 6000,
      grossSalary: 65000,
      totalDeductions: 6200,
      netSalary: 58800,
      status: "Pending",
      paidDate: null,
      paymentMethod: "Bank Transfer",
    },
    {
      id: 5,
      employeeId: "EMP-2024-005",
      name: "Emily Martinez",
      position: "Sales Executive",
      empType: "Part-Time",
      month: "February 2024",
      basicSalary: 30000,
      hra: 6000,
      conveyanceAllowance: 1200,
      medicalAllowance: 1000,
      specialAllowance: 6800,
      providentFund: 0,
      professionalTax: 200,
      incomeTax: 3500,
      grossSalary: 45000,
      totalDeductions: 3700,
      netSalary: 41300,
      status: "Pending",
      paidDate: null,
      paymentMethod: "Bank Transfer",
    },
    {
      id: 6,
      employeeId: "EMP-2024-006",
      name: "David Brown",
      position: "Product Manager",
      empType: "Full-Time",
      month: "February 2024",
      basicSalary: 75000,
      hra: 15000,
      conveyanceAllowance: 2400,
      medicalAllowance: 1250,
      specialAllowance: 11350,
      providentFund: 9000,
      professionalTax: 200,
      incomeTax: 15000,
      grossSalary: 105000,
      totalDeductions: 24200,
      netSalary: 80800,
      status: "Paid",
      paidDate: "2024-02-28",
      paymentMethod: "Bank Transfer",
    },
  ]);
 
  const filteredSalaries = salaries.filter((salary) => {
    const matchesSearch =
      salary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || salary.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });
 
  const stats = {
    totalEmployees: salaries.length,
    totalPayroll: salaries.reduce((sum, s) => sum + s.netSalary, 0),
    paidCount: salaries.filter((s) => s.status === "Paid").length,
    pendingCount: salaries.filter((s) => s.status === "Pending").length,
    avgSalary: Math.round(salaries.reduce((sum, s) => sum + s.netSalary, 0) / salaries.length),
  };

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Position",
      "Month",
      "Basic Salary",
      "HRA",
      "Gross Salary",
      "Total Deductions",
      "Net Salary",
      "Status",
    ];
    const rows = filteredSalaries.map((s) => [
      s.employeeId,
      s.name,
      s.position,
      s.month,
      s.basicSalary,
      s.hra,
      s.grossSalary,
      s.totalDeductions,
      s.netSalary,
      s.status,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `salaries-${selectedMonth}.csv`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
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
      case "Processing":
        return <AlertCircle className="h-4 w-4" />;
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
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
 
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
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2024-02">February 2024</SelectItem>
                  <SelectItem value="2024-03">March 2024</SelectItem>
                  <SelectItem value="2024-04">April 2024</SelectItem>
                  <SelectItem value="2024-05">May 2024</SelectItem>
                  <SelectItem value="2024-06">June 2024</SelectItem>
                  <SelectItem value="2024-07">July 2024</SelectItem>
                  <SelectItem value="2024-08">August 2024</SelectItem>
                  <SelectItem value="2024-09">September 2024</SelectItem>
                  <SelectItem value="2024-10">October 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
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
            <SelectItem value="processing">Processing</SelectItem>
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
              {filteredSalaries.map((salary, idx) => (
                <tr
                  key={salary.id}
                  className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                    idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                  }`}
                >
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                        {salary.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">
                          {salary.name}
                        </p>
                        <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{salary.employeeId}</p>
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
                    <p className="font-semibold text-[#200B43] text-xs">{formatCurrency(salary.basicSalary)}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="font-semibold text-[#200B43] text-xs">{formatCurrency(salary.grossSalary)}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="font-semibold text-red-600 text-xs">-{formatCurrency(salary.totalDeductions)}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="font-bold text-green-600 text-xs">{formatCurrency(salary.netSalary)}</p>
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
                        className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Slip
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
                {selectedEmployee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-[#5A4079]">
                  {selectedEmployee.employeeId} • {selectedEmployee.position}
                </p>
                <p className="text-xs text-[#5A4079] mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {selectedEmployee.month}
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
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Basic Salary</span>
                    <span className="text-sm font-semibold text-[#200B43]">
                      {formatCurrency(selectedEmployee.basicSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">HRA</span>
                    <span className="text-sm font-semibold text-[#200B43]">
                      {formatCurrency(selectedEmployee.hra)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Conveyance Allowance</span>
                    <span className="text-sm font-semibold text-[#200B43]">
                      {formatCurrency(selectedEmployee.conveyanceAllowance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Medical Allowance</span>
                    <span className="text-sm font-semibold text-[#200B43]">
                      {formatCurrency(selectedEmployee.medicalAllowance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Special Allowance</span>
                    <span className="text-sm font-semibold text-[#200B43]">
                      {formatCurrency(selectedEmployee.specialAllowance)}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-green-700">Gross Salary</span>
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(selectedEmployee.grossSalary)}
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
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Provident Fund (PF)</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(selectedEmployee.providentFund)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Professional Tax</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(selectedEmployee.professionalTax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5A4079]">Income Tax (TDS)</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(selectedEmployee.incomeTax)}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-red-700">Total Deductions</span>
                      <span className="text-lg font-bold text-red-700">
                        {formatCurrency(selectedEmployee.totalDeductions)}
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
                  <p className="text-4xl font-bold text-white mt-1">{formatCurrency(selectedEmployee.netSalary)}</p>
                  {selectedEmployee.paidDate && (
                    <p className="text-white/70 text-xs mt-2">
                      Paid on: {new Date(selectedEmployee.paidDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Payment Method</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.paymentMethod}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Employee Type</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.empType}</p>
              </div>
            </div>
 
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
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
