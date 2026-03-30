import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, FileText, CreditCard, AlertCircle, Plus } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 245000, expenses: 168000, profit: 77000 },
  { month: "Feb", revenue: 268000, expenses: 172000, profit: 96000 },
  { month: "Mar", revenue: 252000, expenses: 165000, profit: 87000 },
  { month: "Apr", revenue: 298000, expenses: 185000, profit: 113000 },
  { month: "May", revenue: 312000, expenses: 192000, profit: 120000 },
  { month: "Jun", revenue: 335000, expenses: 198000, profit: 137000 },
];

const cashFlowData = [
  { week: "Week 1", inflow: 85000, outflow: 62000 },
  { week: "Week 2", inflow: 92000, outflow: 58000 },
  { week: "Week 3", inflow: 78000, outflow: 71000 },
  { week: "Week 4", inflow: 105000, outflow: 65000 },
];

const invoices = [
  { id: "INV-2401", client: "TechCorp Industries", amount: "₹45,250", dueDate: "2026-01-15", status: "overdue" },
  { id: "INV-2402", client: "Global Solutions Ltd", amount: "₹28,900", dueDate: "2026-01-18", status: "pending" },
  { id: "INV-2403", client: "Innovation Partners", amount: "₹67,500", dueDate: "2026-01-20", status: "pending" },
  { id: "INV-2404", client: "Enterprise Systems", amount: "₹52,800", dueDate: "2026-01-12", status: "paid" },
  { id: "INV-2405", client: "Digital Ventures", amount: "₹38,400", dueDate: "2026-01-25", status: "pending" },
];

const expenses = [
  { id: "EXP-1245", category: "Office Supplies", vendor: "Office Depot", amount: "₹2,450", date: "2026-01-08", status: "approved" },
  { id: "EXP-1246", category: "Software Licenses", vendor: "Microsoft", amount: "₹15,600", date: "2026-01-09", status: "pending" },
  { id: "EXP-1247", category: "Travel", vendor: "American Airlines", amount: "₹3,280", date: "2026-01-10", status: "approved" },
  { id: "EXP-1248", category: "Marketing", vendor: "Google Ads", amount: "₹8,500", date: "2026-01-10", status: "pending" },
  { id: "EXP-1249", category: "Equipment", vendor: "Dell", amount: "₹12,400", date: "2026-01-11", status: "pending" },
];

const budgetData = [
  { department: "Engineering", allocated: 450000, spent: 342000, remaining: 108000 },
  { department: "Sales", allocated: 320000, spent: 285000, remaining: 35000 },
  { department: "Marketing", allocated: 280000, spent: 195000, remaining: 85000 },
  { department: "Operations", allocated: 420000, spent: 378000, remaining: 42000 },
  { department: "HR", allocated: 180000, spent: 142000, remaining: 38000 },
];

export function Finance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Financial management, invoicing, and budget tracking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.71M</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹630K</div>
            <p className="text-xs text-muted-foreground">
              Margin: 36.8%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding AR</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹232K</div>
            <p className="text-xs text-muted-foreground">
              12 pending invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹845K</div>
            <p className="text-xs text-muted-foreground">
              +₹42K this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trends</CardTitle>
                <CardDescription>Monthly financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Weekly cash inflow and outflow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inflow" fill="#10b981" name="Inflow" />
                    <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36.8%</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>+2.4% from last quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1.08M</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>+8.2% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹180K/mo</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>47 months runway</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{invoice.id}</CardTitle>
                    <CardDescription>{invoice.client}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{invoice.amount}</div>
                    <Badge 
                      variant={invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"}
                      className="mt-1"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Invoice</Button>
                    {invoice.status !== "paid" && (
                      <>
                        <Button size="sm">Mark as Paid</Button>
                        <Button size="sm" variant="outline">Send Reminder</Button>
                      </>
                    )}
                  </div>
                </div>
                {invoice.status === "overdue" && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>This invoice is overdue</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{expense.id} - {expense.category}</CardTitle>
                    <CardDescription>{expense.vendor} • {new Date(expense.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{expense.amount}</div>
                    <Badge variant={expense.status === "approved" ? "default" : "secondary"} className="mt-1">
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {expense.status === "pending" && (
                    <>
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="outline">Reject</Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">View Receipt</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization by Department</CardTitle>
              <CardDescription>Q1 2026 budget allocation and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
                  <Bar dataKey="spent" fill="#10b981" name="Spent" />
                  <Bar dataKey="remaining" fill="#f59e0b" name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {budgetData.map((dept, index) => {
              const utilizationPercent = Math.round((dept.spent / dept.allocated) * 100);
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{dept.department}</CardTitle>
                      <Badge variant={utilizationPercent > 90 ? "destructive" : utilizationPercent > 75 ? "secondary" : "default"}>
                        {utilizationPercent}% Utilized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Allocated</p>
                          <p className="font-bold">${(dept.allocated / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Spent</p>
                          <p className="font-bold">${(dept.spent / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remaining</p>
                          <p className="font-bold">${(dept.remaining / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Budget Usage</span>
                          <span className="font-medium">{utilizationPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${utilizationPercent > 90 ? 'bg-red-500' : utilizationPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${utilizationPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}