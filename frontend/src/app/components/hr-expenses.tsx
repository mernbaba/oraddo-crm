import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DollarSign, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

export function HRExpenses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Expenses</h2>
          <p className="text-[#5A4079]">
            Manage and approve employee expense claims
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Expenses</CardTitle>
            <DollarSign className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹33,000</div>
            <p className="text-xs text-[#422462]">This month</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹{expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-[#422462]">{expenses.filter(e => e.status === "pending").length} requests</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Approved</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹{expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</div>
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
                      <p className="font-bold text-[#200B43]">₹{expense.amount}</p>
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
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Bar dataKey="amount" fill="#422462" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}