import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 145000, expenses: 42000, profit: 103000, transactions: 1250 },
  { month: "Feb", revenue: 168000, expenses: 45000, profit: 123000, transactions: 1420 },
  { month: "Mar", revenue: 182000, expenses: 48000, profit: 134000, transactions: 1580 },
  { month: "Apr", revenue: 195000, expenses: 51000, profit: 144000, transactions: 1720 },
  { month: "May", revenue: 218000, expenses: 54000, profit: 164000, transactions: 1890 },
  { month: "Jun", revenue: 245000, expenses: 58000, profit: 187000, transactions: 2100 },
];

const transactions = [
  { id: "TXN-001", user: "john.doe@email.com", amount: 299, plan: "Enterprise", status: "success", date: "2026-02-18", method: "Credit Card" },
  { id: "TXN-002", user: "sarah.smith@email.com", amount: 99, plan: "Pro", status: "success", date: "2026-02-18", method: "PayPal" },
  { id: "TXN-003", user: "mike.chen@email.com", amount: 29, plan: "Basic", status: "success", date: "2026-02-17", method: "Credit Card" },
  { id: "TXN-004", user: "emily.davis@email.com", amount: 99, plan: "Pro", status: "pending", date: "2026-02-17", method: "Bank Transfer" },
  { id: "TXN-005", user: "tom.brown@email.com", amount: 29, plan: "Basic", status: "failed", date: "2026-02-16", method: "Credit Card" },
  { id: "TXN-006", user: "lisa.wang@email.com", amount: 299, plan: "Enterprise", status: "success", date: "2026-02-16", method: "Credit Card" },
  { id: "TXN-007", user: "alex.johnson@email.com", amount: 99, plan: "Pro", status: "success", date: "2026-02-15", method: "PayPal" },
  { id: "TXN-008", user: "nina.patel@email.com", amount: 29, plan: "Basic", status: "success", date: "2026-02-15", method: "Credit Card" },
];

const refunds = [
  { id: "REF-001", user: "mark.taylor@email.com", amount: 99, reason: "Service not as expected", date: "2026-02-17", status: "processed" },
  { id: "REF-002", user: "jenny.lee@email.com", amount: 29, reason: "Accidental purchase", date: "2026-02-16", status: "pending" },
  { id: "REF-003", user: "david.kim@email.com", amount: 299, reason: "Technical issues", date: "2026-02-14", status: "processed" },
];

export function AdminFinancials() {
  const [dateRange, setDateRange] = useState("30");

  const stats = [
    {
      label: "Total Revenue",
      value: "$1.15M",
      change: "+15.2%",
      trend: "up",
      gradient: "from-[#422462] to-[#5A4079]"
    },
    {
      label: "Net Profit",
      value: "$855K",
      change: "+18.4%",
      trend: "up",
      gradient: "from-[#5A4079] to-[#937CB4]"
    },
    {
      label: "Transactions",
      value: "9,960",
      change: "+12.8%",
      trend: "up",
      gradient: "from-[#937CB4] to-[#5A4079]"
    },
    {
      label: "Avg Transaction",
      value: "$115",
      change: "+2.1%",
      trend: "up",
      gradient: "from-[#422462] to-[#937CB4]"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </p>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
      <Card className="gradient-card border-[#937CB4]/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-[#422462]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <Button
              variant="outline"
              className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue & Profit Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#422462" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#422462" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5A4079" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5A4079" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
              <XAxis dataKey="month" stroke="#5A4079" />
              <YAxis stroke="#5A4079" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #937CB4',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#422462" fillOpacity={1} fill="url(#revenueGrad)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#5A4079" fillOpacity={1} fill="url(#profitGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.status === "success" ? "bg-green-100" :
                    txn.status === "pending" ? "bg-yellow-100" :
                    "bg-red-100"
                  }`}>
                    {txn.status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {txn.status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                    {txn.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#200B43]">{txn.id}</p>
                    <p className="text-sm text-[#5A4079]">{txn.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#200B43]">${txn.amount}</p>
                  <p className="text-xs text-[#5A4079]">{txn.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#5A4079]">{txn.method}</p>
                  <p className="text-xs text-[#958CA7]">{txn.date}</p>
                </div>
                <Badge className={
                  txn.status === "success" ? "bg-green-500 text-white" :
                  txn.status === "pending" ? "bg-yellow-500 text-white" :
                  "bg-red-500 text-white"
                }>
                  {txn.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Recent Refunds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-50 to-white border border-red-200 hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-medium text-[#200B43]">{refund.id}</p>
                  <p className="text-sm text-[#5A4079]">{refund.user}</p>
                  <p className="text-xs text-[#958CA7] mt-1">{refund.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">${refund.amount}</p>
                  <p className="text-xs text-[#958CA7]">{refund.date}</p>
                </div>
                <Badge className={refund.status === "processed" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                  {refund.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
