import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserCheck, Clock, XCircle, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const attendanceData = [
  { id: "1", employee: "Sarah Williams", designation: "Senior Developer", date: "2026-01-10", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", hours: 8.75 },
  { id: "2", employee: "Michael Torres", designation: "Product Manager", date: "2026-01-10", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "present", hours: 9.0 },
  { id: "3", employee: "Jennifer Lee", designation: "UI/UX Designer", date: "2026-01-10", checkIn: "-", checkOut: "-", status: "absent", hours: 0 },
  { id: "4", employee: "David Kim", designation: "Marketing Lead", date: "2026-01-10", checkIn: "08:30 AM", checkOut: "05:45 PM", status: "present", hours: 9.25 },
  { id: "5", employee: "Emma Johnson", designation: "HR Manager", date: "2026-01-10", checkIn: "09:15 AM", checkOut: "05:30 PM", status: "late", hours: 8.25 },
  { id: "6", employee: "Robert Chen", designation: "Sales Executive", date: "2026-01-10", checkIn: "08:50 AM", checkOut: "05:40 PM", status: "present", hours: 8.83 },
];

const attendanceTrends = [
  { month: "Jul", present: 92, absent: 5, late: 3 },
  { month: "Aug", present: 94, absent: 4, late: 2 },
  { month: "Sep", present: 91, absent: 6, late: 3 },
  { month: "Oct", present: 95, absent: 3, late: 2 },
  { month: "Nov", present: 93, absent: 5, late: 2 },
  { month: "Dec", present: 96, absent: 2, late: 2 },
];

export function HRAttendance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Attendance</h2>
          <p className="text-[#5A4079]">
            Track and manage employee attendance records
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Present Today</CardTitle>
            <UserCheck className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">183</div>
            <p className="text-xs text-[#422462]">93.4% attendance rate</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Absent</CardTitle>
            <XCircle className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">8</div>
            <p className="text-xs text-[#422462]">4.1% of workforce</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Late Arrivals</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">5</div>
            <p className="text-xs text-[#422462]">2.5% late today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Today's Attendance</CardTitle>
          <CardDescription className="text-[#5A4079]">Real-time employee attendance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-semibold">
                    {record.employee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-[#200B43]">{record.employee}</p>
                    <p className="text-sm text-[#5A4079]">{record.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-[#5A4079]">Check In: <span className="font-medium text-[#200B43]">{record.checkIn}</span></p>
                    <p className="text-sm text-[#5A4079]">Check Out: <span className="font-medium text-[#200B43]">{record.checkOut}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#5A4079]">Hours</p>
                    <p className="font-bold text-[#200B43]">{record.hours}</p>
                  </div>
                  <Badge 
                    variant={record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"}
                    className={record.status === "present" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                  >
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Attendance Trends</CardTitle>
          <CardDescription className="text-[#5A4079]">Monthly attendance statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
              <XAxis dataKey="month" stroke="#5A4079" />
              <YAxis stroke="#5A4079" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #937CB4',
                  borderRadius: '8px',
                  color: '#200B43',
                  boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                }}
              />
              <Legend />
              <Bar key="present-bar" dataKey="present" fill="#422462" name="Present" />
              <Bar key="absent-bar" dataKey="absent" fill="#937CB4" name="Absent" />
              <Bar key="late-bar" dataKey="late" fill="#5A4079" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}