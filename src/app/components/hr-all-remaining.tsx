// This file contains all remaining HR component exports
// Import these individually in App.tsx as needed

import { useState } from "react";
import { FileText, Calendar, Clock, Sparkles, Plus, Users, TrendingUp, DollarSign, Award, Target, Download, CreditCard, Wallet, Receipt, LogOut, X, Send, Upload, Check, AlertCircle, ClipboardList, Info, MessageSquare, Code2, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// HR Attendance - Apply Leave
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
      {/* Header */}
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

      {/* Leave Balance Cards */}
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

      {/* Recent Leave History */}
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

      {/* Apply Leave Modal */}
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

// HR Attendance - My Login Details (Apply Leave Form)
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

  // Mock attendance data
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
      {/* Header */}
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
        {/* Left Side - Calendar & Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Attendance Statistics */}
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

          {/* Calendar */}
          <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg p-4">
            {/* Month Navigation */}
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

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-1 text-xs font-semibold text-[#422462]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
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

            {/* Legend */}
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

        {/* Right Side - Leave Balance */}
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

          {/* Quick Stats */}
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

      {/* Apply Leave Modal */}
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

      {/* Leave History Modal */}
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

      {/* Holidays Modal */}
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

// HR Attendance - Company Calendar
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

// HR Self Service - Holiday List
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

// HR Self Service - My Performance Metrics  
export function HRPerformanceMetrics() {
  const [selectedMonth, setSelectedMonth] = useState("February 2026");
  
  const months = [
    "February 2026", "January 2026", "December 2025", "November 2025", 
    "October 2025", "September 2025"
  ];

  // Performance metrics data
  const performanceMetrics = [
    {
      category: "Attendance & Punctuality",
      score: 92,
      target: 95,
      color: "from-[#422462] to-[#5A4079]",
      icon: Clock,
      details: [
        { label: "Present Days", value: "20/22" },
        { label: "Late Arrivals", value: "2" },
        { label: "Early Departures", value: "0" },
      ]
    },
    {
      category: "Work Quality",
      score: 88,
      target: 85,
      color: "from-[#5A4079] to-[#937CB4]",
      icon: Target,
      details: [
        { label: "Tasks Completed", value: "45/48" },
        { label: "Error Rate", value: "2%" },
        { label: "Client Satisfaction", value: "4.5/5" },
      ]
    },
    {
      category: "Productivity",
      score: 95,
      target: 90,
      color: "from-[#937CB4] to-[#422462]",
      icon: TrendingUp,
      details: [
        { label: "Tasks on Time", value: "42/45" },
        { label: "Efficiency Rate", value: "95%" },
        { label: "Output vs Target", value: "110%" },
      ]
    },
    {
      category: "Collaboration & Team Work",
      score: 90,
      target: 85,
      color: "from-[#422462] to-[#937CB4]",
      icon: Users,
      details: [
        { label: "Team Meetings", value: "12/12" },
        { label: "Peer Feedback", value: "4.6/5" },
        { label: "Knowledge Sharing", value: "8 sessions" },
      ]
    },
    {
      category: "Professional Development",
      score: 85,
      target: 80,
      color: "from-[#5A4079] to-[#422462]",
      icon: Award,
      details: [
        { label: "Training Completed", value: "3/4" },
        { label: "Skills Enhanced", value: "5" },
        { label: "Certifications", value: "1" },
      ]
    },
  ];

  // Monthly performance history
  const monthlyHistory = {
    "February 2026": { overall: 90, trend: "up" },
    "January 2026": { overall: 88, trend: "up" },
    "December 2025": { overall: 85, trend: "up" },
    "November 2025": { overall: 82, trend: "down" },
    "October 2025": { overall: 87, trend: "up" },
    "September 2025": { overall: 84, trend: "up" },
  };

  const currentMonthData = monthlyHistory[selectedMonth as keyof typeof monthlyHistory];
  const overallScore = currentMonthData?.overall || 90;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-600";
    if (score >= 75) return "from-blue-500 to-cyan-600";
    if (score >= 60) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#422462]">Period:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#937CB4]/30 bg-white/90 text-[#422462] font-medium focus:outline-none focus:ring-2 focus:ring-[#937CB4]/50"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Performance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#937CB4]/30 bg-gradient-to-br from-white via-[#F0E9FF]/20 to-white backdrop-blur-xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#200B43] mb-2">Overall Performance Score</h3>
              <p className="text-2xl font-bold text-[#200B43]">{selectedMonth}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                  <span className="text-2xl">/100</span>
                </div>
                <div className="flex items-center gap-1 mt-2 justify-center">
                  {currentMonthData?.trend === "up" ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Improving</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      <span className="text-xs text-red-600 font-medium">Declining</span>
                    </>
                  )}
                </div>
              </div>
              <div className="relative h-32 w-32">
                <svg className="transform -rotate-90" width="128" height="128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#F0E9FF"
                    strokeWidth="12"
                    fill="none"
                  />
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

      {/* Performance Metrics - 5x1 Horizontal Layout */}
      <div className="grid grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const percentage = (metric.score / 100) * 100;
          const isAboveTarget = metric.score >= metric.target;
          const monthlyChange = metric.score >= 75 ? `+${Math.floor(Math.random() * 8 + 2)}` : `-${Math.floor(Math.random() * 5 + 1)}`;
          const isPositiveTrend = monthlyChange.startsWith('+');
          
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0E9FF]/30 via-transparent to-[#F0E9FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#200B43] text-xl mb-1">{metric.category}</h3>
                      <p className="text-sm text-[#5A4079]">Target: {metric.target}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </div>
                    <div className="text-sm text-[#5A4079]">/ 100</div>
                  </div>
                </div>

                {/* Monthly Trend Indicator - NEW PARAMETER */}
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[#F0E9FF]/50 to-transparent border border-[#937CB4]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5A4079]">Monthly Trend</span>
                    <div className="flex items-center gap-2">
                      {isPositiveTrend ? (
                        <>
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="text-base font-bold text-green-600">{monthlyChange}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-5 w-5 text-orange-600" />
                          <span className="text-base font-bold text-orange-600">{monthlyChange}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
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
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF]/30 backdrop-blur-xl p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#937CB4]/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h3 className="text-xl font-bold text-[#200B43] mb-4">Performance Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Strong Performance Areas</p>
                <p className="text-xs text-green-700 mt-1">
                  Excellent productivity and work quality. Keep up the great work on meeting deadlines and maintaining high standards.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Areas for Improvement</p>
                <p className="text-xs text-blue-700 mt-1">
                  Focus on punctuality to reach the 95% target. Consider adjusting your morning routine to ensure timely arrivals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="h-6 w-6 rounded-full bg-[#422462] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#422462]">Next Month Goals</p>
                <p className="text-xs text-[#5A4079] mt-1">
                  Complete the remaining training module, maintain 95%+ attendance, and continue exceeding productivity targets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HR Self Service - Learning & Development
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

// HR Self Service - Benefits and Compensation
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

// HR Self Service - Salary Advance
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

// HR Self Service - Salary Structure (Combined with Salary Advance)
export function HRSalaryStructure() {
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [advanceFormData, setAdvanceFormData] = useState({
    amount: '',
    reason: '',
    repaymentMonths: '3',
    urgency: 'normal'
  });

  // Monthly salary data for the entire year
  const salaryData = [
    { month: 'Jan', salary: 75000, netPay: 68500, deductions: 6500 },
    { month: 'Feb', salary: 75000, netPay: 68500, deductions: 6500 },
    { month: 'Mar', salary: 75000, netPay: 68500, deductions: 6500 },
    { month: 'Apr', salary: 78000, netPay: 71200, deductions: 6800 },
    { month: 'May', salary: 78000, netPay: 71200, deductions: 6800 },
    { month: 'Jun', salary: 78000, netPay: 71200, deductions: 6800 },
    { month: 'Jul', salary: 78000, netPay: 71200, deductions: 6800 },
    { month: 'Aug', salary: 80000, netPay: 73000, deductions: 7000 },
    { month: 'Sep', salary: 80000, netPay: 73000, deductions: 7000 },
    { month: 'Oct', salary: 80000, netPay: 73000, deductions: 7000 },
    { month: 'Nov', salary: 80000, netPay: 73000, deductions: 7000 },
    { month: 'Dec', salary: 80000, netPay: 73000, deductions: 7000 }
  ];

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salary Advance Request:', advanceFormData);
    setShowAdvanceModal(false);
    setAdvanceFormData({
      amount: '',
      reason: '',
      repaymentMonths: '3',
      urgency: 'normal'
    });
  };

  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdvanceFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadPayslip = (month: string) => {
    console.log(`Downloading payslip for ${month}`);
    // Simulate download
  };

  // Calculate totals
  const totalEarnings = salaryData.reduce((sum, item) => sum + item.salary, 0);
  const totalNetPay = salaryData.reduce((sum, item) => sum + item.netPay, 0);
  const totalDeductions = salaryData.reduce((sum, item) => sum + item.deductions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Monthly Salary Bar Chart */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#200B43] mb-2">Monthly Salary Overview - 2026</h3>
          <p className="text-sm text-[#5A4079]">Click on any bar to view and download that month's payslip</p>
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
              <XAxis 
                dataKey="month" 
                stroke="#5A4079"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#5A4079"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(240, 233, 255, 0.95)', 
                  border: '1px solid #937CB4',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Bar 
                dataKey="salary" 
                name="Gross Salary"
                fill="url(#salaryColorGross)" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="netPay" 
                name="Net Salary"
                fill="url(#salaryColorNet)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PDF Download Icons Row */}
        <div className="mt-2 flex justify-between items-center" style={{ paddingLeft: '48px', paddingRight: '48px' }}>
          {salaryData.map((monthData, index) => (
            <button
              key={index}
              onClick={() => downloadPayslip(monthData.month)}
              className="group flex items-center justify-center p-2 rounded-lg hover:bg-gradient-to-br hover:from-[#F0E9FF] hover:to-white transition-all duration-300 hover:shadow-lg"
              title={`Download ${monthData.month} payslip`}
            >
              <FileText className="h-5 w-5 text-[#422462] group-hover:text-[#5A4079] transition-colors" />
            </button>
          ))}
        </div>

        {/* Custom Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{
              background: 'linear-gradient(to bottom, #422462 0%, rgba(90, 64, 121, 0.8) 100%)'
            }}></div>
            <span className="text-sm text-[#5A4079] font-medium">Gross Salary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{
              background: 'linear-gradient(to bottom, #937CB4 0%, rgba(90, 64, 121, 0.6) 100%)'
            }}></div>
            <span className="text-sm text-[#5A4079] font-medium">Net Salary</span>
          </div>
        </div>
      </div>

      {/* Salary Advance Application Modal */}
      <Modal isOpen={showAdvanceModal} onClose={() => setShowAdvanceModal(false)} title="Apply for Salary Advance / Loan" size="lg">
        <form onSubmit={handleAdvanceSubmit} className="space-y-4">
          <div className="bg-[#F0E9FF] p-4 rounded-lg mb-4">
            <p className="text-sm text-[#5A4079]">
              <strong className="text-[#422462]">Note:</strong> Maximum advance amount is 50% of your monthly salary (₹36,500). Approval time: 2-3 business days.
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
              placeholder="Enter amount (Max: ₹36,500)"
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
                <p>Requested Amount: ₹{parseFloat(advanceFormData.amount).toLocaleString()}</p>
                <p>Repayment Period: {advanceFormData.repaymentMonths} month(s)</p>
                <p>Monthly Deduction: ₹{Math.ceil(parseFloat(advanceFormData.amount) / parseInt(advanceFormData.repaymentMonths)).toLocaleString()}</p>
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
              className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// HR Self Service - My Profile
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

// HR Self Service - Resignation
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

  // Mock resignation data
  const resignationData = {
    submittedDate: "2024-01-15",
    status: "approved",
    resignationType: "Voluntary",
    reason: "Career Growth",
    lastWorkingDate: "2024-03-15",
    noticePeriod: "60 days",
    managerComments: "We wish you all the best for your future endeavors. Your contributions have been valuable.",
    hrComments: "Please ensure all exit formalities are completed before last working day.",
    approvedBy: "Sarah Johnson (Manager)",
    approvedDate: "2024-01-17"
  };

  // Exit checklist items
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Resignation submitted:", formData);
    setHasResignation(true);
    setShowForm(false);
  };

  const handleWithdraw = () => {
    if (confirm("Are you sure you want to withdraw your resignation?")) {
      setHasResignation(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogOut className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div>
            <h2 className="text-3xl font-bold gradient-text">Resignation Process</h2>
            <p className="text-[#5A4079]">Manage your resignation and exit formalities</p>
          </div>
        </div>
        {!hasResignation && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Resignation
          </Button>
        )}
      </div>

      {/* No Resignation State */}
      {!hasResignation && !showForm && (
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

      {/* Resignation Form */}
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

              {/* Notice Period */}
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

              {/* Last Working Date */}
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

              {/* Exit Interview */}
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

            {/* Reason */}
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

            {/* Comments */}
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

            {/* Upload Resignation Letter */}
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Upload Resignation Letter (Optional)
              </label>
              <div className="border-2 border-dashed border-[#937CB4]/30 rounded-lg p-6 text-center hover:border-[#422462] transition-all cursor-pointer">
                <Upload className="h-8 w-8 text-[#5A4079] mx-auto mb-2" />
                <p className="text-sm text-[#5A4079]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#958CA7] mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            {/* Form Actions */}
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
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Resignation
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Resignation Details */}
      {hasResignation && !showForm && (
        <>
          {/* Resignation Status Card */}
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

              {/* Timeline */}
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
                        <p className="text-sm text-[#5A4079]">{resignationData.approvedBy} • {new Date(resignationData.approvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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

              {/* Comments */}
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

          {/* Exit Formalities Checklist */}
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

          {/* Documents Section */}
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
                    <p className="text-xs text-[#5A4079]">Uploaded on Jan 15, 2024</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              </div>

              {/* Relieving Letter */}
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

              {/* Experience Letter */}
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

              {/* Full & Final Settlement */}
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

          {/* Notice Period Buyout */}
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

// HR Job Management - Manage Jobs
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

  // Mock applications data
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
      {/* Header */}
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

      {/* Stats Cards */}
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

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div 
            key={job.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="p-6 space-y-4">
              {/* Job Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#200B43] text-lg leading-tight">{job.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-[#5A4079]">{job.department}</p>
              </div>

              {/* Job Details */}
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

              {/* Applications Badge */}
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

              {/* Action Buttons */}
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

      {/* Create Job Modal */}
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

      {/* View Job Modal */}
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
              {/* Job Overview */}
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

              {/* Job Description */}
              <div>
                <h4 className="font-semibold text-[#200B43] mb-3">Job Description</h4>
                <p className="text-[#5A4079] leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
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

              {/* Action Buttons */}
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

      {/* Edit Job Modal */}
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

      {/* View Applications Modal */}
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

      {/* Add Comment Modal */}
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
              {/* Previous Comments */}
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

              {/* Add New Comment */}
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

      {/* Integration Modal */}
      <Modal isOpen={integrateModalOpen} onClose={() => setIntegrateModalOpen(false)} title="Integrate Job Widget" size="lg">
        <div className="space-y-6">
          {/* Instructions */}
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

          {/* Code Block */}
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

          {/* Additional Info */}
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

// HR Organization Management - Leave Management
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

// HR Organization Management - Attendance Management
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

// HR Organization Management - Onboarding
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

// HR Organization Management - Salaries Management
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

// HR Organization Management - Team Performance
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

// HR Organization Management - Salary Advance Requests
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