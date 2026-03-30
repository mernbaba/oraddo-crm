import { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { HROnboardingForm } from "./hr-onboarding-form";

export function HROrgOnboarding() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock onboarded employees data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeId: "EMP-2024-001",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Software Engineer",
      joiningDate: "2024-02-01",
      dateOfBirth: "1990-05-15",
      empType: "Full-Time",
      salary: "₹95,000",
      leaveBalance: 18,
      documents: ["Offer Letter", "ID Proof", "Tax Forms", "Bank Details"],
    },
    {
      id: 2,
      employeeId: "EMP-2024-002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 234-5678",
      position: "Marketing Manager",
      joiningDate: "2024-02-05",
      dateOfBirth: "1988-11-22",
      empType: "Full-Time",
      salary: "₹85,000",
      leaveBalance: 15,
      documents: ["Offer Letter", "ID Proof", "Tax Forms"],
    },
    {
      id: 3,
      employeeId: "EMP-2024-003",
      name: "Sarah Davis",
      email: "sarah.davis@company.com",
      phone: "+1 (555) 345-6789",
      position: "Financial Analyst",
      joiningDate: "2024-02-10",
      dateOfBirth: "1992-03-08",
      empType: "Full-Time",
      salary: "₹75,000",
      leaveBalance: 20,
      documents: ["Offer Letter", "ID Proof"],
    },
    {
      id: 4,
      employeeId: "EMP-2024-004",
      name: "James Wilson",
      email: "james.wilson@company.com",
      phone: "+1 (555) 456-7890",
      position: "HR Coordinator",
      joiningDate: "2024-02-15",
      dateOfBirth: "1995-07-30",
      empType: "Contract",
      salary: "₹65,000",
      leaveBalance: 12,
      documents: ["Offer Letter"],
    },
    {
      id: 5,
      employeeId: "EMP-2024-005",
      name: "Emily Martinez",
      email: "emily.martinez@company.com",
      phone: "+1 (555) 567-8901",
      position: "Sales Executive",
      joiningDate: "2024-02-18",
      dateOfBirth: "1993-09-12",
      empType: "Part-Time",
      salary: "₹45,000",
      leaveBalance: 8,
      documents: [],
    },
  ]);

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "",
    religion: "",
    educationQualification: "",
    
    // Family Information
    fatherHusbandName: "",
    fatherHusbandNumber: "",
    motherWifeName: "",
    motherWifeNumber: "",
    
    // Address Information
    currentAddress: "",
    permanentAddress: "",
    city: "",
    
    // ID Proofs
    panNumber: "",
    aadharNumber: "",
    
    // Employment Information
    position: "",
    joiningDate: "",
    empType: "",
    workFromHome: "No",
    leaveBalance: "",
    
    // Account Information
    email: "", // Username/Email
    password: "",
    businessEmail: "",
    personalEmail: "",
    
    // Banking Information
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    pfUanNumber: "",
    
    // Salary (existing)
    salary: "",
  });

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Statistics
  const stats = {
    total: employees.length,
    fullTime: employees.filter((e) => e.empType === "Full-Time").length,
    contract: employees.filter((e) => e.empType === "Contract").length,
    partTime: employees.filter((e) => e.empType === "Part-Time").length,
  };

  const handleCreate = () => {
    const newEmployee = {
      id: employees.length + 1,
      employeeId: `EMP-2024-${String(employees.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email || formData.businessEmail,
      phone: formData.phone,
      position: formData.position,
      joiningDate: formData.joiningDate,
      dateOfBirth: formData.dateOfBirth,
      empType: formData.empType,
      salary: formData.salary,
      leaveBalance: parseInt(formData.leaveBalance) || 0,
      documents: [],
    };
    setEmployees([...employees, newEmployee]);
    setShowCreateModal(false);
    setFormData({
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
      workFromHome: "No",
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
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Phone",
      "Position",
      "Joining Date",
      "Date of Birth",
      "Emp Type",
      "Salary",
      "Leave Balance",
    ];
    const rows = employees.map((emp) => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.phone,
      emp.position,
      emp.joiningDate,
      emp.dateOfBirth,
      emp.empType,
      emp.salary,
      emp.leaveBalance,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `employee-onboarding-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getEmpTypeColor = (type: string) => {
    switch (type) {
      case "Full-Time":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Contract":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Part-Time":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] transition-all"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] transition-all shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
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
              <p className="text-sm text-green-600 font-medium">Full-Time</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.fullTime}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Contract</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{stats.contract}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Part-Time</p>
              <p className="text-3xl font-bold text-orange-700 mt-1">{stats.partTime}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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

      {/* Employees Table */}
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
              {filteredEmployees.map((emp, idx) => (
                <tr
                  key={emp.id}
                  className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                    idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                  }`}
                >
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">{emp.name}</p>
                        <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-xs text-[#200B43] whitespace-nowrap truncate">{emp.email}</p>
                      <p className="text-[10px] text-[#5A4079] whitespace-nowrap">{emp.phone}</p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="font-medium text-[#200B43] text-xs truncate">{emp.position}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="text-xs text-[#200B43]">
                      {new Date(emp.joiningDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="text-xs text-[#200B43]">
                      {new Date(emp.dateOfBirth).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${getEmpTypeColor(
                        emp.empType
                      )}`}
                    >
                      {emp.empType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <p className="font-semibold text-[#200B43] text-xs">{emp.salary}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-[10px] shadow-md flex-shrink-0">
                        {emp.leaveBalance}
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
                      <Button size="sm" variant="ghost" className="text-[#422462] hover:bg-[#F0E9FF] h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 h-7 w-7 p-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Employee Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Employee - Comprehensive Details" size="xl">
        <HROnboardingForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Import Modal */}
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
                <p className="text-sm text-[#5A4079] mt-1">Upload a CSV or Excel file containing employee information</p>
              </div>
              <Button className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#200B43] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#422462]" />
              File Format Requirements
            </h4>
            <div className="space-y-2 text-sm text-[#5A4079]">
              <p>• File should be in CSV or Excel (.xlsx) format</p>
              <p>• Required columns: Name, Email, Phone, Department, Position, Joining Date, Assigned Buddy</p>
              <p>• Maximum file size: 5MB</p>
              <p>• First row should contain column headers</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Download our{" "}
              <a href="#" className="font-semibold underline">
                sample template
              </a>{" "}
              to ensure proper formatting
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(false)}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
            >
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]">
              Upload & Process
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Employee Details Modal */}
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
            {/* Employee Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#937CB4]/20">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-2xl shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">
                  {selectedEmployee.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-[#5A4079]">
                  {selectedEmployee.employeeId} • {selectedEmployee.position}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getStatusColor(
                  selectedEmployee.onboardingStatus
                )}`}
              >
                {selectedEmployee.onboardingStatus}
              </span>
            </div>

            {/* Progress Overview */}
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#200B43] to-[#422462] p-6 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-lg">Onboarding Progress</h4>
                  <span className="text-3xl font-bold text-white">{selectedEmployee.completionPercentage}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all"
                    style={{ width: `${selectedEmployee.completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white/80">
                  {selectedEmployee.tasksCompleted} out of {selectedEmployee.tasksTotal} tasks completed
                </p>
              </div>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Email</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.email}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Phone</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.phone}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Department</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.department}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Joining Date</h4>
                <p className="text-sm font-medium text-[#200B43]">
                  {new Date(selectedEmployee.joiningDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md col-span-2">
                <h4 className="text-xs font-semibold text-[#5A4079] mb-1">Assigned Buddy</h4>
                <p className="text-sm font-medium text-[#200B43]">{selectedEmployee.assignedBuddy}</p>
              </div>
            </div>

            {/* Documents Submitted */}
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/30 p-5 shadow-md">
              <h4 className="font-bold text-[#200B43] mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#422462]" />
                Documents Submitted
              </h4>
              {selectedEmployee.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedEmployee.documents.map((doc: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/60 border border-[#937CB4]/20"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-[#200B43]">{doc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#5A4079]">No documents submitted yet</p>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedEmployee(null);
                }}
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
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