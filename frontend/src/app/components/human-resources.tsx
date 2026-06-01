import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  UserCheck, 
  Clock, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  User,
  FileText,
  Plus,
  Sparkles
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
 
const attendanceData = [
  { id: "1", employee: "Sarah Williams", date: "2026-01-10", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", hours: 8.75 },
  { id: "2", employee: "Michael Torres", date: "2026-01-10", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "present", hours: 9.0 },
  { id: "3", employee: "Jennifer Lee", date: "2026-01-10", checkIn: "-", checkOut: "-", status: "absent", hours: 0 },
  { id: "4", employee: "David Kim", date: "2026-01-10", checkIn: "08:30 AM", checkOut: "05:45 PM", status: "present", hours: 9.25 },
  { id: "5", employee: "Emma Johnson", date: "2026-01-10", checkIn: "09:15 AM", checkOut: "05:30 PM", status: "late", hours: 8.25 },
  { id: "6", employee: "Robert Chen", date: "2026-01-10", checkIn: "08:50 AM", checkOut: "05:40 PM", status: "present", hours: 8.83 },
];

const attendanceTrends = [
  { month: "Jul", present: 92, absent: 5, late: 3 },
  { month: "Aug", present: 94, absent: 4, late: 2 },
  { month: "Sep", present: 91, absent: 6, late: 3 },
  { month: "Oct", present: 95, absent: 3, late: 2 },
  { month: "Nov", present: 93, absent: 5, late: 2 },
  { month: "Dec", present: 96, absent: 2, late: 2 },
];
 
const leaveRequests = [
  { id: "1", employee: "Sarah Williams", type: "Vacation", from: "2026-01-20", to: "2026-01-25", days: 5, status: "pending", reason: "Family vacation" },
  { id: "2", employee: "Michael Torres", type: "Sick Leave", from: "2026-01-12", to: "2026-01-13", days: 2, status: "approved", reason: "Medical appointment" },
  { id: "3", employee: "Jennifer Lee", type: "Personal", from: "2026-02-01", to: "2026-02-03", days: 3, status: "pending", reason: "Personal matters" },
  { id: "4", employee: "David Kim", type: "Vacation", from: "2026-01-28", to: "2026-02-02", days: 6, status: "approved", reason: "Holiday trip" },
];

const employeeDocuments = [
  { id: "1", name: "Employment Contract.pdf", type: "Contract", date: "2024-03-15", size: "245 KB" },
  { id: "2", name: "Tax Form W-2.pdf", type: "Tax", date: "2026-01-05", size: "128 KB" },
  { id: "3", name: "Benefits Enrollment.pdf", type: "Benefits", date: "2025-12-10", size: "312 KB" },
  { id: "4", name: "Performance Review Q4.pdf", type: "Review", date: "2025-12-28", size: "189 KB" },
];
 
const tasks = [
  { id: "1", title: "Complete onboarding checklist", assignedTo: "Sarah Williams", dueDate: "2026-01-15", priority: "high", status: "in-progress", completion: 75 },
  { id: "2", title: "Submit performance review", assignedTo: "Michael Torres", dueDate: "2026-01-12", priority: "high", status: "completed", completion: 100 },
  { id: "3", title: "Update employee handbook", assignedTo: "Jennifer Lee", dueDate: "2026-01-20", priority: "medium", status: "pending", completion: 0 },
  { id: "4", title: "Conduct team training", assignedTo: "David Kim", dueDate: "2026-01-18", priority: "medium", status: "in-progress", completion: 45 },
  { id: "5", title: "Review salary adjustments", assignedTo: "Emma Johnson", dueDate: "2026-01-25", priority: "high", status: "pending", completion: 0 },
];
 
const expenses = [
  { id: "1", employee: "Sarah Williams", category: "Travel", description: "Client meeting in NYC", amount: 850, date: "2026-01-08", status: "approved" },
  { id: "2", employee: "Michael Torres", category: "Software", description: "Adobe Creative Suite subscription", amount: 299, date: "2026-01-09", status: "pending" },
  { id: "3", employee: "Jennifer Lee", category: "Office Supplies", description: "Desk equipment", amount: 125, date: "2026-01-09", status: "approved" },
  { id: "4", employee: "David Kim", category: "Travel", description: "Conference attendance", amount: 1200, date: "2026-01-10", status: "pending" },
  { id: "5", employee: "Emma Johnson", category: "Meals", description: "Team lunch", amount: 180, date: "2026-01-10", status: "approved" },
];

const expensesByCategory = [
  { category: "Travel", amount: 12500 },
  { category: "Software", amount: 8900 },
  { category: "Office Supplies", amount: 3200 },
  { category: "Meals", amount: 2800 },
  { category: "Training", amount: 5600 },
];
 
const jobOpenings = [
  { id: "1", title: "Senior Software Engineer", department: "Engineering", location: "Remote", type: "Full-time", applicants: 45, status: "active", posted: "2025-12-15" },
  { id: "2", title: "Marketing Manager", department: "Marketing", location: "New York", type: "Full-time", applicants: 28, status: "active", posted: "2025-12-20" },
  { id: "3", title: "Product Designer", department: "Design", location: "San Francisco", type: "Full-time", applicants: 32, status: "active", posted: "2026-01-05" },
  { id: "4", title: "Data Analyst", department: "Analytics", location: "Remote", type: "Contract", applicants: 19, status: "closed", posted: "2025-11-28" },
  { id: "5", title: "Customer Success Manager", department: "Sales", location: "Austin", type: "Full-time", applicants: 22, status: "active", posted: "2026-01-02" },
];

const hiringPipeline = [
  { stage: "Applied", count: 146 },
  { stage: "Screening", count: 78 },
  { stage: "Interview", count: 34 },
  { stage: "Offer", count: 12 },
  { stage: "Hired", count: 8 },
];

export function HumanResources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Human Resources</h2>
            <p className="text-[#5A4079]">
              Employee management, attendance, and HR operations
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg neon-button">
          <Plus className="mr-2 h-4 w-4" />
          New Employee
        </Button>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="bg-white/80 border border-[#937CB4]/30">
          <TabsTrigger value="attendance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#422462] data-[state=active]:to-[#5A4079] data-[state=active]:text-white">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="self-service" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#422462] data-[state=active]:to-[#5A4079] data-[state=active]:text-white">
            Employee Self Service
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#422462] data-[state=active]:to-[#5A4079] data-[state=active]:text-white">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#422462] data-[state=active]:to-[#5A4079] data-[state=active]:text-white">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="job-management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#422462] data-[state=active]:to-[#5A4079] data-[state=active]:text-white">
            Job Management
          </TabsTrigger>
        </TabsList>
 
        <TabsContent value="attendance" className="space-y-4">
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
                        <p className="text-sm text-[#5A4079]">{record.date}</p>
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
                  <Bar dataKey="present" fill="#422462" name="Present" />
                  <Bar dataKey="absent" fill="#937CB4" name="Absent" />
                  <Bar dataKey="late" fill="#5A4079" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="self-service" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="gradient-card border-[#937CB4]/30">
              <CardHeader>
                <CardTitle className="text-[#200B43] flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#422462]" />
                  Leave Requests
                </CardTitle>
                <CardDescription className="text-[#5A4079]">Employee leave applications and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.map((leave) => (
                    <div key={leave.id} className="p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[#200B43]">{leave.employee}</p>
                          <p className="text-sm text-[#5A4079]">{leave.type} • {leave.days} days</p>
                        </div>
                        <Badge 
                          variant={leave.status === "approved" ? "default" : "secondary"}
                          className={leave.status === "approved" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                        >
                          {leave.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[#5A4079]">From:</span> <span className="font-medium text-[#200B43]">{new Date(leave.from).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[#5A4079]">To:</span> <span className="font-medium text-[#200B43]">{new Date(leave.to).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#5A4079]">{leave.reason}</p>
                      {leave.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">Approve</Button>
                          <Button size="sm" variant="outline" className="border-[#937CB4]/30">Reject</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-[#937CB4]/30">
              <CardHeader>
                <CardTitle className="text-[#200B43] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#422462]" />
                  Employee Documents
                </CardTitle>
                <CardDescription className="text-[#5A4079]">Access and manage employee documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employeeDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-[#200B43]">{doc.name}</p>
                          <p className="text-sm text-[#5A4079]">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#5A4079]">{new Date(doc.date).toLocaleDateString()}</p>
                        <Button size="sm" variant="ghost" className="text-[#422462] hover:bg-[#F0E9FF]/70">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
 
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Total Tasks</CardTitle>
                <Briefcase className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">{tasks.length}</div>
                <p className="text-xs text-[#422462]">Active assignments</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Completed</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">{tasks.filter(t => t.status === "completed").length}</div>
                <p className="text-xs text-[#422462]">Tasks finished</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">In Progress</CardTitle>
                <Clock className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">{tasks.filter(t => t.status === "in-progress").length}</div>
                <p className="text-xs text-[#422462]">Currently working</p>
              </CardContent>
            </Card>
          </div>

          <Card className="gradient-card border-[#937CB4]/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#200B43]">Task Management</CardTitle>
                  <CardDescription className="text-[#5A4079]">Track and manage HR tasks and assignments</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-[#200B43]">{task.title}</p>
                          <Badge 
                            variant={task.priority === "high" ? "destructive" : "secondary"}
                            className={task.priority === "high" ? "bg-gradient-to-r from-[#d4183d] to-[#a01530]" : ""}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#5A4079]">Assigned to: {task.assignedTo}</p>
                        <p className="text-sm text-[#5A4079]">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Badge 
                        variant={task.status === "completed" ? "default" : task.status === "in-progress" ? "secondary" : "outline"}
                        className={task.status === "completed" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#5A4079]">Progress</span>
                        <span className="font-medium text-[#200B43]">{task.completion}%</span>
                      </div>
                      <div className="w-full bg-[#F0E9FF] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#422462] to-[#937CB4] h-2 rounded-full transition-all" 
                          style={{ width: `${task.completion}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-[#937CB4]/30">Edit</Button>
                      <Button size="sm" variant="outline" className="border-[#937CB4]/30">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Total Expenses</CardTitle>
                <DollarSign className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">$33,000</div>
                <p className="text-xs text-[#422462]">This month</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Pending Approval</CardTitle>
                <Clock className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">${expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</div>
                <p className="text-xs text-[#422462]">{expenses.filter(e => e.status === "pending").length} requests</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Approved</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">${expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</div>
                <p className="text-xs text-[#422462]">{expenses.filter(e => e.status === "approved").length} approved</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="gradient-card border-[#937CB4]/30">
              <CardHeader>
                <CardTitle className="text-[#200B43]">Recent Expense Claims</CardTitle>
                <CardDescription className="text-[#5A4079]">Employee expense submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[#200B43]">{expense.employee}</p>
                          <p className="text-sm text-[#5A4079]">{expense.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#200B43]">${expense.amount}</p>
                          <Badge 
                            variant={expense.status === "approved" ? "default" : "secondary"}
                            className={expense.status === "approved" ? "bg-gradient-to-r from-[#422462] to-[#5A4079] mt-1" : "mt-1"}
                          >
                            {expense.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-[#5A4079]">{expense.description}</p>
                      <p className="text-xs text-[#5A4079]">{new Date(expense.date).toLocaleDateString()}</p>
                      {expense.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">Approve</Button>
                          <Button size="sm" variant="outline" className="border-[#937CB4]/30">Reject</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-[#937CB4]/30">
              <CardHeader>
                <CardTitle className="text-[#200B43]">Expenses by Category</CardTitle>
                <CardDescription className="text-[#5A4079]">Monthly expense breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expensesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#5A4079" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#5A4079" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #937CB4',
                        borderRadius: '8px',
                        color: '#200B43',
                        boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                      }}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="amount" fill="#422462" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
 
        <TabsContent value="job-management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Active Openings</CardTitle>
                <Briefcase className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">{jobOpenings.filter(j => j.status === "active").length}</div>
                <p className="text-xs text-[#422462]">Open positions</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Total Applicants</CardTitle>
                <User className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">{jobOpenings.reduce((sum, j) => sum + j.applicants, 0)}</div>
                <p className="text-xs text-[#422462]">All positions</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">In Interview</CardTitle>
                <Clock className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">34</div>
                <p className="text-xs text-[#422462]">Active interviews</p>
              </CardContent>
            </Card>

            <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">Offers Sent</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-[#422462]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#200B43]">12</div>
                <p className="text-xs text-[#422462]">Pending acceptance</p>
              </CardContent>
            </Card>
          </div>

          <Card className="gradient-card border-[#937CB4]/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#200B43]">Job Openings</CardTitle>
                  <CardDescription className="text-[#5A4079]">Current job positions and applications</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobOpenings.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#200B43]">{job.title}</h3>
                          <Badge 
                            variant={job.status === "active" ? "default" : "secondary"}
                            className={job.status === "active" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#5A4079]">{job.department} • {job.location} • {job.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#200B43]">{job.applicants}</p>
                        <p className="text-xs text-[#5A4079]">Applicants</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#5A4079]">Posted: {new Date(job.posted).toLocaleDateString()}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-[#937CB4]/30">View Applicants</Button>
                        <Button size="sm" variant="outline" className="border-[#937CB4]/30">Edit</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-[#937CB4]/30">
            <CardHeader>
              <CardTitle className="text-[#200B43]">Hiring Pipeline</CardTitle>
              <CardDescription className="text-[#5A4079]">Candidate progression through recruitment stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hiringPipeline} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                  <XAxis type="number" stroke="#5A4079" />
                  <YAxis type="category" dataKey="stage" stroke="#5A4079" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #937CB4',
                      borderRadius: '8px',
                      color: '#200B43',
                      boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                    }}
                  />
                  <Bar dataKey="count" fill="#422462" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
