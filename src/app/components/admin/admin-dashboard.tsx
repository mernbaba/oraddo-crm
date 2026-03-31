import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  UserCheck,
  UserX,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 145000, users: 1250, mrr: 42000 },
  { month: "Feb", revenue: 168000, users: 1420, mrr: 48000 },
  { month: "Mar", revenue: 182000, users: 1580, mrr: 52000 },
  { month: "Apr", revenue: 195000, users: 1720, mrr: 58000 },
  { month: "May", revenue: 218000, users: 1890, mrr: 64000 },
  { month: "Jun", revenue: 245000, users: 2100, mrr: 72000 },
];

const planDistribution = [
  { name: "Free", value: 850, color: "#937CB4" },
  { name: "Basic", value: 680, color: "#5A4079" },
  { name: "Pro", value: 420, color: "#422462" },
  { name: "Enterprise", value: 150, color: "#200B43" },
];

const queryData = [
  { day: "Mon", open: 45, resolved: 38, pending: 12 },
  { day: "Tue", open: 52, resolved: 45, pending: 15 },
  { day: "Wed", open: 38, resolved: 42, pending: 8 },
  { day: "Thu", open: 48, resolved: 40, pending: 16 },
  { day: "Fri", open: 55, resolved: 48, pending: 18 },
  { day: "Sat", open: 32, resolved: 28, pending: 10 },
  { day: "Sun", open: 28, resolved: 25, pending: 8 },
];

const recentActivity = [
  { id: 1, type: "user", action: "New user registered", user: "john.doe@email.com", time: "2 minutes ago", status: "success" },
  { id: 2, type: "payment", action: "Payment received", user: "sarah.smith@email.com", time: "8 minutes ago", status: "success" },
  { id: 3, type: "upgrade", action: "Plan upgraded to Pro", user: "mike.chen@email.com", time: "15 minutes ago", status: "info" },
  { id: 4, type: "query", action: "New support query", user: "emily.davis@email.com", time: "23 minutes ago", status: "warning" },
  { id: 5, type: "cancel", action: "Subscription cancelled", user: "tom.brown@email.com", time: "35 minutes ago", status: "error" },
  { id: 6, type: "payment", action: "Payment received", user: "lisa.wang@email.com", time: "42 minutes ago", status: "success" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Users</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#200B43]">2,100</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">
                +12.5% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5A4079]/10 to-transparent rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Monthly Revenue</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#5A4079] to-[#422462] flex items-center justify-center shadow-md">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#200B43]">$245K</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">
                +18.2% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#422462]/10 to-transparent rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Active Subscriptions</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#422462] to-[#200B43] flex items-center justify-center shadow-md">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#200B43]">1,250</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">
                +8.4% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 via-[#5A4079]/10 to-transparent rounded-full blur-2xl animate-gradient"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">MRR</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] via-[#5A4079] to-[#422462] flex items-center justify-center animate-gradient shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#200B43]">$72K</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">
                +15.8% from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Revenue & User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs key="admin-revenue-defs">
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#422462" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#422462" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A4079" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#5A4079" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="admin-revenue-grid" strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                <XAxis key="admin-revenue-xaxis" dataKey="month" stroke="#5A4079" />
                <YAxis key="admin-revenue-yaxis" stroke="#5A4079" />
                <Tooltip
                  key="admin-revenue-tooltip"
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #937CB4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                  }}
                />
                <Legend key="admin-revenue-legend" />
                <Area key="admin-revenue-area" type="monotone" dataKey="revenue" stroke="#422462" fillOpacity={1} fill="url(#revenueGradient)" name="Revenue ($)" />
                <Area key="admin-users-area" type="monotone" dataKey="users" stroke="#5A4079" fillOpacity={1} fill="url(#usersGradient)" name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`admin-plan-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  key="admin-plan-tooltip"
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #937CB4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Support Query Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={queryData}>
                <CartesianGrid key="admin-query-grid" strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                <XAxis key="admin-query-xaxis" dataKey="day" stroke="#5A4079" />
                <YAxis key="admin-query-yaxis" stroke="#5A4079" />
                <Tooltip
                  key="admin-query-tooltip"
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #937CB4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                  }}
                />
                <Legend key="admin-query-legend" />
                <Bar key="admin-query-open" dataKey="open" fill="#937CB4" name="Opened" />
                <Bar key="admin-query-resolved" dataKey="resolved" fill="#422462" name="Resolved" />
                <Bar key="admin-query-pending" dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20 hover:shadow-md transition-all"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#200B43]">{activity.action}</p>
                    <p className="text-xs text-[#5A4079]">{activity.user}</p>
                    <p className="text-xs text-[#958CA7] mt-1">{activity.time}</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-[#937CB4] opacity-60" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">New Users Today</CardTitle>
            <UserCheck className="h-5 w-5 text-[#5A4079]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">24</div>
            <p className="text-xs text-[#5A4079] mt-1">+4 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Churned Users</CardTitle>
            <UserX className="h-5 w-5 text-[#5A4079]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">8</div>
            <p className="text-xs text-[#5A4079] mt-1">3.8% churn rate</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Open Queries</CardTitle>
            <Activity className="h-5 w-5 text-[#5A4079]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">42</div>
            <p className="text-xs text-[#5A4079] mt-1">Avg response: 2.4h</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Active Coupons</CardTitle>
            <Sparkles className="h-5 w-5 text-[#5A4079]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">18</div>
            <p className="text-xs text-[#5A4079] mt-1">125 redemptions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}