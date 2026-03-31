import { useState } from "react";
import { Calendar, Clock, Check, X, AlertCircle, User, Search, ChevronLeft, ChevronRight, Download, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";

interface DayAttendance {
  day: number;
  status: "Present" | "Absent" | "Late" | "On Leave" | "Half Day" | "Weekend";
  loginTime: string;
  logoutTime: string;
  workHours: string;
  remarks?: string;
}

interface EmployeeMonthlyAttendance {
  id: number;
  employeeName: string;
  employeeId: string;
  department: string;
  attendance: DayAttendance[];
}

interface ModalData {
  employeeId: number;
  day: number;
}

export function HROrgAttendanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState(new Date(2024, 1, 1)); // February 2024
  const [viewDetailsModal, setViewDetailsModal] = useState<ModalData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate monthly attendance data for all employees
  const generateMonthlyAttendanceData = (): EmployeeMonthlyAttendance[] => {
    const employees = [
      { id: 1, name: "Alice Johnson", empId: "EMP-001", dept: "Engineering" },
      { id: 2, name: "Bob Smith", empId: "EMP-002", dept: "Marketing" },
      { id: 3, name: "Carol Williams", empId: "EMP-003", dept: "HR" },
      { id: 4, name: "David Lee", empId: "EMP-004", dept: "Finance" },
      { id: 5, name: "Emma Wilson", empId: "EMP-005", dept: "Engineering" },
      { id: 6, name: "Frank Martinez", empId: "EMP-006", dept: "Sales" },
      { id: 7, name: "Grace Taylor", empId: "EMP-007", dept: "Support" },
      { id: 8, name: "Henry Brown", empId: "EMP-008", dept: "Engineering" },
    ];

    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    
    return employees.map((emp) => {
      const attendance: DayAttendance[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
        const dayOfWeek = currentDate.getDay();
        
        // Weekend check (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          attendance.push({
            day,
            status: "Weekend",
            loginTime: "-",
            logoutTime: "-",
            workHours: "-",
          });
          continue;
        }

        // Generate varied attendance patterns
        let status: "Present" | "Absent" | "Late" | "On Leave" | "Half Day" = "Present";
        let loginTime = "09:00 AM";
        let logoutTime = "06:00 PM";
        let workHours = "9.0 hrs";
        let remarks = "";

        // Create realistic patterns
        const rand = (emp.id * day) % 20;
        
        if (rand === 0) {
          status = "Absent";
          loginTime = "-";
          logoutTime = "-";
          workHours = "0 hrs";
          remarks = "Unplanned absence";
        } else if (rand === 1 || rand === 2) {
          status = "On Leave";
          loginTime = "-";
          logoutTime = "-";
          workHours = "0 hrs";
          remarks = "Approved leave";
        } else if (rand === 3) {
          status = "Late";
          loginTime = "10:30 AM";
          logoutTime = "07:00 PM";
          workHours = "8.5 hrs";
          remarks = "Traffic delay";
        } else if (rand === 4) {
          status = "Half Day";
          loginTime = "09:00 AM";
          logoutTime = "01:30 PM";
          workHours = "4.5 hrs";
          remarks = "Medical appointment";
        } else {
          // Vary the login times for present days
          const variation = day % 4;
          if (variation === 0) {
            loginTime = "08:45 AM";
            logoutTime = "05:45 PM";
            workHours = "9.0 hrs";
          } else if (variation === 1) {
            loginTime = "09:00 AM";
            logoutTime = "06:00 PM";
            workHours = "9.0 hrs";
          } else if (variation === 2) {
            loginTime = "09:15 AM";
            logoutTime = "06:15 PM";
            workHours = "9.0 hrs";
          } else {
            loginTime = "08:50 AM";
            logoutTime = "06:30 PM";
            workHours = "9.5 hrs";
          }
        }

        attendance.push({
          day,
          status,
          loginTime,
          logoutTime,
          workHours,
          remarks,
        });
      }

      return {
        id: emp.id,
        employeeName: emp.name,
        employeeId: emp.empId,
        department: emp.dept,
        attendance,
      };
    });
  };

  const monthlyAttendance = generateMonthlyAttendanceData();

  // Filter employees based on search
  const filteredEmployees = monthlyAttendance.filter(emp => 
    emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalOnLeave = 0;
    let totalHalfDay = 0;

    filteredEmployees.forEach(emp => {
      emp.attendance.forEach(day => {
        if (day.status === "Present") totalPresent++;
        else if (day.status === "Absent") totalAbsent++;
        else if (day.status === "Late") totalLate++;
        else if (day.status === "On Leave") totalOnLeave++;
        else if (day.status === "Half Day") totalHalfDay++;
      });
    });

    const workingDays = filteredEmployees.length > 0 ? filteredEmployees[0].attendance.filter(d => d.status !== "Weekend").length : 0;
    const totalWorkingDays = filteredEmployees.length * workingDays;
    const attendanceRate = totalWorkingDays > 0 ? Math.round(((totalPresent + totalLate) / totalWorkingDays) * 100) : 0;

    return {
      total: filteredEmployees.length,
      present: totalPresent,
      absent: totalAbsent,
      late: totalLate,
      onLeave: totalOnLeave,
      halfDay: totalHalfDay,
      attendanceRate,
    };
  };

  const stats = calculateMonthlyStats();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(selectedMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setSelectedMonth(newMonth);
  };

  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      "Present": "P",
      "Absent": "A",
      "Late": "L",
      "On Leave": "O",
      "Half Day": "H",
      "Weekend": "W",
    };
    return badges[status] || "-";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Present": "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all",
      "Absent": "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all",
      "Late": "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-all",
      "On Leave": "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all",
      "Half Day": "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all",
      "Weekend": "bg-gray-100 text-gray-500 border border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-500";
  };

  // Calculate individual employee stats for summary
  const getEmployeeStats = (attendance: DayAttendance[]) => {
    const present = attendance.filter(d => d.status === "Present").length;
    const absent = attendance.filter(d => d.status === "Absent").length;
    const late = attendance.filter(d => d.status === "Late").length;
    const onLeave = attendance.filter(d => d.status === "On Leave").length;
    const halfDay = attendance.filter(d => d.status === "Half Day").length;
    const workingDays = attendance.filter(d => d.status !== "Weekend").length;
    const attendanceRate = workingDays > 0 ? Math.round(((present + late) / workingDays) * 100) : 0;

    return { present, absent, late, onLeave, halfDay, attendanceRate };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <Calendar className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Attendance Management
            </h2>
            <p className="text-[#5A4079] text-sm">Monthly attendance calendar view</p>
          </div>
        </div>
      </div>

      {/* Month Navigation & Actions - Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 h-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-r from-white via-[#F0E9FF]/30 to-white px-6 py-2 shadow-lg">
            <h3 className="text-base font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 h-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 h-9">
          <Download className="mr-2 h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Inline Legend & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-[#5A4079]">Legend:</span>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-green-50 text-green-700 border border-green-200">P</span>
            <span className="text-[10px] text-[#5A4079]">Present</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-red-50 text-red-700 border border-red-200">A</span>
            <span className="text-[10px] text-[#5A4079]">Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-orange-50 text-orange-700 border border-orange-200">L</span>
            <span className="text-[10px] text-[#5A4079]">Late</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-blue-50 text-blue-700 border border-blue-200">O</span>
            <span className="text-[10px] text-[#5A4079]">Leave</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200">H</span>
            <span className="text-[10px] text-[#5A4079]">Half</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded font-semibold text-[9px] bg-gray-100 text-gray-500 border border-gray-200">W</span>
            <span className="text-[10px] text-[#5A4079]">Weekend</span>
          </div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A4079]/50" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 border-[#937CB4]/30 focus:border-[#422462] rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Monthly Attendance Calendar Grid - Compact & Fits Screen */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10 p-3">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#937CB4]/30">
                  <th className="sticky left-0 z-20 bg-gradient-to-r from-white to-[#F0E9FF]/40 backdrop-blur-sm text-left py-2 px-2 border-r border-[#937CB4]/20 min-w-[160px]">
                    <span className="text-xs font-bold text-[#200B43]">Employee</span>
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
                    const dayOfWeek = currentDate.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    
                    return (
                      <th 
                        key={day} 
                        className={`text-center py-1.5 px-0.5 border-r border-[#937CB4]/10 min-w-[28px] ${
                          isWeekend ? 'bg-gray-50/50' : ''
                        }`}
                      >
                        <span className={`text-[10px] font-bold block ${isWeekend ? 'text-gray-500' : 'text-[#200B43]'}`}>
                          {day}
                        </span>
                      </th>
                    );
                  })}
                  <th className="sticky right-0 z-20 bg-gradient-to-l from-white to-[#F0E9FF]/40 backdrop-blur-sm text-center py-2 px-2 border-l border-[#937CB4]/20 min-w-[60px]">
                    <span className="text-xs font-bold text-[#200B43]">Rate</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, idx) => {
                  const empStats = getEmployeeStats(employee.attendance);
                  return (
                    <tr 
                      key={employee.id} 
                      className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                        idx % 2 === 0 ? 'bg-white/40' : 'bg-[#F0E9FF]/10'
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm py-1.5 px-2 border-r border-[#937CB4]/20">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-[10px] shadow-md flex-shrink-0">
                            {employee.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-[#200B43] truncate">{employee.employeeName}</p>
                            <p className="text-[9px] text-[#5A4079] truncate">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      {employee.attendance.map((dayData) => (
                        <td 
                          key={dayData.day} 
                          className="text-center py-1 px-0.5 border-r border-[#937CB4]/5"
                        >
                          <button
                            onClick={() => setViewDetailsModal({ employeeId: employee.id, day: dayData.day })}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold text-[9px] transition-all ${getStatusColor(dayData.status)}`}
                            title={`${dayData.status} - Click for details`}
                          >
                            {getStatusBadge(dayData.status)}
                          </button>
                        </td>
                      ))}
                      <td className="sticky right-0 z-10 bg-white/95 backdrop-blur-sm text-center py-1.5 px-2 border-l border-[#937CB4]/20">
                        <span className={`text-xs font-bold ${
                          empStats.attendanceRate >= 95 ? 'text-green-600' :
                          empStats.attendanceRate >= 85 ? 'text-blue-600' :
                          empStats.attendanceRate >= 75 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {empStats.attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewDetailsModal !== null && (() => {
        const employee = monthlyAttendance.find(e => e.id === viewDetailsModal.employeeId);
        const dayData = employee?.attendance.find(a => a.day === viewDetailsModal.day);
        
        if (!employee || !dayData) return null;
        
        const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), viewDetailsModal.day);
        const empStats = getEmployeeStats(employee.attendance);
        
        return (
          <Modal 
            isOpen={true} 
            onClose={() => setViewDetailsModal(null)} 
            title="Attendance Details" 
            size="lg"
          >
            <div className="space-y-5">
              {/* Employee Information */}
              <div className="flex items-center gap-4 pb-5 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <span className="relative z-10">{employee.employeeName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">{employee.employeeName}</h3>
                  <p className="text-sm text-[#5A4079]">{employee.employeeId} • {employee.department}</p>
                </div>
                <span className={`px-5 py-2 rounded-xl text-sm font-bold shadow-lg ${
                  dayData.status === "Present" 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                    : dayData.status === "Absent"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : dayData.status === "Late"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : dayData.status === "On Leave"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : dayData.status === "Half Day"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                }`}>
                  {dayData.status}
                </span>
              </div>

              {/* Attendance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 to-transparent"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Date</p>
                      <p className="text-base font-bold text-[#200B43]">
                        {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4 shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 to-transparent"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Work Hours</p>
                      <p className="text-base font-bold text-[#200B43]">{dayData.workHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Login Time</p>
                      <p className="text-base font-bold text-green-800">{dayData.loginTime}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-red-600 font-medium">Logout Time</p>
                      <p className="text-base font-bold text-red-800">{dayData.logoutTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {dayData.remarks && (
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/30 p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#200B43] mb-1 text-sm">Remarks</h4>
                      <p className="text-sm text-[#5A4079] leading-relaxed bg-white/50 p-3 rounded-lg">
                        {dayData.remarks}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Monthly Summary */}
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#200B43] to-[#422462] p-5 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Monthly Performance
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-2xl font-bold text-white">{empStats.present}</p>
                      <p className="text-xs text-white/80">Present</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-2xl font-bold text-white">{empStats.absent}</p>
                      <p className="text-xs text-white/80">Absent</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-2xl font-bold text-white">{empStats.onLeave}</p>
                      <p className="text-xs text-white/80">Leave</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-[#937CB4] to-[#5A4079] rounded-xl p-3 shadow-lg">
                      <p className="text-2xl font-bold text-white">{empStats.attendanceRate}%</p>
                      <p className="text-xs text-white/90 font-medium">Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDetailsModal(null)}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] transition-all"
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