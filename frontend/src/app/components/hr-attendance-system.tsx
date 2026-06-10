import { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle, Search, ChevronLeft, ChevronRight, Download, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { attendanceService, AttendanceRecord, OrgLeaveRecord } from "../services/attendanceService";
import { employeeService, Employee } from "../services/employeeService";

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type DayStatus = "Present" | "Absent" | "Late" | "On Leave" | "Half Day" | "Weekend" | "No Data";

interface DayCell {
  day: number;
  status: DayStatus;
  records: AttendanceRecord[]; // punches that day, if any
  leave?: OrgLeaveRecord;
}

interface EmployeeRow {
  id: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  attendance: DayCell[];
}

interface ModalData {
  employeeId: number;
  day: number;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const fmtTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export function HROrgAttendanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [viewDetailsModal, setViewDetailsModal] = useState<ModalData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [orgId, setOrgId] = useState<number | null>(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

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
    loadMonth(orgId, selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, selectedMonth]);

  // Per-day status, derived from punches + approved leaves:
  // punches win (an employee can work a weekend), then leave, then weekend,
  // then "No Data" for future days / days before joining, else Absent.
  const buildRows = (
    employees: Employee[],
    records: AttendanceRecord[],
    leaves: OrgLeaveRecord[],
    monthStart: Date
  ): EmployeeRow[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // empId|day -> punches
    const byEmpDay = new Map<string, AttendanceRecord[]>();
    records.forEach((rec) => {
      if (!rec.punch_in) return;
      const d = new Date(rec.punch_in);
      if (isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month) return;
      const key = `${rec.empAttendence}|${d.getDate()}`;
      byEmpDay.set(key, [...(byEmpDay.get(key) ?? []), rec]);
    });

    // empId|day -> leave covering that day (clamped to this month)
    const leaveByEmpDay = new Map<string, OrgLeaveRecord>();
    leaves.forEach((leave) => {
      const from = new Date(leave.from_date);
      const to = new Date(leave.to_date || leave.from_date);
      if (isNaN(from.getTime())) return;
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (d.getFullYear() === year && d.getMonth() === month) {
          leaveByEmpDay.set(`${leave.empOnboardingId}|${d.getDate()}`, leave);
        }
      }
    });

    return employees.map((emp) => {
      const joined = emp.date_of_joining ? new Date(emp.date_of_joining) : null;
      const attendance: DayCell[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayRecords = byEmpDay.get(`${emp.id}|${day}`) ?? [];
        const leave = leaveByEmpDay.get(`${emp.id}|${day}`);
        let status: DayStatus;

        if (dayRecords.length > 0) {
          if (dayRecords.every((r) => r.status === "Absent")) status = "Absent";
          else if (dayRecords.some((r) => r.isLate)) status = "Late";
          else if (dayRecords.some((r) => r.status === "Half Day")) status = "Half Day";
          else status = "Present";
        } else if (leave) {
          status = "On Leave";
        } else if (date.getDay() === 0 || date.getDay() === 6) {
          status = "Weekend";
        } else if (date > today || (joined != null && !isNaN(joined.getTime()) && date < joined)) {
          status = "No Data";
        } else {
          status = "Absent";
        }

        attendance.push({ day, status, records: dayRecords, leave });
      }

      return {
        id: emp.id,
        employeeName: emp.emp_name || `Employee #${emp.id}`,
        employeeCode: `EMP-${String(emp.id).padStart(3, "0")}`,
        department: emp.department || "",
        attendance,
      };
    });
  };

  const loadMonth = async (org: number, monthDate: Date) => {
    setLoading(true);
    setError(null);
    const params = { year: monthDate.getFullYear(), month: SHORT_MONTHS[monthDate.getMonth()] };
    try {
      // On-time and late punches live behind separate endpoints (isLate
      // false/true respectively); leaves fail-soft so the grid still renders.
      const [empRes, onTimeRes, lateRes, leaveRes] = await Promise.all([
        employeeService.getEmployeesByOrg(org),
        attendanceService.getMonthlyByOrg(org, params),
        attendanceService.getLateMonthlyByOrg(org, params).catch(() => null),
        attendanceService.getApprovedLeavesByOrg(org, params).catch(() => null),
      ]);
      const empData = Array.isArray(empRes.data) ? empRes.data : empRes.data?.data ?? [];
      const employees = (empData as Employee[]).filter((e) => e.isDelete !== true);
      const records = [
        ...(onTimeRes.data?.usersData ?? []),
        ...(lateRes?.data?.usersData ?? []),
      ];
      const leaves = leaveRes?.data?.leaves ?? [];
      setMonthlyAttendance(buildRows(employees, records, leaves, monthDate));
    } catch (e) {
      console.error("Failed to load attendance", e);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = monthlyAttendance.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      emp.employeeName.toLowerCase().includes(q) ||
      emp.employeeCode.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === "prev" ? -1 : 1));
    setSelectedMonth(newMonth);
  };

  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();

  const handleExport = async () => {
    if (orgId == null) return;
    setExporting(true);
    try {
      const res = await attendanceService.exportByOrg(orgId, {
        year: selectedMonth.getFullYear(),
        month: SHORT_MONTHS[selectedMonth.getMonth()],
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${MONTH_NAMES[selectedMonth.getMonth()]}-${selectedMonth.getFullYear()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export attendance", e);
      alert("Failed to export the attendance report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: DayStatus) => {
    const badges: Record<DayStatus, string> = {
      "Present": "P",
      "Absent": "A",
      "Late": "L",
      "On Leave": "O",
      "Half Day": "H",
      "Weekend": "W",
      "No Data": "-",
    };
    return badges[status] || "-";
  };

  const getStatusColor = (status: DayStatus) => {
    const colors: Record<DayStatus, string> = {
      "Present": "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all",
      "Absent": "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all",
      "Late": "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-all",
      "On Leave": "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all",
      "Half Day": "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all",
      "Weekend": "bg-gray-100 text-gray-500 border border-gray-200",
      "No Data": "bg-gray-50 text-gray-400 border border-gray-100",
    };
    return colors[status] || "bg-gray-100 text-gray-500";
  };

  // Rate counts only days with a verdict (P/L/H/A) — weekends, leaves, future
  // days and pre-joining days don't enter the denominator. Half days = 0.5.
  const getEmployeeStats = (attendance: DayCell[]) => {
    const present = attendance.filter((d) => d.status === "Present").length;
    const absent = attendance.filter((d) => d.status === "Absent").length;
    const late = attendance.filter((d) => d.status === "Late").length;
    const onLeave = attendance.filter((d) => d.status === "On Leave").length;
    const halfDay = attendance.filter((d) => d.status === "Half Day").length;
    const judged = present + late + halfDay + absent;
    const attendanceRate = judged > 0 ? Math.round(((present + late + halfDay * 0.5) / judged) * 100) : 0;

    return { present, absent, late, onLeave, halfDay, judged, attendanceRate };
  };

  return (
    <div className="space-y-4">

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
              {MONTH_NAMES[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting || loading || orgId == null}
          className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50 h-9"
        >
          {exporting ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="mr-2 h-3.5 w-3.5" />
          )}
          Export
        </Button>
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
              onClick={() => loadMonth(orgId, selectedMonth)}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

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

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10 p-3">
          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#422462] mx-auto" />
              <p className="text-xs text-[#5A4079] mt-2">Loading attendance...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="h-8 w-8 text-[#937CB4]/50 mx-auto" />
              <p className="text-sm text-[#5A4079] mt-2">
                {monthlyAttendance.length === 0
                  ? "No employees found for this organization."
                  : "No employees match the current search."}
              </p>
            </div>
          ) : (
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
                              {initialsOf(employee.employeeName)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-[#200B43] truncate">{employee.employeeName}</p>
                              <p className="text-[9px] text-[#5A4079] truncate">{employee.employeeCode}</p>
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
                          {empStats.judged === 0 ? (
                            <span className="text-xs font-bold text-gray-400">—</span>
                          ) : (
                            <span className={`text-xs font-bold ${
                              empStats.attendanceRate >= 95 ? 'text-green-600' :
                              empStats.attendanceRate >= 85 ? 'text-blue-600' :
                              empStats.attendanceRate >= 75 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {empStats.attendanceRate}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewDetailsModal !== null && (() => {
        const employee = monthlyAttendance.find(e => e.id === viewDetailsModal.employeeId);
        const dayData = employee?.attendance.find(a => a.day === viewDetailsModal.day);

        if (!employee || !dayData) return null;

        const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), viewDetailsModal.day);
        const empStats = getEmployeeStats(employee.attendance);
        // earliest punch-in / latest punch-out of the day
        const punches = [...dayData.records].sort(
          (a, b) => new Date(a.punch_in || 0).getTime() - new Date(b.punch_in || 0).getTime()
        );
        const firstIn = punches[0]?.punch_in ?? null;
        const lastOut = punches.reduce<string | null>(
          (acc, r) => (r.punch_out && (!acc || new Date(r.punch_out) > new Date(acc)) ? r.punch_out : acc),
          null
        );
        const duration = punches.map((r) => r.duration).filter(Boolean).join(", ") || "—";

        return (
          <Modal
            isOpen={true}
            onClose={() => setViewDetailsModal(null)}
            title="Attendance Details"
            size="lg"
          >
            <div className="space-y-5">

              <div className="flex items-center gap-4 pb-5 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <span className="relative z-10">{initialsOf(employee.employeeName)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">{employee.employeeName}</h3>
                  <p className="text-sm text-[#5A4079]">
                    {employee.employeeCode}
                    {employee.department ? ` • ${employee.department}` : ""}
                  </p>
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
                      <p className="text-xs text-[#5A4079] font-medium">Duration</p>
                      <p className="text-base font-bold text-[#200B43]">{duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Punch In</p>
                      <p className="text-base font-bold text-green-800">{fmtTime(firstIn)}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-red-600 font-medium">Punch Out</p>
                      <p className="text-base font-bold text-red-800">{fmtTime(lastOut)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {(dayData.status === "Late" || dayData.leave || punches[0]?.location) && (
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/30 p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#200B43] mb-1 text-sm">Remarks</h4>
                      <div className="text-sm text-[#5A4079] leading-relaxed bg-white/50 p-3 rounded-lg space-y-1">
                        {dayData.status === "Late" && <p>Late punch-in.</p>}
                        {dayData.leave && (
                          <p>
                            Approved leave
                            {dayData.leave.leave_type ? ` (${dayData.leave.leave_type})` : ""}
                            {dayData.leave.reason ? ` — ${dayData.leave.reason}` : ""}
                          </p>
                        )}
                        {punches[0]?.location && <p>Location: {punches[0].location}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#200B43] to-[#422462] p-5 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Monthly Performance
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-2xl font-bold text-white">{empStats.present + empStats.late}</p>
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
                      <p className="text-2xl font-bold text-white">{empStats.judged === 0 ? "—" : `${empStats.attendanceRate}%`}</p>
                      <p className="text-xs text-white/90 font-medium">Rate</p>
                    </div>
                  </div>
                </div>
              </div>

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
