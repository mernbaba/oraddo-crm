import { CreditCard, Plus, TrendingUp, DollarSign, Calendar, Sparkles, FileText, CheckCircle2, XCircle, Clock, Target, Award } from "lucide-react";
import { Button } from "./ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export function BizDevBilling() {

  const proposalConversionData = [
    { month: "Jul", proposed: 12, converted: 8, rejected: 3, pending: 1 },
    { month: "Aug", proposed: 15, converted: 10, rejected: 4, pending: 1 },
    { month: "Sep", proposed: 10, converted: 7, rejected: 2, pending: 1 },
    { month: "Oct", proposed: 18, converted: 14, rejected: 3, pending: 1 },
    { month: "Nov", proposed: 14, converted: 10, rejected: 3, pending: 1 },
    { month: "Dec", proposed: 20, converted: 16, rejected: 3, pending: 1 },
    { month: "Jan", proposed: 16, converted: 12, rejected: 2, pending: 2 },
  ];

  const proposalToBilling = [
    { 
      proposalId: "PRO-001", 
      client: "Tech Corp", 
      proposalValue: "₹125,000",
      proposalDate: "2023-12-10",
      status: "Converted",
      invoiceId: "INV-2024-001",
      invoiceAmount: "₹137,500",
      billingDate: "2024-01-01",
      conversionDays: 22
    },
    { 
      proposalId: "PRO-002", 
      client: "Digital Solutions", 
      proposalValue: "₹89,500",
      proposalDate: "2023-12-15",
      status: "Converted",
      invoiceId: "INV-2024-002",
      invoiceAmount: "₹98,450",
      billingDate: "2024-01-05",
      conversionDays: 21
    },
    { 
      proposalId: "PRO-003", 
      client: "Future Systems", 
      proposalValue: "₹156,000",
      proposalDate: "2023-12-20",
      status: "Converted",
      invoiceId: "INV-2024-003",
      invoiceAmount: "₹171,600",
      billingDate: "2023-12-20",
      conversionDays: 0
    },
    { 
      proposalId: "PRO-004", 
      client: "Global Enterprises", 
      proposalValue: "₹203,000",
      proposalDate: "2023-12-28",
      status: "Converted",
      invoiceId: "INV-2024-004",
      invoiceAmount: "₹223,300",
      billingDate: "2024-01-10",
      conversionDays: 13
    },
    { 
      proposalId: "PRO-007", 
      client: "Smart Tech", 
      proposalValue: "₹95,000",
      proposalDate: "2024-01-02",
      status: "Pending",
      invoiceId: "-",
      invoiceAmount: "-",
      billingDate: "-",
      conversionDays: 0
    },
    { 
      proposalId: "PRO-008", 
      client: "Innovation Corp", 
      proposalValue: "₹180,000",
      proposalDate: "2024-01-05",
      status: "Pending",
      invoiceId: "-",
      invoiceAmount: "-",
      billingDate: "-",
      conversionDays: 0
    },
    { 
      proposalId: "PRO-006", 
      client: "Innovation Labs", 
      proposalValue: "₹175,000",
      proposalDate: "2024-01-03",
      status: "Rejected",
      invoiceId: "-",
      invoiceAmount: "-",
      billingDate: "-",
      conversionDays: 0
    },
  ];

  const totalProposed = proposalConversionData.reduce((sum, item) => sum + item.proposed, 0);
  const totalConverted = proposalConversionData.reduce((sum, item) => sum + item.converted, 0);
  const totalRejected = proposalConversionData.reduce((sum, item) => sum + item.rejected, 0);
  const totalPending = proposalConversionData.reduce((sum, item) => sum + item.pending, 0);
  const conversionRate = ((totalConverted / totalProposed) * 100).toFixed(1);

  const monthlyData = [
    { month: "Jul", amount: 45000 },
    { month: "Aug", amount: 52000 },
    { month: "Sep", amount: 48000 },
    { month: "Oct", amount: 61000 },
    { month: "Nov", amount: 58000 },
    { month: "Dec", amount: 72000 },
    { month: "Jan", amount: 68000 },
  ];

  const paymentMethods = [
    { name: "Credit Card", value: 45, color: "#422462" },
    { name: "Bank Transfer", value: 30, color: "#5A4079" },
    { name: "PayPal", value: 15, color: "#937CB4" },
    { name: "Others", value: 10, color: "#958CA7" },
  ];

  const recentTransactions = [
    { id: "TXN-001", client: "Tech Corp", amount: "₹125,000", method: "Bank Transfer", date: "2024-01-08", status: "Completed" },
    { id: "TXN-002", client: "Digital Solutions", amount: "₹89,500", method: "Credit Card", date: "2024-01-07", status: "Completed" },
    { id: "TXN-003", client: "Future Systems", amount: "₹156,000", method: "Bank Transfer", date: "2024-01-06", status: "Processing" },
    { id: "TXN-004", client: "Global Enterprises", amount: "₹203,000", method: "Credit Card", date: "2024-01-05", status: "Completed" },
  ];

  const stats = [
    { label: "Monthly Revenue", value: "₹68K", change: "+12%", gradient: "from-[#422462] to-[#5A4079]", icon: DollarSign },
    { label: "Total Transactions", value: "342", change: "+18%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
    { label: "Active Clients", value: "89", change: "+8%", gradient: "from-[#937CB4] to-[#5A4079]", icon: Calendar },
    { label: "Pending Payments", value: "12", change: "-5%", gradient: "from-[#422462] to-[#937CB4]", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <CreditCard className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Billing Management</h2>
            <p className="text-[#5A4079]">Track payments and billing analytics</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative z-10">
                <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Icon className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF]/30 to-white/90 backdrop-blur-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-lg opacity-40 animate-pulse"></div>
            <Target className="h-6 w-6 text-[#422462] relative z-10" />
          </div>
          <h3 className="text-xl font-bold gradient-text">Proposal to Billing Conversion Tracking</h3>
        </div>
 
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/30 bg-white/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-[#5A4079]" />
              <p className="text-xs text-[#5A4079] font-medium">Total Proposed</p>
            </div>
            <p className="text-2xl font-bold text-[#200B43]">{totalProposed}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-green-300 bg-green-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-700 font-medium">Converted</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{totalConverted}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-red-300 bg-red-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <p className="text-xs text-red-700 font-medium">Rejected</p>
            </div>
            <p className="text-2xl font-bold text-red-700">{totalRejected}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-yellow-300 bg-yellow-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-yellow-700 font-medium">Pending</p>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{totalPending}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/30 bg-gradient-to-br from-[#422462]/10 to-[#937CB4]/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#422462]" />
              <p className="text-xs text-[#5A4079] font-medium">Success Rate</p>
            </div>
            <p className="text-2xl font-bold gradient-text">{conversionRate}%</p>
          </div>
        </div>
 
        <div className="bg-white/60 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-[#200B43] mb-4">Monthly Proposal Conversion Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={proposalConversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
              <XAxis dataKey="month" stroke="#5A4079" fontSize={12} />
              <YAxis stroke="#5A4079" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #937CB4',
                  borderRadius: '8px'
                }}
              />
              <Line key="line-proposed" type="monotone" dataKey="proposed" stroke="#5A4079" strokeWidth={2} name="Proposed" />
              <Line key="line-converted" type="monotone" dataKey="converted" stroke="#22c55e" strokeWidth={2} name="Converted" />
              <Line key="line-rejected" type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="p-6 border-b border-[#937CB4]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#200B43]">Detailed Proposal → Billing Tracking</h3>
              <p className="text-sm text-[#5A4079] mt-1">Track each proposal from quotation to billing</p>
            </div>
            <Sparkles className="h-5 w-5 text-[#937CB4] animate-pulse-glow" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Proposal ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Proposal Value</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Proposal Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Invoice ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Invoice Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Billing Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Days to Convert</th>
              </tr>
            </thead>
            <tbody>
              {proposalToBilling.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-[#422462]">{item.proposalId}</td>
                  <td className="p-4 text-sm text-[#200B43]">{item.client}</td>
                  <td className="p-4 text-sm font-semibold text-[#5A4079]">{item.proposalValue}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{item.proposalDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      item.status === "Converted" 
                        ? "bg-green-100 text-green-700 border-green-300" 
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-[#422462]">{item.invoiceId}</td>
                  <td className="p-4 text-sm font-semibold gradient-text">{item.invoiceAmount}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{item.billingDate}</td>
                  <td className="p-4">
                    {item.conversionDays > 0 ? (
                      <span className="text-sm font-medium text-[#200B43]">{item.conversionDays} days</span>
                    ) : (
                      <span className="text-sm text-[#958CA7]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}