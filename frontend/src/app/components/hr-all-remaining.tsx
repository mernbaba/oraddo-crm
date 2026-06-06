 
import { useState, useEffect } from "react";
import { FileText, Calendar, Clock, Sparkles, Plus, Users, TrendingUp, TrendingDown, DollarSign, Award, Target, Download, CreditCard, Wallet, Receipt, LogOut, X, Send, Upload, Check, AlertCircle, ClipboardList, Info, MessageSquare, Code2, Copy, Loader2 } from "lucide-react";
import { resignationService } from "../services/resignationService";
import { salaryService, SalaryRecord } from "../services/salaryService";
import { performanceService, PerformanceRecord } from "../services/performanceService";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 
export function HRApplyLeave() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const leaveBalance = [
    { type: "Sick Leave", available: 8, total: 12, color: "from-[#422462] to-[#5A4079]" },
    { type: "Casual Leave", available: 5, total: 10, color: "from-[#5A4079] to-[#937CB4]" },
    { type: "Annual Leave", available: 15, total: 20, color: "from-[#937CB4] to-[#422462]" },
    { type: "Maternity Leave", available: 90, total: 90, color: "from-[#422462] to-[#937CB4]" },
  ];

  const recentLeaveHistory = [
    { type: "Sick Leave", fromDate: "2024-01-05", toDate: "2024-01-06", days: 2, status: "Approved", reason: "Medical checkup" },
    { type: "Casual Leave", fromDate: "2023-12-22", toDate: "2023-12-23", days: 2, status: "Approved", reason: "Personal work" },
    { type: "Annual Leave", fromDate: "2023-12-15", toDate: "2023-12-20", days: 6, status: "Approved", reason: "Vacation trip" },
    { type: "Sick Leave", fromDate: "2023-11-28", toDate: "2023-11-28", days: 1, status: "Rejected", reason: "Fever" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-300";
      case "Rejected": return "bg-red-100 text-red-700 border-red-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <FileText className="h-8 w-8 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Apply Leave</h2>
            <p className="text-[#5A4079]">Submit your leave requests</p>
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          onClick={() => setApplyModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </div>
 
      <div>
        <h3 className="text-lg font-semibold text-[#200B43] mb-4">Leave Balance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveBalance.map((leave, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${leave.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative z-10">
                <p className="text-sm text-[#5A4079] mb-2">{leave.type}</p>
                <div className="flex items-end justify-between mb-3">
                  <h3 className="text-3xl font-bold text-[#200B43]">{leave.available}</h3>
                  <span className="text-sm text-[#5A4079]">/ {leave.total} days</span>
                </div>
                <div className="h-2 bg-[#F0E9FF] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${leave.color}`} style={{ width: `${(leave.available / leave.total) * 100}%` }}></div>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <h3 className="text-lg font-semibold text-[#200B43] mb-4">Recent Leave History</h3>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Leave Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">From Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">To Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Days</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Reason</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaveHistory.map((leave, i) => (
                <tr key={i} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/20 transition-colors">
                  <td className="p-4 text-sm text-[#200B43]">{leave.type}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{leave.fromDate}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{leave.toDate}</td>
                  <td className="p-4 text-sm text-[#200B43] font-semibold">{leave.days}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{leave.reason}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title="Apply for Leave" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <select
                id="leaveType"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-white text-[#200B43] focus:outline-none focus:ring-2 focus:ring-[#422462]"
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Annual Leave</option>
                <option>Maternity Leave</option>
              </select>
            </div>
            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input id="days" type="number" placeholder="Enter days" className="border-[#937CB4]/30" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input id="fromDate" type="date" className="border-[#937CB4]/30" />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input id="toDate" type="date" className="border-[#937CB4]/30" />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" rows={4} placeholder="Enter reason for leave" className="border-[#937CB4]/30" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setApplyModalOpen(false)} className="border-[#937CB4]/30">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
 
export function HRLoginDetails() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [showLeaveHistory, setShowLeaveHistory] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: '',
  });
 
  const attendanceData: Record<number, {
    status: 'present' | 'halfday' | 'absent' | 'holiday' | 'weekoff';
    loginTime?: string;
    logoutTime?: string;
    hours?: string;
  }> = {
    1: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
    2: { status: 'present', loginTime: '08:55 AM', logoutTime: '05:45 PM', hours: '8h 50m' },
    3: { status: 'weekoff' },
    4: { status: 'weekoff' },
    5: { status: 'present', loginTime: '09:10 AM', logoutTime: '06:15 PM', hours: '9h 05m' },
    6: { status: 'halfday', loginTime: '09:00 AM', logoutTime: '01:30 PM', hours: '4h 30m' },
    7: { status: 'present', loginTime: '08:50 AM', logoutTime: '06:00 PM', hours: '9h 10m' },
    8: { status: 'absent' },
    9: { status: 'present', loginTime: '09:05 AM', logoutTime: '06:10 PM', hours: '9h 05m' },
    10: { status: 'weekoff' },
    11: { status: 'weekoff' },
    12: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
    13: { status: 'present', loginTime: '08:45 AM', logoutTime: '05:50 PM', hours: '9h 05m' },
    14: { status: 'present', loginTime: '09:15 AM', logoutTime: '06:20 PM', hours: '9h 05m' },
    15: { status: 'holiday' },
    16: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
    17: { status: 'weekoff' },
    18: { status: 'weekoff' },
    19: { status: 'present', loginTime: '08:55 AM', logoutTime: '05:55 PM', hours: '9h 00m' },
    20: { status: 'halfday', loginTime: '09:00 AM', logoutTime: '01:00 PM', hours: '4h 00m' },
    21: { status: 'present', loginTime: '09:05 AM', logoutTime: '06:05 PM', hours: '9h 00m' },
    22: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
    23: { status: 'present', loginTime: '08:50 AM', logoutTime: '06:10 PM', hours: '9h 20m' },
    24: { status: 'weekoff' },
    25: { status: 'weekoff' },
    26: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
    27: { status: 'present', loginTime: '09:10 AM', logoutTime: '06:05 PM', hours: '8h 55m' },
    28: { status: 'present', loginTime: '09:00 AM', logoutTime: '06:00 PM', hours: '9h 00m' },
  };

  const leaveBalance = {
    casual: 12,
    sick: 10,
    annual: 20,
  };

  const leaveHistory = [
    { type: 'Casual Leave', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, status: 'Approved', reason: 'Family function' },
    { type: 'Sick Leave', startDate: '2024-01-08', endDate: '2024-01-09', days: 2, status: 'Approved', reason: 'Medical checkup' },
    { type: 'Annual Leave', startDate: '2023-12-20', endDate: '2023-12-27', days: 8, status: 'Approved', reason: 'Vacation' },
    { type: 'Casual Leave', startDate: '2023-12-15', endDate: '2023-12-15', days: 1, status: 'Rejected', reason: 'Personal work' },
    { type: 'Sick Leave', startDate: '2023-11-28', endDate: '2023-11-29', days: 2, status: 'Approved', reason: 'Fever' },
    { type: 'Annual Leave', startDate: '2023-11-10', endDate: '2023-11-12', days: 3, status: 'Pending', reason: 'Wedding' },
  ];

  const holidays = [
    { name: "New Year's Day", date: "January 1, 2026", day: "Wednesday", type: "Public Holiday" },
    { name: "Republic Day", date: "January 26, 2026", day: "Monday", type: "Public Holiday" },
    { name: "Holi", date: "March 14, 2026", day: "Saturday", type: "Festival" },
    { name: "Good Friday", date: "April 3, 2026", day: "Friday", type: "Public Holiday" },
    { name: "Independence Day", date: "August 15, 2026", day: "Saturday", type: "Public Holiday" },
    { name: "Gandhi Jayanti", date: "October 2, 2026", day: "Friday", type: "Public Holiday" },
    { name: "Diwali", date: "October 21, 2026", day: "Wednesday", type: "Festival" },
    { name: "Christmas Day", date: "December 25, 2026", day: "Friday", type: "Public Holiday" },
  ];

  const stats = {
    present: Object.values(attendanceData).filter(d => d.status === 'present').length,
    halfday: Object.values(attendanceData).filter(d => d.status === 'halfday').length,
    absent: Object.values(attendanceData).filter(d => d.status === 'absent').length,
    holidays: Object.values(attendanceData).filter(d => d.status === 'holiday').length,
    weekoffs: Object.values(attendanceData).filter(d => d.status === 'weekoff').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500 hover:bg-green-600';
      case 'halfday': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'absent': return 'bg-red-500 hover:bg-red-600';
      case 'holiday': return 'bg-blue-500 hover:bg-blue-600';
      case 'weekoff': return 'bg-gray-400 hover:bg-gray-500';
      default: return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Full Day Present';
      case 'halfday': return 'Half Day Present';
      case 'absent': return 'Absent';
      case 'holiday': return 'Holiday';
      case 'weekoff': return 'Week Off';
      default: return 'No Data';
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave application submitted:', formData);
    setShowApplyLeave(false);
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      contactNumber: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div>
            <h2 className="text-3xl font-bold gradient-text">My Attendance & Leave</h2>
            <p className="text-sm text-[#5A4079]">Track attendance, manage leaves</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowLeaveHistory(true)}
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Leave History
          </Button>
          <Button
            onClick={() => setShowHolidays(true)}
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Holidays
          </Button>
          <Button
            onClick={() => setShowApplyLeave(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
 
        <div className="lg:col-span-2 space-y-4">
 
          <div className="grid grid-cols-5 gap-2">
            <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-3 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{stats.present}</span>
                </div>
                <p className="text-xs text-[#5A4079] text-center">Present Days</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-3 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{stats.halfday}</span>
                </div>
                <p className="text-xs text-[#5A4079] text-center">Half Days</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-3 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{stats.absent}</span>
                </div>
                <p className="text-xs text-[#5A4079] text-center">Absent</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-3 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{stats.holidays}</span>
                </div>
                <p className="text-xs text-[#5A4079] text-center">Holidays</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-3 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{stats.weekoffs}</span>
                </div>
                <p className="text-xs text-[#5A4079] text-center">Week Offs</p>
              </div>
            </div>
          </div>
 
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg p-4">
 
            <div className="flex items-center justify-between mb-3">
              <Button
                onClick={previousMonth}
                variant="outline"
                size="sm"
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <h3 className="text-lg font-bold text-[#200B43]">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button
                onClick={nextMonth}
                variant="outline"
                size="sm"
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
              >
                Next
                <Calendar className="h-4 w-4 ml-1" />
              </Button>
            </div>
 
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-1 text-xs font-semibold text-[#422462]">
                  {day}
                </div>
              ))}
            </div>
 
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const attendance = attendanceData[day];
                const hasData = attendance !== undefined;

                return (
                  <div
                    key={day}
                    className="relative aspect-square"
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <div
                      className={`w-full h-full rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        hasData ? getStatusColor(attendance.status) : 'bg-gray-100 hover:bg-gray-200'
                      } ${hasData ? 'text-white' : 'text-gray-400'}`}
                    >
                      <span className="text-sm font-semibold">{day}</span>
                    </div>

                    {hoveredDate === day && hasData && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-[#200B43] text-white rounded-lg shadow-2xl p-3 min-w-[180px] border-2 border-[#937CB4]">
                        <div className="text-xs font-semibold mb-2 text-[#F0E9FF]">
                          {monthNames[currentMonth.getMonth()]} {day}, {currentMonth.getFullYear()}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(attendance.status).split(' ')[0]}`}></span>
                            <span className="font-medium">{getStatusLabel(attendance.status)}</span>
                          </div>
                          {attendance.loginTime && (
                            <>
                              <div className="flex justify-between border-t border-[#937CB4]/30 pt-1 mt-1">
                                <span className="text-[#F0E9FF]/70">Login:</span>
                                <span className="font-semibold">{attendance.loginTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#F0E9FF]/70">Logout:</span>
                                <span className="font-semibold">{attendance.logoutTime}</span>
                              </div>
                              <div className="flex justify-between border-t border-[#937CB4]/30 pt-1 mt-1">
                                <span className="text-[#F0E9FF]/70">Total:</span>
                                <span className="font-semibold text-green-400">{attendance.hours}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-[#200B43]"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
 
            <div className="mt-3 pt-3 border-t border-[#937CB4]/20">
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { status: 'present', label: 'Present' },
                  { status: 'halfday', label: 'Half Day' },
                  { status: 'absent', label: 'Absent' },
                  { status: 'holiday', label: 'Holiday' },
                  { status: 'weekoff', label: 'Week Off' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${getStatusColor(item.status).split(' ')[0]}`}></div>
                    <span className="text-xs text-[#5A4079]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-[#200B43] mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#422462]" />
              Leave Balance
            </h3>
            
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5A4079]">Casual Leave</span>
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">{leaveBalance.casual}</p>
                <p className="text-xs text-[#5A4079]">Days Available</p>
                <div className="mt-2 h-1.5 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5A4079]">Sick Leave</span>
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">{leaveBalance.sick}</p>
                <p className="text-xs text-[#5A4079]">Days Available</p>
                <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5A4079]">Annual Leave</span>
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">{leaveBalance.annual}</p>
                <p className="text-xs text-[#5A4079]">Days Available</p>
                <div className="mt-2 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white shadow-lg p-4">
            <h3 className="text-sm font-semibold text-[#200B43] mb-3">Quick Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5A4079]">Total Working Days:</span>
                <span className="font-semibold text-[#200B43]">20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A4079]">Days Worked:</span>
                <span className="font-semibold text-green-600">{stats.present + stats.halfday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A4079]">Attendance Rate:</span>
                <span className="font-semibold text-[#422462]">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <Modal isOpen={showApplyLeave} onClose={() => setShowApplyLeave(false)} title="Apply for Leave" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaveType">Leave Type *</Label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-white text-[#200B43] focus:outline-none focus:ring-2 focus:ring-[#422462]"
              >
                <option value="">Select Leave Type</option>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="border-[#937CB4]/30"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="border-[#937CB4]/30"
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="border-[#937CB4]/30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Please provide a detailed reason..."
              className="border-[#937CB4]/30"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowApplyLeave(false)}
              className="border-[#937CB4]/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
 
      <Modal isOpen={showLeaveHistory} onClose={() => setShowLeaveHistory(false)} title="Leave History" size="xl">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Leave Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Start Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">End Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Days</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Reason</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, i) => (
                  <tr key={i} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/20 transition-colors">
                    <td className="p-4 text-sm text-[#200B43] font-medium">{leave.type}</td>
                    <td className="p-4 text-sm text-[#5A4079]">{leave.startDate}</td>
                    <td className="p-4 text-sm text-[#5A4079]">{leave.endDate}</td>
                    <td className="p-4 text-sm text-[#200B43] font-semibold">{leave.days}</td>
                    <td className="p-4 text-sm text-[#5A4079]">{leave.reason}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLeaveStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
 
      <Modal isOpen={showHolidays} onClose={() => setShowHolidays(false)} title="Company Holidays 2026" size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {holidays.map((holiday, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF]/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center flex-shrink-0 mb-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#200B43] mb-2 line-clamp-2">{holiday.name}</h3>
                  <p className="text-xs text-[#5A4079] mb-1">{holiday.date}</p>
                  <p className="text-xs text-[#958CA7] mb-2">{holiday.day}</p>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30">
                    {holiday.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
 
export function HRCompanyCalendar() {
  const holidays = [
    { name: "New Year's Day", date: "January 1, 2024", type: "Public Holiday" },
    { name: "Independence Day", date: "July 4, 2024", type: "Public Holiday" },
    { name: "Christmas Day", date: "December 25, 2024", type: "Public Holiday" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Company Calendar</h2>
          <p className="text-[#5A4079]">View company holidays and events</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {holidays.map((holiday, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#200B43] mb-1">{holiday.name}</h3>
                <p className="text-sm text-[#5A4079] mb-2">{holiday.date}</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30">{holiday.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export function HRHolidayList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Holiday List</h2>
          <p className="text-[#5A4079]">Annual company holidays</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Holiday {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}
  
export function HRPerformanceMetrics() {
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState<number | null>(null);
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u?.id != null) setEmpId(Number(u.id));
      } catch {
        // ignore malformed session
      }
    }
  }, []);

  useEffect(() => {
    if (empId == null) return;
    fetchPerformance(empId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId]);

  const fetchPerformance = async (id: number) => {
    setLoading(true);
    try {
      const res = await performanceService.getByEmployee(id);
      const list = Array.isArray(res.data) ? res.data : [];
      setRecords(list);
      setSelectedId(list.length ? list[0].id : null);
    } catch (error) {
      console.error("Error fetching performance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPeriod = (date?: string) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Rating fields may hold a numeric score ("85") or a text label; parse defensively.
  const parseScore = (v?: string): number | null => {
    if (v == null || v === "") return null;
    const n = parseFloat(String(v));
    return isNaN(n) ? null : Math.max(0, Math.min(100, n));
  };

  const selectedRecord = records.find((r) => r.id === selectedId) || null;

  const METRIC_DEFS: { key: keyof PerformanceRecord; category: string; color: string; icon: any }[] = [
    { key: "work_perfomance", category: "Work Performance", color: "from-[#422462] to-[#5A4079]", icon: Target },
    { key: "availability", category: "Availability", color: "from-[#5A4079] to-[#937CB4]", icon: Clock },
    { key: "behaviour", category: "Behaviour", color: "from-[#937CB4] to-[#422462]", icon: Users },
    { key: "team_performance1", category: "Team Performance I", color: "from-[#422462] to-[#937CB4]", icon: TrendingUp },
    { key: "team_performance2", category: "Team Performance II", color: "from-[#5A4079] to-[#422462]", icon: Award },
  ];

  const performanceMetrics = selectedRecord
    ? METRIC_DEFS.map((def) => ({
        category: def.category,
        color: def.color,
        icon: def.icon,
        rawValue: (selectedRecord[def.key] as string) || "",
        score: parseScore(selectedRecord[def.key] as string),
        target: 80,
      })).filter((m) => m.rawValue !== "")
    : [];

  const numericScores = performanceMetrics
    .map((m) => m.score)
    .filter((s): s is number => s != null);
  const overallScore = numericScores.length
    ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length)
    : 0;

  // Trend = this record's overall vs the next (older) record in the list.
  const selectedIndex = records.findIndex((r) => r.id === selectedId);
  const prevRecord =
    selectedIndex >= 0 && selectedIndex < records.length - 1
      ? records[selectedIndex + 1]
      : null;
  const prevScores = prevRecord
    ? METRIC_DEFS.map((d) => parseScore(prevRecord[d.key] as string)).filter(
        (s): s is number => s != null
      )
    : [];
  const prevOverall = prevScores.length
    ? Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length)
    : null;
  const trend: "up" | "down" =
    prevOverall == null || overallScore >= prevOverall ? "up" : "down";

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <TrendingUp className="h-8 w-8 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">My Performance Metrics</h2>
            <p className="text-[#5A4079]">Track your monthly performance and achievements</p>
          </div>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#422462]">Period:</label>
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-[#937CB4]/30 bg-white/90 text-[#422462] font-medium focus:outline-none focus:ring-2 focus:ring-[#937CB4]/50"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>{formatPeriod(r.date)}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-[#422462] animate-spin" />
        </div>
      )}

      {!loading && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[#937CB4]/20">
          <div className="bg-[#F0E9FF] p-4 rounded-full mb-4">
            <TrendingUp className="h-12 w-12 text-[#5A4079] opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-[#200B43] mb-2">No performance records yet</h3>
          <p className="text-[#5A4079] max-w-sm">
            Your performance reviews will appear here once your manager publishes them.
          </p>
        </div>
      )}

      {!loading && selectedRecord && (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-[#937CB4]/30 bg-gradient-to-br from-white via-[#F0E9FF]/20 to-white backdrop-blur-xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#200B43] mb-2">Overall Performance Score</h3>
                  <p className="text-2xl font-bold text-[#200B43]">{formatPeriod(selectedRecord.date)}</p>
                  {(selectedRecord.position || selectedRecord.department) && (
                    <p className="text-sm text-[#5A4079] mt-1">
                      {[selectedRecord.position, selectedRecord.department].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                      <span className="text-2xl">/100</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 justify-center">
                      {trend === "up" ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Improving</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">Declining</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative h-32 w-32">
                    <svg className="transform -rotate-90" width="128" height="128">
                      <circle cx="64" cy="64" r="56" stroke="#F0E9FF" strokeWidth="12" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(overallScore / 100) * 351.68} 351.68`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#422462" />
                          <stop offset="100%" stopColor="#937CB4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const hasScore = metric.score != null;
              const isAboveTarget = hasScore && (metric.score as number) >= metric.target;
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0E9FF]/30 via-transparent to-[#F0E9FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#200B43] text-xl mb-1">{metric.category}</h3>
                          {hasScore && <p className="text-sm text-[#5A4079]">Target: {metric.target}%</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        {hasScore ? (
                          <>
                            <div className={`text-4xl font-bold ${getScoreColor(metric.score as number)}`}>
                              {metric.score}
                            </div>
                            <div className="text-sm text-[#5A4079]">/ 100</div>
                          </>
                        ) : (
                          <div className="px-3 py-1 rounded-full text-sm font-medium bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30">
                            {metric.rawValue}
                          </div>
                        )}
                      </div>
                    </div>

                    {hasScore && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-[#5A4079]">Performance</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${isAboveTarget ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {isAboveTarget ? '✓ Above Target' : '⚠ Below Target'}
                          </span>
                        </div>
                        <div className="h-4 bg-[#F0E9FF]/50 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-1000 rounded-full relative`}
                            style={{ width: `${metric.score}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedRecord.comments && (
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF]/30 backdrop-blur-xl p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#937CB4]/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <h3 className="text-xl font-bold text-[#200B43] mb-4">Reviewer Comments</h3>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="h-6 w-6 rounded-full bg-[#422462] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm text-[#5A4079]">{selectedRecord.comments}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
export function HRLearningDevelopment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Learning & Development</h2>
          <p className="text-[#5A4079]">Enhance your skills and knowledge</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Course {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}
 
export function HRBenefitsCompensation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Benefits & Compensation</h2>
          <p className="text-[#5A4079]">View your compensation and benefits package</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Benefit {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}
 
export function HRSalaryAdvance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Salary Advance</h2>
          <p className="text-[#5A4079]">Request advance on your salary</p>
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


export function HRSalaryStructure() {
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [empId, setEmpId] = useState<number | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [advanceFormData, setAdvanceFormData] = useState({
    amount: '',
    reason: '',
    repaymentMonths: '3',
    urgency: 'normal'
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u?.id != null) setEmpId(Number(u.id));
        if (u?.organizationId != null) setOrgId(Number(u.organizationId));
      } catch {
        // ignore malformed session
      }
    }
  }, []);

  useEffect(() => {
    if (empId == null) return;
    fetchSalaries(empId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId]);

  const fetchSalaries = async (id: number) => {
    setLoading(true);
    try {
      const res = await salaryService.getByEmployee(id);
      setSalaries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const num = (v: any) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const salaryData = salaries.map((s) => {
    const d = s.salary_date ? new Date(s.salary_date) : null;
    const label = d && !isNaN(d.getTime())
      ? `${MONTHS_SHORT[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`
      : "—";
    const gross = num(s.gross_pay) || num(s.basic);
    const net = num(s.net_pay);
    const deductions = num(s.gross_deduction) || Math.max(0, gross - net);
    return { month: label, salary: gross, netPay: net, deductions, record: s };
  });

  const totalEarnings = salaryData.reduce((sum, i) => sum + i.salary, 0);
  const totalNetPay = salaryData.reduce((sum, i) => sum + i.netPay, 0);
  const totalDeductions = salaryData.reduce((sum, i) => sum + i.deductions, 0);

  const latestNet = salaryData.length ? salaryData[salaryData.length - 1].netPay : 0;
  const maxAdvance = Math.round(latestNet * 0.5);

  const lastDate = salaries.length ? salaries[salaries.length - 1].salary_date : null;
  const currentYear = lastDate && !isNaN(new Date(lastDate).getTime())
    ? new Date(lastDate).getFullYear()
    : new Date().getFullYear();

  const handleAdvanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceFormData.amount || !advanceFormData.reason) {
      alert("Please enter an amount and a reason.");
      return;
    }
    setSubmitting(true);
    try {
      await salaryService.createAdvance({
        amount_request: parseFloat(advanceFormData.amount),
        reason: advanceFormData.reason,
        request_type: "Salary Advance",
        status: "Pending",
        date_of_request: new Date().toISOString(),
        comments: `Repayment: ${advanceFormData.repaymentMonths} month(s); Urgency: ${advanceFormData.urgency}`,
        empOnboardingId: empId ?? undefined,
        organizationId: orgId ?? undefined,
      });
      alert("Salary advance request submitted! 💸");
      setShowAdvanceModal(false);
      setAdvanceFormData({ amount: '', reason: '', repaymentMonths: '3', urgency: 'normal' });
    } catch (error) {
      console.error("Error submitting advance request:", error);
      alert("Failed to submit salary advance request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdvanceFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadPayslip = (item: { month: string; salary: number; netPay: number; deductions: number; record: SalaryRecord }) => {
    const r = item.record;
    const rows: [string, string | number][] = [
      ["Period", item.month],
      ["Basic", num(r.basic)],
      ["Gross Pay", item.salary],
      ["HRA", num(r.HRA_allowances || r.house_rent_allowance)],
      ["Travel Allowance", num(r.travel_allowances)],
      ["Medical Allowance", num(r.medical_allowances)],
      ["Special Allowance", num(r.special_allowance)],
      ["Professional Tax", num(r.profetional_tax)],
      ["PF (Employee)", num(r.pf_emp_contribution)],
      ["Gross Deductions", item.deductions],
      ["Net Pay", item.netPay],
      ["Amount in Words", r.amount_in_words || ""],
      ["Working Days", r.working_days || ""],
      ["Status", r.isApproved ? "Approved" : "Pending"],
    ];
    const csv = "Payslip - " + item.month + "\n" + rows.map(([k, v]) => `"${k}","${v}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${item.month.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div>
            <h2 className="text-3xl font-bold gradient-text">My Salary Structure</h2>
            <p className="text-[#5A4079]">View your salary breakdown and manage advance requests</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAdvanceModal(true)}
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Salary Advance
        </Button>
      </div>

      {!loading && salaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Gross (YTD)", value: totalEarnings, gradient: "from-[#422462] to-[#5A4079]" },
            { label: "Total Net Pay (YTD)", value: totalNetPay, gradient: "from-[#5A4079] to-[#937CB4]" },
            { label: "Total Deductions (YTD)", value: totalDeductions, gradient: "from-[#937CB4] to-[#5A4079]" },
          ].map((c, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-5`}></div>
              <p className="text-sm text-[#5A4079] mb-1 relative z-10">{c.label}</p>
              <h3 className="text-2xl font-bold text-[#200B43] relative z-10">₹{c.value.toLocaleString()}</h3>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-[#422462] animate-spin" />
        </div>
      )}

      {!loading && salaries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[#937CB4]/20">
          <div className="bg-[#F0E9FF] p-4 rounded-full mb-4">
            <DollarSign className="h-12 w-12 text-[#5A4079] opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-[#200B43] mb-2">No salary records yet</h3>
          <p className="text-[#5A4079] max-w-sm">
            Your monthly payslips will appear here once HR processes your salary.
          </p>
        </div>
      )}

      {!loading && salaries.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#200B43] mb-2">Monthly Salary Overview - {currentYear}</h3>
            <p className="text-sm text-[#5A4079]">Click any month below to download that month's payslip</p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <defs>
                  <linearGradient id="salaryColorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#422462" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5A4079" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="salaryColorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#937CB4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5A4079" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                <XAxis dataKey="month" stroke="#5A4079" style={{ fontSize: '12px' }} />
                <YAxis stroke="#5A4079" style={{ fontSize: '12px' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(240, 233, 255, 0.95)', border: '1px solid #937CB4', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="salary" name="Gross Salary" fill="url(#salaryColorGross)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="netPay" name="Net Salary" fill="url(#salaryColorNet)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${salaryData.length}, minmax(0, 1fr))` }}>
            {salaryData.map((item, index) => (
              <button
                key={index}
                onClick={() => downloadPayslip(item)}
                className="group flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-gradient-to-br hover:from-[#F0E9FF] hover:to-white transition-all duration-300 hover:shadow-lg"
                title={`Download ${item.month} payslip`}
              >
                <Download className="h-4 w-4 text-[#422462] group-hover:text-[#5A4079] transition-colors" />
                <span className="text-[10px] text-[#5A4079]">{item.month}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'linear-gradient(to bottom, #422462 0%, rgba(90, 64, 121, 0.8) 100%)' }}></div>
              <span className="text-sm text-[#5A4079] font-medium">Gross Salary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'linear-gradient(to bottom, #937CB4 0%, rgba(90, 64, 121, 0.6) 100%)' }}></div>
              <span className="text-sm text-[#5A4079] font-medium">Net Salary</span>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showAdvanceModal} onClose={() => setShowAdvanceModal(false)} title="Apply for Salary Advance / Loan" size="lg">
        <form onSubmit={handleAdvanceSubmit} className="space-y-4">
          <div className="bg-[#F0E9FF] p-4 rounded-lg mb-4">
            <p className="text-sm text-[#5A4079]">
              <strong className="text-[#422462]">Note:</strong>{" "}
              {maxAdvance > 0
                ? `Maximum advance amount is 50% of your latest net salary (₹${maxAdvance.toLocaleString()}).`
                : "Your request will be reviewed against your salary details by HR."}{" "}
              Approval time: 2-3 business days.
            </p>
          </div>

          <div>
            <Label htmlFor="amount">Advance Amount (₹) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={advanceFormData.amount}
              onChange={handleAdvanceChange}
              placeholder={maxAdvance > 0 ? `Enter amount (Max: ₹${maxAdvance.toLocaleString()})` : "Enter advance amount"}
              className="border-[#937CB4]/30"
            />
          </div>

          <div>
            <Label htmlFor="repaymentMonths">Repayment Period *</Label>
            <select
              id="repaymentMonths"
              name="repaymentMonths"
              value={advanceFormData.repaymentMonths}
              onChange={handleAdvanceChange}
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-white text-[#200B43] focus:outline-none focus:ring-2 focus:ring-[#422462]"
            >
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="4">4 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level *</Label>
            <select
              id="urgency"
              name="urgency"
              value={advanceFormData.urgency}
              onChange={handleAdvanceChange}
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-white text-[#200B43] focus:outline-none focus:ring-2 focus:ring-[#422462]"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Advance *</Label>
            <textarea
              id="reason"
              name="reason"
              value={advanceFormData.reason}
              onChange={handleAdvanceChange}
              rows={4}
              placeholder="Please provide a detailed reason for your salary advance request..."
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-white text-[#200B43] focus:outline-none focus:ring-2 focus:ring-[#422462] resize-none"
            />
          </div>

          {advanceFormData.amount && (
            <div className="p-4 bg-gradient-to-br from-[#F0E9FF] to-white rounded-lg border border-[#937CB4]/30">
              <h4 className="font-semibold text-[#422462] mb-2">Repayment Summary</h4>
              <div className="space-y-1 text-sm text-[#5A4079]">
                <p>Requested Amount: ₹{parseFloat(advanceFormData.amount || "0").toLocaleString()}</p>
                <p>Repayment Period: {advanceFormData.repaymentMonths} month(s)</p>
                <p>Monthly Deduction: ₹{Math.ceil(parseFloat(advanceFormData.amount || "0") / parseInt(advanceFormData.repaymentMonths)).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanceModal(false)}
              className="flex-1 border-[#937CB4]/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
 
export function HRMyProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">My Profile</h2>
          <p className="text-[#5A4079]">View and update your profile information</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">Profile Section {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}

 
export function HRResignation() {
  const [showForm, setShowForm] = useState(false);
  const [hasResignation, setHasResignation] = useState(false); // Set to false to show application form first
  const [formData, setFormData] = useState({
    resignationType: "voluntary",
    reason: "",
    lastWorkingDate: "",
    noticePeriod: "60",
    comments: "",
    exitInterviewPreference: "yes"
  });

 
  const [orgId, setOrgId] = useState<number | null>(null);
  const [empId, setEmpId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [resignation, setResignation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);

  // ── Read the logged-in employee from the session, then load their resignation ──
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) { setLoading(false); return; }
    try {
      const u = JSON.parse(raw);
      const id = u?.id != null ? Number(u.id) : null;
      setEmpId(id);
      setOrgId(u?.organizationId != null ? Number(u.organizationId) : null);
      setUserEmail(u?.email || u?.personal_email || "");
      if (id == null) {
        setError("Could not identify your account. Please log in again.");
        setLoading(false);
      }
    } catch {
      setError("Could not read your session. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (empId == null) return;
    loadResignation(empId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId]);

  const loadResignation = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resignationService.getByEmployee(id);
      const record = res.data?.emp_Resignation ?? null;
      setResignation(record);
      setHasResignation(!!record);
    } catch (e) {
      console.error("Failed to load resignation", e);
      setError("Failed to load your resignation status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deriveStatus = (rec: any): string => {
    if (!rec) return "submitted";
    if ([rec.hr_status, rec.manager_status, rec.team_lead_status].includes("Declined")) return "rejected";
    if (rec.hr_status === "Approved") return "approved";
    return "submitted";
  };

  const r = resignation;
  const resignationData = {
    submittedDate: r?.resignation_date || r?.createdAt || "",
    status: deriveStatus(r),
    resignationType: r?.resignation_type || "—",
    reason: r?.resignation_reason || "—",
    lastWorkingDate: r?.last_working_date || "",
    noticePeriod: r?.notice_period ? `${r.notice_period} days` : "—",
    managerComments: r?.manager_comments || "",
    hrComments: r?.hr_comments || "",
    approvedBy: "",
    approvedDate: r?.updatedAt || "",
    resignationLetter: r?.resignation_letter || null,
  };

 
  const exitChecklist = [
    { id: 1, task: "Return Company Laptop", status: "pending", dueDate: "2024-03-10" },
    { id: 2, task: "Return ID Card & Access Cards", status: "pending", dueDate: "2024-03-10" },
    { id: 3, task: "Knowledge Transfer Documentation", status: "in-progress", dueDate: "2024-03-05" },
    { id: 4, task: "Exit Interview Scheduled", status: "completed", dueDate: "2024-03-08" },
    { id: 5, task: "Clear Pending Dues", status: "completed", dueDate: "2024-02-28" },
    { id: 6, task: "Full & Final Settlement", status: "pending", dueDate: "2024-03-15" }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "submitted": return "bg-blue-100 text-blue-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "in-progress": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getChecklistStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "text-green-600 bg-green-50";
      case "in-progress": return "text-yellow-600 bg-yellow-50";
      case "pending": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const REASON_LABELS: Record<string, string> = {
    "career-growth": "Career Growth",
    "higher-education": "Higher Education",
    "better-opportunity": "Better Opportunity",
    "relocation": "Relocation",
    "personal": "Personal Reasons",
    "work-life-balance": "Work-Life Balance",
    "health": "Health Reasons",
    "other": "Other",
  };
  const TYPE_LABELS: Record<string, string> = {
    voluntary: "Voluntary",
    retirement: "Retirement",
    relocation: "Relocation",
    personal: "Personal Reasons",
    other: "Other",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empId == null) { alert("Could not identify your account. Please log in again."); return; }
    if (!formData.reason) { alert("Please select a primary reason for your resignation."); return; }
    if (!formData.lastWorkingDate) { alert("Please choose your intended last working date."); return; }
    if (!userEmail) { alert("No email is associated with your account. Please contact HR."); return; }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await resignationService.create({
        emp_onboarding_id: empId,
        personal_email_address: userEmail,
        resignation_reason: REASON_LABELS[formData.reason] || formData.reason,
        resignation_type: TYPE_LABELS[formData.resignationType] || formData.resignationType,
        notice_period: formData.noticePeriod,
        last_working_date: formData.lastWorkingDate,
        resignation_date: today,
        employee_comments: formData.comments,
        exit_interview_preference: formData.exitInterviewPreference,
        organizationID: orgId ?? undefined,
        hr_status: "Pending",
        team_lead_status: "Pending",
        manager_status: "Pending",
        resignation_letter: letterFile,
      });
      // The server returns a 201 with { success:false } when the employee has an
      // open salary loan, so treat that as a validation failure, not a success.
      if (res.data?.success === false) {
        alert(res.data.message || "Unable to submit resignation.");
        return;
      }
      setShowForm(false);
      setLetterFile(null);
      await loadResignation(empId);
    } catch (err) {
      console.error("Failed to submit resignation", err);
      alert("Failed to submit your resignation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!resignation?.id) return;
    if (!confirm("Are you sure you want to withdraw your resignation?")) return;
    try {
      await resignationService.remove(resignation.id);
      setResignation(null);
      setHasResignation(false);
    } catch (e) {
      console.error("Failed to withdraw resignation", e);
      alert("Failed to withdraw your resignation. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogOut className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div>
            <h2 className="text-3xl font-bold gradient-text">Resignation Process</h2>
            <p className="text-[#5A4079]">Manage your resignation and exit formalities</p>
          </div>
        </div>
        {!loading && !error && !hasResignation && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Resignation
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          {empId != null && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => loadResignation(empId)}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[#937CB4]/20 bg-white/80 px-4 py-3 text-sm text-[#5A4079]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading your resignation status…</span>
        </div>
      )}

      {!loading && !error && !hasResignation && !showForm && (
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-12 shadow-lg text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center">
              <LogOut className="h-10 w-10 text-[#422462]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#200B43] mb-2">No Active Resignation</h3>
              <p className="text-[#5A4079]">You haven't submitted any resignation request yet.</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Submit Resignation
            </Button>
          </div>
        </div>
      )}
 
      {showForm && (
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#200B43]">Submit Resignation Request</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
              className="text-[#5A4079] hover:bg-[#F0E9FF]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resignation Type */}
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Resignation Type
                </label>
                <select
                  value={formData.resignationType}
                  onChange={(e) => setFormData({ ...formData, resignationType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all"
                >
                  <option value="voluntary">Voluntary Resignation</option>
                  <option value="retirement">Retirement</option>
                  <option value="relocation">Relocation</option>
                  <option value="personal">Personal Reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all"
                  placeholder="60"
                />
                <p className="text-xs text-[#5A4079] mt-1">Standard notice period: 60 days</p>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Intended Last Working Date
                </label>
                <input
                  type="date"
                  value={formData.lastWorkingDate}
                  onChange={(e) => setFormData({ ...formData, lastWorkingDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Exit Interview Preference
                </label>
                <select
                  value={formData.exitInterviewPreference}
                  onChange={(e) => setFormData({ ...formData, exitInterviewPreference: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all"
                >
                  <option value="yes">Yes, I'd like to participate</option>
                  <option value="no">No, thank you</option>
                </select>
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Primary Reason for Resignation
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all"
              >
                <option value="">Select a reason</option>
                <option value="career-growth">Career Growth</option>
                <option value="higher-education">Higher Education</option>
                <option value="better-opportunity">Better Opportunity</option>
                <option value="relocation">Relocation</option>
                <option value="personal">Personal Reasons</option>
                <option value="work-life-balance">Work-Life Balance</option>
                <option value="health">Health Reasons</option>
                <option value="other">Other</option>
              </select>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none transition-all resize-none"
                placeholder="Share any additional thoughts or feedback..."
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Upload Resignation Letter (Optional)
              </label>
              <label className="block border-2 border-dashed border-[#937CB4]/30 rounded-lg p-6 text-center hover:border-[#422462] transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setLetterFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="h-8 w-8 text-[#5A4079] mx-auto mb-2" />
                <p className="text-sm text-[#5A4079]">
                  {letterFile ? letterFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-[#958CA7] mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              </label>
            </div>
 
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit Resignation"}
              </Button>
            </div>
          </form>
        </div>
      )}
 
      {hasResignation && !showForm && (
        <>
 
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[#937CB4]/10 to-transparent blur-2xl"></div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#200B43] mb-1">Resignation Status</h3>
                  <p className="text-sm text-[#5A4079]">Submitted on {new Date(resignationData.submittedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(resignationData.status)}`}>
                    {resignationData.status.charAt(0).toUpperCase() + resignationData.status.slice(1)}
                  </span>
                  {resignationData.status === "submitted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleWithdraw}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white">
                  <p className="text-sm text-[#5A4079] mb-1">Resignation Type</p>
                  <p className="font-semibold text-[#200B43]">{resignationData.resignationType}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white">
                  <p className="text-sm text-[#5A4079] mb-1">Reason</p>
                  <p className="font-semibold text-[#200B43]">{resignationData.reason}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white">
                  <p className="text-sm text-[#5A4079] mb-1">Notice Period</p>
                  <p className="font-semibold text-[#200B43]">{resignationData.noticePeriod}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white">
                  <p className="text-sm text-[#5A4079] mb-1">Last Working Day</p>
                  <p className="font-semibold text-[#200B43]">{new Date(resignationData.lastWorkingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
 
              <div className="mb-6">
                <h4 className="font-semibold text-[#200B43] mb-4">Resignation Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 w-0.5 bg-green-500 my-1 min-h-[40px]"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-[#200B43]">Resignation Submitted</p>
                      <p className="text-sm text-[#5A4079]">{new Date(resignationData.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {resignationData.status !== "submitted" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${resignationData.status === "approved" ? "bg-green-500" : "bg-red-500"}`}>
                          {resignationData.status === "approved" ? <Check className="h-5 w-5 text-white" /> : <X className="h-5 w-5 text-white" />}
                        </div>
                        {resignationData.status === "approved" && <div className="flex-1 w-0.5 bg-green-500 my-1 min-h-[40px]"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-[#200B43]">{resignationData.status === "approved" ? "Resignation Approved" : "Resignation Rejected"}</p>
                        <p className="text-sm text-[#5A4079]">{resignationData.approvedBy ? `${resignationData.approvedBy} • ` : ""}{new Date(resignationData.approvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  )}

                  {resignationData.status === "approved" && (
                    <>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 w-0.5 bg-gray-300 my-1 min-h-[40px]"></div>
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-[#200B43]">Notice Period Active</p>
                          <p className="text-sm text-[#5A4079]">Complete exit formalities</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#200B43]">Last Working Day</p>
                          <p className="text-sm text-[#5A4079]">{new Date(resignationData.lastWorkingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
 
              {(resignationData.managerComments || resignationData.hrComments) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#200B43]">Comments</h4>
                  {resignationData.managerComments && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">Manager's Comments</p>
                      <p className="text-sm text-blue-700">{resignationData.managerComments}</p>
                    </div>
                  )}
                  {resignationData.hrComments && (
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-sm font-medium text-purple-900 mb-1">HR Comments</p>
                      <p className="text-sm text-purple-700">{resignationData.hrComments}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
 
          {resignationData.status === "approved" && (
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="h-6 w-6 text-[#422462]" />
                <h3 className="text-xl font-semibold text-[#200B43]">Exit Formalities Checklist</h3>
              </div>

              <div className="space-y-3">
                {exitChecklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#937CB4]/20 hover:border-[#422462]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getChecklistStatusColor(item.status)}`}>
                        {item.status === "completed" && <Check className="h-5 w-5" />}
                        {item.status === "in-progress" && <Clock className="h-5 w-5" />}
                        {item.status === "pending" && <AlertCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#200B43]">{item.task}</p>
                        <p className="text-sm text-[#5A4079]">Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "completed" ? "bg-green-100 text-green-700" :
                      item.status === "in-progress" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-[#422462]" />
              <h3 className="text-xl font-semibold text-[#200B43]">Documents</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Resignation Letter */}
              <div className="p-4 rounded-lg border border-[#937CB4]/20 hover:border-[#422462] transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-[#422462]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#200B43]">Resignation Letter</p>
                    <p className="text-xs text-[#5A4079]">
                      {resignationData.submittedDate
                        ? `Uploaded on ${new Date(resignationData.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : "No letter uploaded"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!resignationData.resignationLetter}
                  onClick={() => resignationData.resignationLetter && window.open(resignationData.resignationLetter, "_blank")}
                  className="w-full border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="mr-2 h-3 w-3" />
                  {resignationData.resignationLetter ? "Download" : "Not Available"}
                </Button>
              </div>
 
              {resignationData.status === "approved" && (
                <div className="p-4 rounded-lg border border-[#937CB4]/20 hover:border-[#422462] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#200B43]">Relieving Letter</p>
                      <p className="text-xs text-[#5A4079]">Available after last day</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#937CB4]/30 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Not Available
                  </Button>
                </div>
              )}
 
              {resignationData.status === "approved" && (
                <div className="p-4 rounded-lg border border-[#937CB4]/20 hover:border-[#422462] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#200B43]">Experience Letter</p>
                      <p className="text-xs text-[#5A4079]">Request after completion</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  >
                    <Send className="mr-2 h-3 w-3" />
                    Request
                  </Button>
                </div>
              )}
 
              {resignationData.status === "approved" && (
                <div className="p-4 rounded-lg border border-[#937CB4]/20 hover:border-[#422462] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DollarSign className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#200B43]">F&F Settlement</p>
                      <p className="text-xs text-[#5A4079]">Available after last day</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#937CB4]/30 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Not Available
                  </Button>
                </div>
              )}
            </div>
          </div>
 
          {resignationData.status === "approved" && (
            <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Info className="h-6 w-6 text-[#422462] mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#200B43] mb-1">Notice Period Buyout Option</h4>
                    <p className="text-sm text-[#5A4079] mb-3">
                      If you need to leave earlier than your last working date, you can request a notice period buyout.
                      This is subject to approval and will be deducted from your final settlement.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#422462] text-[#422462] hover:bg-[#422462] hover:text-white"
                    >
                      Request Buyout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

 
export function HRManageJobs() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewJobModal, setViewJobModal] = useState<number | null>(null);
  const [editJobModal, setEditJobModal] = useState<number | null>(null);
  const [viewApplicationsModal, setViewApplicationsModal] = useState<number | null>(null);
  const [commentModal, setCommentModal] = useState<number | null>(null);
  const [comments, setComments] = useState<{[key: number]: string[]}>({});
  const [currentComment, setCurrentComment] = useState("");
  const [integrateModalOpen, setIntegrateModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const integrationCode = `<!-- Job Listings Widget Integration -->
<script src="https://yourdomain.com/job-widget.js"></script>
<div id="job-widget" data-api-key="YOUR_API_KEY"></div>
<script>
  JobWidget.init({
    containerId: 'job-widget',
    apiKey: 'YOUR_API_KEY',
    theme: 'purple',
    jobsPerPage: 10,
    showFilters: true,
    showSearch: true,
    categories: ['all'],
    locations: ['all']
  });
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5-7 years",
      postedDate: "2026-02-10",
      status: "Active",
      applications: 45,
      description: "We are looking for an experienced software engineer to join our team and lead development initiatives.",
      requirements: ["Bachelor's degree in Computer Science", "5+ years of software development experience", "Strong problem-solving skills"],
      salary: "₹120,000 - ₹150,000"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      experience: "3-5 years",
      postedDate: "2026-02-08",
      status: "Active",
      applications: 32,
      description: "Join our product team to drive product strategy and execution for our flagship products.",
      requirements: ["3+ years of product management experience", "Strong analytical skills", "Experience with agile methodologies"],
      salary: "₹100,000 - ₹130,000"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "2-4 years",
      postedDate: "2026-02-05",
      status: "Active",
      applications: 28,
      description: "Create beautiful and intuitive user experiences for our digital products.",
      requirements: ["Portfolio showcasing UI/UX work", "Proficiency in Figma and design tools", "Understanding of user-centered design"],
      salary: "₹90,000 - ₹120,000"
    },
    {
      id: 4,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      experience: "4-6 years",
      postedDate: "2026-02-03",
      status: "Active",
      applications: 19,
      description: "Lead marketing campaigns and strategies to drive business growth and brand awareness.",
      requirements: ["4+ years of marketing experience", "Digital marketing expertise", "Strong communication skills"],
      salary: "₹85,000 - ₹110,000"
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Analytics",
      location: "Boston, MA",
      type: "Full-time",
      experience: "3-5 years",
      postedDate: "2026-01-28",
      status: "Active",
      applications: 38,
      description: "Analyze complex data sets and build predictive models to inform business decisions.",
      requirements: ["Master's degree in Data Science or related field", "Experience with Python and ML frameworks", "Strong statistical knowledge"],
      salary: "₹110,000 - ₹140,000"
    },
    {
      id: 6,
      title: "HR Business Partner",
      department: "Human Resources",
      location: "Chicago, IL",
      type: "Full-time",
      experience: "5-7 years",
      postedDate: "2026-01-25",
      status: "Active",
      applications: 15,
      description: "Partner with business leaders to develop and implement HR strategies that support organizational goals.",
      requirements: ["5+ years of HR experience", "Strong business acumen", "Experience with talent management"],
      salary: "₹95,000 - ₹125,000"
    }
  ];

 
  const mockApplications = [
    { id: 1, name: "John Smith", email: "john.smith@email.com", phone: "+1 (555) 123-4567", appliedDate: "2026-02-15", status: "Under Review", experience: "6 years", education: "B.S. Computer Science", location: "San Francisco, CA", resume: "resume_john_smith.pdf" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 234-5678", appliedDate: "2026-02-14", status: "Interview Scheduled", experience: "5 years", education: "M.S. Software Engineering", location: "New York, NY", resume: "resume_sarah_johnson.pdf" },
    { id: 3, name: "Michael Chen", email: "m.chen@email.com", phone: "+1 (555) 345-6789", appliedDate: "2026-02-13", status: "Under Review", experience: "7 years", education: "B.S. Computer Engineering", location: "Remote", resume: "resume_michael_chen.pdf" },
    { id: 4, name: "Emily Williams", email: "emily.w@email.com", phone: "+1 (555) 456-7890", appliedDate: "2026-02-12", status: "Shortlisted", experience: "8 years", education: "M.S. Computer Science", location: "Boston, MA", resume: "resume_emily_williams.pdf" },
    { id: 5, name: "David Rodriguez", email: "d.rodriguez@email.com", phone: "+1 (555) 567-8901", appliedDate: "2026-02-11", status: "Rejected", experience: "3 years", education: "B.S. Information Technology", location: "Chicago, IL", resume: "resume_david_rodriguez.pdf" },
  ];

  const selectedJob = viewJobModal ? jobs.find(j => j.id === viewJobModal) : null;
  const editingJob = editJobModal ? jobs.find(j => j.id === editJobModal) : null;
  const applicationsJob = viewApplicationsModal ? jobs.find(j => j.id === viewApplicationsModal) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "bg-blue-100 text-blue-700 border-blue-300";
      case "Interview Scheduled": return "bg-purple-100 text-purple-700 border-purple-300";
      case "Shortlisted": return "bg-green-100 text-green-700 border-green-300";
      case "Rejected": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleAddComment = () => {
    if (commentModal && currentComment.trim()) {
      setComments(prev => ({
        ...prev,
        [commentModal]: [...(prev[commentModal] || []), currentComment.trim()]
      }));
      setCurrentComment("");
      setCommentModal(null);
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Target className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Manage Jobs</h2>
            <p className="text-[#5A4079]">Create and manage job postings</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setIntegrateModalOpen(true)}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Integrate to Website
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job Posting
          </Button>
        </div>
      </div>
 
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Active Jobs</p>
              <p className="text-2xl font-bold text-[#200B43]">{jobs.length}</p>
            </div>
            <Target className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Total Applications</p>
              <p className="text-2xl font-bold text-[#200B43]">{jobs.reduce((sum, job) => sum + job.applications, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Avg Applications</p>
              <p className="text-2xl font-bold text-[#200B43]">{Math.round(jobs.reduce((sum, job) => sum + job.applications, 0) / jobs.length)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Departments</p>
              <p className="text-2xl font-bold text-[#200B43]">{new Set(jobs.map(j => j.department)).size}</p>
            </div>
            <Award className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
      </div>
 
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div 
            key={job.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="p-6 space-y-4">
 
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#200B43] text-lg leading-tight">{job.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-[#5A4079]">{job.department}</p>
              </div>
 
              <div className="space-y-2">
                <div className="flex items-center text-sm text-[#5A4079]">
                  <span className="font-medium text-[#200B43] w-24">Location:</span>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-[#5A4079]">
                  <span className="font-medium text-[#200B43] w-24">Type:</span>
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-sm text-[#5A4079]">
                  <span className="font-medium text-[#200B43] w-24">Experience:</span>
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center text-sm text-[#5A4079]">
                  <span className="font-medium text-[#200B43] w-24">Posted:</span>
                  <span>{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
 
              <div className="pt-4 border-t border-[#937CB4]/20">
                <button 
                  onClick={() => setViewApplicationsModal(job.id)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 hover:from-[#F0E9FF]/80 hover:to-[#F0E9FF]/30 transition-all cursor-pointer"
                >
                  <Users className="h-5 w-5 text-[#422462]" />
                  <span className="font-bold text-[#200B43]">{job.applications}</span>
                  <span className="text-sm text-[#5A4079]">Applications</span>
                </button>
              </div>
 
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewJobModal(job.id)}
                  className="w-full border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:border-[#422462]"
                >
                  <Info className="mr-2 h-4 w-4" />
                  View Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditJobModal(job.id)}
                  className="w-full border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:border-[#422462]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {showCreateModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#200B43]">Create New Job Posting</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="Enter job title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Department</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., Remote"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Employment Type</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Experience Required</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., 3-5 years"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Salary Range</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="e.g., ₹80,000 - ₹100,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Job Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="Describe the role and responsibilities"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Requirements</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="List key requirements (one per line)"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  >
                    Create Job Posting
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
 
      {viewJobModal && selectedJob && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#200B43]">{selectedJob.title}</h3>
                <p className="text-sm text-[#5A4079] mt-1">{selectedJob.department} • {selectedJob.location}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewJobModal(null)}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
 
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20">
                  <p className="text-sm text-[#5A4079] mb-1">Employment Type</p>
                  <p className="font-semibold text-[#200B43]">{selectedJob.type}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20">
                  <p className="text-sm text-[#5A4079] mb-1">Experience Required</p>
                  <p className="font-semibold text-[#200B43]">{selectedJob.experience}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20">
                  <p className="text-sm text-[#5A4079] mb-1">Salary Range</p>
                  <p className="font-semibold text-[#200B43]">{selectedJob.salary}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20">
                  <p className="text-sm text-[#5A4079] mb-1">Applications Received</p>
                  <p className="font-semibold text-[#200B43]">{selectedJob.applications} candidates</p>
                </div>
              </div>
 
              <div>
                <h4 className="font-semibold text-[#200B43] mb-3">Job Description</h4>
                <p className="text-[#5A4079] leading-relaxed">{selectedJob.description}</p>
              </div>
 
              <div>
                <h4 className="font-semibold text-[#200B43] mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#422462] flex-shrink-0 mt-0.5" />
                      <span className="text-[#5A4079]">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
 
              <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
                <Button
                  onClick={() => {
                    setViewJobModal(null);
                    setViewApplicationsModal(selectedJob.id);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Applications ({selectedJob.applications})
                </Button>
                <Button
                  onClick={() => {
                    setViewJobModal(null);
                    setEditJobModal(selectedJob.id);
                  }}
                  variant="outline"
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Edit Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {editJobModal && editingJob && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#200B43]">Edit Job Posting</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditJobModal(null)}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Job Title</label>
                  <input
                    type="text"
                    defaultValue={editingJob.title}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="Enter job title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue={editingJob.department}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue={editingJob.location}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., Remote"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Employment Type</label>
                    <select 
                      defaultValue={editingJob.type}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Experience Required</label>
                    <input
                      type="text"
                      defaultValue={editingJob.experience}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g., 3-5 years"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Salary Range</label>
                  <input
                    type="text"
                    defaultValue={editingJob.salary}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="e.g., ₹80,000 - ₹100,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Job Description</label>
                  <textarea
                    rows={4}
                    defaultValue={editingJob.description}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="Describe the role and responsibilities"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Requirements</label>
                  <textarea
                    rows={3}
                    defaultValue={editingJob.requirements.join('\n')}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="List key requirements (one per line)"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditJobModal(null)}
                    className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
 
      {viewApplicationsModal && applicationsJob && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#200B43]">Applications for {applicationsJob.title}</h3>
                <p className="text-sm text-[#5A4079] mt-1">{mockApplications.length} total applications</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewApplicationsModal(null)}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockApplications.map((application) => (
                  <div 
                    key={application.id}
                    className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-[#200B43] text-lg">{application.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Email:</span>
                              <span>{application.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Phone:</span>
                              <span>{application.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Location:</span>
                              <span>{application.location}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Experience:</span>
                              <span>{application.experience}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Education:</span>
                              <span>{application.education}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#5A4079]">
                              <span className="font-medium text-[#200B43]">Applied:</span>
                              <span>{new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-[#937CB4]/20">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCommentModal(application.id)}
                        className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] relative"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Add Comment
                        {comments[application.id] && comments[application.id].length > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#422462] text-white">
                            {comments[application.id].length}
                          </span>
                        )}
                      </Button>
                      {application.status === "Under Review" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-auto border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
 
      {commentModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#200B43]">Add Comment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCommentModal(null);
                  setCurrentComment("");
                }}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">

              {comments[commentModal] && comments[commentModal].length > 0 && (
                <div className="mb-4 space-y-3">
                  <h4 className="text-sm font-semibold text-[#200B43]">Previous Comments:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {comments[commentModal].map((comment, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20"
                      >
                        <p className="text-sm text-[#200B43]">{comment}</p>
                        <p className="text-xs text-[#5A4079] mt-1">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Add New Comment</label>
                  <textarea
                    rows={4}
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="Write your comment about this candidate..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCommentModal(null);
                      setCurrentComment("");
                    }}
                    className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddComment}
                    disabled={!currentComment.trim()}
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      <Modal isOpen={integrateModalOpen} onClose={() => setIntegrateModalOpen(false)} title="Integrate Job Widget" size="lg">
        <div className="space-y-6">
 
          <div className="p-4 rounded-lg bg-[#F0E9FF]/30 border border-[#937CB4]/20">
            <h3 className="text-sm font-semibold text-[#422462] mb-3">Integration Instructions</h3>
            <ul className="space-y-2 text-sm text-[#5A4079]">
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Copy the JavaScript code snippet below and paste it into your website's HTML file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Replace <code className="bg-[#937CB4]/20 px-1.5 py-0.5 rounded text-[#422462] font-mono text-xs">YOUR_API_KEY</code> with your actual API key from Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Place the code where you want the job listings widget to appear on your careers page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Customize the widget theme, jobs per page, filters, and display options in the configuration object</span>
              </li>
            </ul>
          </div>
 
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#422462]">Integration Code</h3>
              <Button
                size="sm"
                variant="outline"
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                onClick={copyToClipboard}
              >
                {codeCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="relative rounded-lg border border-[#937CB4]/20 bg-[#1A0936] p-4 overflow-x-auto">
              <pre className="text-sm text-[#F0E9FF] font-mono">
                <code>{integrationCode}</code>
              </pre>
            </div>
          </div>
 
          <div className="p-4 rounded-lg bg-white border border-[#937CB4]/20">
            <h3 className="text-sm font-semibold text-[#422462] mb-2">Need Help?</h3>
            <p className="text-sm text-[#5A4079]">
              Visit our <span className="text-[#422462] font-medium cursor-pointer hover:underline">documentation</span> for detailed integration guides, 
              customization options, and troubleshooting tips. The job widget is fully responsive and will automatically match your website's styling.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
 
export function HROrgLeaveManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-[#422462] animate-pulse-glow" />
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
        <Clock className="h-8 w-8 text-[#422462] animate-pulse-glow" />
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Onboarding</h2>
          <p className="text-[#5A4079]">Manage employee onboarding process</p>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg">
          <p className="text-[#200B43]">New Hire {i} - Details coming soon...</p>
        </div>
      ))}
    </div>
  );
}
 
export function HROrgSalariesManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-[#422462] animate-pulse-glow" />
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
        <TrendingUp className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Team Performance</h2>
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

 
export function HROrgSalaryAdvanceRequests() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-[#422462] animate-pulse-glow" />
        <div>
          <h2 className="text-3xl font-bold gradient-text">Salary Advance Requests</h2>
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