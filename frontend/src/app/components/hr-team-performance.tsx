import { useState } from "react";
import {
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  Download,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  Filter,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

export function HRTeamPerformanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState("February 2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPerformance, setFilterPerformance] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"name" | "overall" | "attendance" | "quality" | "productivity">("overall");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const months = [
    "February 2026",
    "January 2026",
    "December 2025",
    "November 2025",
    "October 2025",
    "September 2025",
  ];

 
  const [teamPerformance] = useState([
    {
      id: 1,
      employeeId: "EMP-2024-001",
      name: "Alice Johnson",
      position: "Senior Software Engineer",
      department: "Engineering",
      avatar: "AJ",
      month: "February 2026",
      overallScore: 92,
      trend: "up",
      metrics: {
        attendance: {
          score: 95,
          target: 95,
          details: [
            { label: "Present Days", value: "22/22" },
            { label: "Late Arrivals", value: "0" },
            { label: "Early Departures", value: "0" },
          ],
        },
        workQuality: {
          score: 90,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "48/50" },
            { label: "Error Rate", value: "1.5%" },
            { label: "Client Satisfaction", value: "4.7/5" },
          ],
        },
        productivity: {
          score: 94,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "47/48" },
            { label: "Efficiency Rate", value: "98%" },
            { label: "Output vs Target", value: "115%" },
          ],
        },
        collaboration: {
          score: 88,
          target: 85,
          details: [
            { label: "Team Meetings", value: "12/12" },
            { label: "Peer Feedback", value: "4.5/5" },
            { label: "Knowledge Sharing", value: "10 sessions" },
          ],
        },
        development: {
          score: 92,
          target: 80,
          details: [
            { label: "Training Completed", value: "4/4" },
            { label: "Skills Enhanced", value: "6" },
            { label: "Certifications", value: "2" },
          ],
        },
      },
    },
    {
      id: 2,
      employeeId: "EMP-2024-002",
      name: "Michael Chen",
      position: "Marketing Manager",
      department: "Marketing",
      avatar: "MC",
      month: "February 2026",
      overallScore: 88,
      trend: "up",
      metrics: {
        attendance: {
          score: 90,
          target: 95,
          details: [
            { label: "Present Days", value: "21/22" },
            { label: "Late Arrivals", value: "1" },
            { label: "Early Departures", value: "0" },
          ],
        },
        workQuality: {
          score: 92,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "42/45" },
            { label: "Error Rate", value: "2%" },
            { label: "Client Satisfaction", value: "4.6/5" },
          ],
        },
        productivity: {
          score: 86,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "38/42" },
            { label: "Efficiency Rate", value: "90%" },
            { label: "Output vs Target", value: "105%" },
          ],
        },
        collaboration: {
          score: 90,
          target: 85,
          details: [
            { label: "Team Meetings", value: "12/12" },
            { label: "Peer Feedback", value: "4.7/5" },
            { label: "Knowledge Sharing", value: "8 sessions" },
          ],
        },
        development: {
          score: 82,
          target: 80,
          details: [
            { label: "Training Completed", value: "3/4" },
            { label: "Skills Enhanced", value: "4" },
            { label: "Certifications", value: "1" },
          ],
        },
      },
    },
    {
      id: 3,
      employeeId: "EMP-2024-003",
      name: "Sarah Davis",
      position: "Financial Analyst",
      department: "Finance",
      avatar: "SD",
      month: "February 2026",
      overallScore: 85,
      trend: "up",
      metrics: {
        attendance: {
          score: 88,
          target: 95,
          details: [
            { label: "Present Days", value: "20/22" },
            { label: "Late Arrivals", value: "2" },
            { label: "Early Departures", value: "0" },
          ],
        },
        workQuality: {
          score: 88,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "40/45" },
            { label: "Error Rate", value: "2.5%" },
            { label: "Client Satisfaction", value: "4.4/5" },
          ],
        },
        productivity: {
          score: 82,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "36/40" },
            { label: "Efficiency Rate", value: "88%" },
            { label: "Output vs Target", value: "95%" },
          ],
        },
        collaboration: {
          score: 86,
          target: 85,
          details: [
            { label: "Team Meetings", value: "11/12" },
            { label: "Peer Feedback", value: "4.4/5" },
            { label: "Knowledge Sharing", value: "6 sessions" },
          ],
        },
        development: {
          score: 81,
          target: 80,
          details: [
            { label: "Training Completed", value: "3/4" },
            { label: "Skills Enhanced", value: "3" },
            { label: "Certifications", value: "1" },
          ],
        },
      },
    },
    {
      id: 4,
      employeeId: "EMP-2024-004",
      name: "James Wilson",
      position: "HR Coordinator",
      department: "Human Resources",
      avatar: "JW",
      month: "February 2026",
      overallScore: 78,
      trend: "down",
      metrics: {
        attendance: {
          score: 82,
          target: 95,
          details: [
            { label: "Present Days", value: "19/22" },
            { label: "Late Arrivals", value: "3" },
            { label: "Early Departures", value: "1" },
          ],
        },
        workQuality: {
          score: 75,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "35/45" },
            { label: "Error Rate", value: "4%" },
            { label: "Client Satisfaction", value: "4.0/5" },
          ],
        },
        productivity: {
          score: 76,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "30/35" },
            { label: "Efficiency Rate", value: "82%" },
            { label: "Output vs Target", value: "85%" },
          ],
        },
        collaboration: {
          score: 80,
          target: 85,
          details: [
            { label: "Team Meetings", value: "10/12" },
            { label: "Peer Feedback", value: "4.2/5" },
            { label: "Knowledge Sharing", value: "5 sessions" },
          ],
        },
        development: {
          score: 77,
          target: 80,
          details: [
            { label: "Training Completed", value: "2/4" },
            { label: "Skills Enhanced", value: "3" },
            { label: "Certifications", value: "0" },
          ],
        },
      },
    },
    {
      id: 5,
      employeeId: "EMP-2024-005",
      name: "Emily Martinez",
      position: "Sales Executive",
      department: "Sales",
      avatar: "EM",
      month: "February 2026",
      overallScore: 90,
      trend: "up",
      metrics: {
        attendance: {
          score: 92,
          target: 95,
          details: [
            { label: "Present Days", value: "21/22" },
            { label: "Late Arrivals", value: "1" },
            { label: "Early Departures", value: "0" },
          ],
        },
        workQuality: {
          score: 94,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "46/48" },
            { label: "Error Rate", value: "1%" },
            { label: "Client Satisfaction", value: "4.8/5" },
          ],
        },
        productivity: {
          score: 88,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "42/46" },
            { label: "Efficiency Rate", value: "93%" },
            { label: "Output vs Target", value: "112%" },
          ],
        },
        collaboration: {
          score: 90,
          target: 85,
          details: [
            { label: "Team Meetings", value: "12/12" },
            { label: "Peer Feedback", value: "4.6/5" },
            { label: "Knowledge Sharing", value: "9 sessions" },
          ],
        },
        development: {
          score: 86,
          target: 80,
          details: [
            { label: "Training Completed", value: "3/4" },
            { label: "Skills Enhanced", value: "5" },
            { label: "Certifications", value: "1" },
          ],
        },
      },
    },
    {
      id: 6,
      employeeId: "EMP-2024-006",
      name: "David Brown",
      position: "Product Manager",
      department: "Product",
      avatar: "DB",
      month: "February 2026",
      overallScore: 87,
      trend: "up",
      metrics: {
        attendance: {
          score: 90,
          target: 95,
          details: [
            { label: "Present Days", value: "21/22" },
            { label: "Late Arrivals", value: "1" },
            { label: "Early Departures", value: "0" },
          ],
        },
        workQuality: {
          score: 86,
          target: 85,
          details: [
            { label: "Tasks Completed", value: "41/45" },
            { label: "Error Rate", value: "2.2%" },
            { label: "Client Satisfaction", value: "4.5/5" },
          ],
        },
        productivity: {
          score: 88,
          target: 90,
          details: [
            { label: "Tasks on Time", value: "38/41" },
            { label: "Efficiency Rate", value: "91%" },
            { label: "Output vs Target", value: "102%" },
          ],
        },
        collaboration: {
          score: 84,
          target: 85,
          details: [
            { label: "Team Meetings", value: "11/12" },
            { label: "Peer Feedback", value: "4.3/5" },
            { label: "Knowledge Sharing", value: "7 sessions" },
          ],
        },
        development: {
          score: 87,
          target: 80,
          details: [
            { label: "Training Completed", value: "4/4" },
            { label: "Skills Enhanced", value: "5" },
            { label: "Certifications", value: "2" },
          ],
        },
      },
    },
  ]);

 
  const filteredEmployees = teamPerformance
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        filterDepartment === "all" || emp.department === filterDepartment;

      const matchesPerformance =
        filterPerformance === "all" ||
        (filterPerformance === "excellent" && emp.overallScore >= 90) ||
        (filterPerformance === "good" && emp.overallScore >= 75 && emp.overallScore < 90) ||
        (filterPerformance === "average" && emp.overallScore >= 60 && emp.overallScore < 75) ||
        (filterPerformance === "needs-improvement" && emp.overallScore < 60);

      return matchesSearch && matchesDepartment && matchesPerformance;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "attendance":
          aValue = a.metrics.attendance.score;
          bValue = b.metrics.attendance.score;
          break;
        case "quality":
          aValue = a.metrics.workQuality.score;
          bValue = b.metrics.workQuality.score;
          break;
        case "productivity":
          aValue = a.metrics.productivity.score;
          bValue = b.metrics.productivity.score;
          break;
        default:
          aValue = a.overallScore;
          bValue = b.overallScore;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
 
  const stats = {
    totalEmployees: teamPerformance.length,
    avgScore: Math.round(
      teamPerformance.reduce((sum, emp) => sum + emp.overallScore, 0) / teamPerformance.length
    ),
    excellentPerformers: teamPerformance.filter((emp) => emp.overallScore >= 90).length,
    needsImprovement: teamPerformance.filter((emp) => emp.overallScore < 75).length,
    avgAttendance: Math.round(
      teamPerformance.reduce((sum, emp) => sum + emp.metrics.attendance.score, 0) /
        teamPerformance.length
    ),
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Position",
      "Department",
      "Overall Score",
      "Attendance",
      "Work Quality",
      "Productivity",
      "Collaboration",
      "Development",
    ];
    const rows = filteredEmployees.map((emp) => [
      emp.employeeId,
      emp.name,
      emp.position,
      emp.department,
      emp.overallScore,
      emp.metrics.attendance.score,
      emp.metrics.workQuality.score,
      emp.metrics.productivity.score,
      emp.metrics.collaboration.score,
      emp.metrics.development.score,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `team-performance-${selectedMonth}.csv`;
    link.click();
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <BarChart3 className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Team Performance Management
            </h2>
            <p className="text-[#5A4079] text-sm">
              Monthly performance analysis for all employees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
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
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Average Score</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.avgScore}/100</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Excellent</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.excellentPerformers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">Needs Support</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{stats.needsImprovement}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Avg Attendance</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.avgAttendance}%</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
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
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Human Resources">Human Resources</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPerformance} onValueChange={setFilterPerformance}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
            <SelectValue placeholder="Filter by performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Performance</SelectItem>
            <SelectItem value="excellent">Excellent (90+)</SelectItem>
            <SelectItem value="good">Good (75-89)</SelectItem>
            <SelectItem value="average">Average (60-74)</SelectItem>
            <SelectItem value="needs-improvement">Needs Improvement (&lt;60)</SelectItem>
          </SelectContent>
        </Select>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <table className="w-full table-fixed">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[15%]">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Employee
                    {sortBy === "name" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <span className="text-xs">Department</span>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <button
                    onClick={() => handleSort("overall")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Overall
                    {sortBy === "overall" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <button
                    onClick={() => handleSort("attendance")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Attendance
                    {sortBy === "attendance" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[11%]">
                  <button
                    onClick={() => handleSort("quality")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Work Quality
                    {sortBy === "quality" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <button
                    onClick={() => handleSort("productivity")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Productivity
                    {sortBy === "productivity" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[12%]">
                  <span className="text-xs">Collaboration</span>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <span className="text-xs">Development</span>
                </th>
                <th className="text-center py-3 px-3 text-white font-semibold align-middle w-[12%]">
                  <span className="text-xs">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, idx) => (
                <tr
                  key={employee.id}
                  className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                    idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                  }`}
                >
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                        {employee.avatar}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">
                          {employee.name}
                        </p>
                        <p className="text-[10px] text-[#5A4079] whitespace-nowrap">
                          {employee.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <p className="text-xs text-[#200B43] truncate">{employee.department}</p>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getScoreColor(employee.overallScore)}`}
                      >
                        {employee.overallScore}
                      </span>
                      {employee.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <span className="text-xs font-semibold text-[#200B43]">
                      {employee.metrics.attendance.score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <span className="text-xs font-semibold text-[#200B43]">
                      {employee.metrics.workQuality.score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <span className="text-xs font-semibold text-[#200B43]">
                      {employee.metrics.productivity.score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <span className="text-xs font-semibold text-[#200B43]">
                      {employee.metrics.collaboration.score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <span className="text-xs font-semibold text-[#200B43]">
                      {employee.metrics.development.score}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowDetailsModal(true);
                        }}
                        className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
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
          title="Employee Performance Details"
          size="xl"
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
                  {selectedEmployee.employeeId} • {selectedEmployee.position}
                </p>
                <p className="text-xs text-[#5A4079] mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {selectedEmployee.department} • {selectedEmployee.month}
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${getScoreColor(selectedEmployee.overallScore)}`}
                >
                  {selectedEmployee.overallScore}
                  <span className="text-2xl">/100</span>
                </div>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBgColor(
                    selectedEmployee.overallScore
                  )}`}
                >
                  {getPerformanceLabel(selectedEmployee.overallScore)}
                </span>
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4">
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-[#422462]" />
                  <h4 className="font-bold text-[#200B43]">Attendance & Punctuality</h4>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-[#200B43]">
                    {selectedEmployee.metrics.attendance.score}
                  </span>
                  <span className="text-xs text-[#5A4079]">
                    Target: {selectedEmployee.metrics.attendance.target}
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedEmployee.metrics.attendance.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#5A4079]">{detail.label}</span>
                      <span className="font-semibold text-[#200B43]">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-[#422462]" />
                  <h4 className="font-bold text-[#200B43]">Work Quality</h4>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-[#200B43]">
                    {selectedEmployee.metrics.workQuality.score}
                  </span>
                  <span className="text-xs text-[#5A4079]">
                    Target: {selectedEmployee.metrics.workQuality.target}
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedEmployee.metrics.workQuality.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#5A4079]">{detail.label}</span>
                      <span className="font-semibold text-[#200B43]">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-[#422462]" />
                  <h4 className="font-bold text-[#200B43]">Productivity</h4>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-[#200B43]">
                    {selectedEmployee.metrics.productivity.score}
                  </span>
                  <span className="text-xs text-[#5A4079]">
                    Target: {selectedEmployee.metrics.productivity.target}
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedEmployee.metrics.productivity.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#5A4079]">{detail.label}</span>
                      <span className="font-semibold text-[#200B43]">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-[#422462]" />
                  <h4 className="font-bold text-[#200B43]">Collaboration & Team Work</h4>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-[#200B43]">
                    {selectedEmployee.metrics.collaboration.score}
                  </span>
                  <span className="text-xs text-[#5A4079]">
                    Target: {selectedEmployee.metrics.collaboration.target}
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedEmployee.metrics.collaboration.details.map(
                    (detail: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#5A4079]">{detail.label}</span>
                        <span className="font-semibold text-[#200B43]">{detail.value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
 
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-[#422462]" />
                <h4 className="font-bold text-[#200B43]">Professional Development</h4>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-[#200B43]">
                  {selectedEmployee.metrics.development.score}
                </span>
                <span className="text-xs text-[#5A4079]">
                  Target: {selectedEmployee.metrics.development.target}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {selectedEmployee.metrics.development.details.map((detail: any, idx: number) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs text-[#5A4079] mb-1">{detail.label}</p>
                    <p className="font-bold text-[#200B43]">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="flex justify-end gap-3 pt-2">
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