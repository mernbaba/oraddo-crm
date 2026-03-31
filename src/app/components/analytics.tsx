import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TrendingUp, TrendingDown, Clock, Target, Zap, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const performanceData = [
  { date: "Jan 1", efficiency: 82, throughput: 45, quality: 88 },
  { date: "Jan 2", efficiency: 85, throughput: 48, quality: 90 },
  { date: "Jan 3", efficiency: 80, throughput: 42, quality: 85 },
  { date: "Jan 4", efficiency: 88, throughput: 52, quality: 92 },
  { date: "Jan 5", efficiency: 90, throughput: 55, quality: 94 },
  { date: "Jan 6", efficiency: 87, throughput: 50, quality: 91 },
  { date: "Jan 7", efficiency: 92, throughput: 58, quality: 95 },
];

const departmentData = [
  { department: "Sales", processes: 45, avgTime: 2.3, satisfaction: 92 },
  { department: "HR", processes: 32, avgTime: 4.1, satisfaction: 88 },
  { department: "IT", processes: 58, avgTime: 1.8, satisfaction: 95 },
  { department: "Finance", processes: 41, avgTime: 3.2, satisfaction: 90 },
  { department: "Operations", processes: 67, avgTime: 2.9, satisfaction: 87 },
];

const processTypeData = [
  { type: "Onboarding", count: 28, avgDuration: 5.2 },
  { type: "Approvals", count: 45, avgDuration: 2.1 },
  { type: "Customer Service", count: 89, avgDuration: 1.3 },
  { type: "Financial", count: 34, avgDuration: 3.8 },
  { type: "Procurement", count: 23, avgDuration: 6.5 },
  { type: "IT Requests", count: 56, avgDuration: 2.7 },
];

const bottleneckData = [
  { step: "Approval", frequency: 65 },
  { step: "Documentation", frequency: 48 },
  { step: "Review", frequency: 42 },
  { step: "Resource Allocation", frequency: 38 },
  { step: "Verification", frequency: 32 },
];

const processMaturityData = [
  { metric: "Automation", value: 85 },
  { metric: "Efficiency", value: 78 },
  { metric: "Compliance", value: 92 },
  { metric: "Visibility", value: 88 },
  { metric: "Integration", value: 75 },
  { metric: "Optimization", value: 82 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Deep insights into process performance and optimization opportunities
          </p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Process Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+5.2% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Process Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8 days</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingDown className="mr-1 h-3 w-3" />
              <span>-12% faster</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingDown className="mr-1 h-3 w-3" />
              <span>-3.2% from optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Efficiency, throughput, and quality metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="throughput" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="quality" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process Maturity Model</CardTitle>
            <CardDescription>Assessment across key process dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={processMaturityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Maturity Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Process volume and completion time by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="processes" fill="#3b82f6" name="Process Count" />
                <Bar yAxisId="right" dataKey="avgTime" fill="#f59e0b" name="Avg Time (days)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process Type Analysis</CardTitle>
            <CardDescription>Volume and duration by process category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Process Count" />
                <Bar dataKey="avgDuration" fill="#ef4444" name="Avg Duration (days)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottleneck Analysis</CardTitle>
            <CardDescription>Most common process bottlenecks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bottleneckData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Automated process intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-green-700">Efficiency Improvement</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  IT department shows 15% better performance than average. Consider replicating their practices across other departments.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-yellow-700">Approval Bottleneck</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Approval steps cause 65% of delays. Consider implementing automated approval rules for routine requests.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold text-blue-700">Automation Opportunity</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Customer service processes have high volume and low complexity. Potential for 40% automation.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-semibold text-purple-700">Resource Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Team utilization is below optimal (78.5%). Workload rebalancing could improve by 8-10%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
