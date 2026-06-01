import { CreditCard, Plus, TrendingUp, DollarSign, Calendar, Sparkles, FileText, CheckCircle2, XCircle, Clock, Target, Award, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useState, useEffect } from "react";
import { proposalService } from "../services/proposalService";
import { invoiceService } from "../services/revenueService";

export function BizDevBilling() {
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  
  // Dashboard Metrics
  const [stats, setStats] = useState([
    { label: "Monthly Revenue", value: "₹0", change: "0%", gradient: "from-[#422462] to-[#5A4079]", icon: DollarSign },
    { label: "Total Transactions", value: "0", change: "0%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
    { label: "Active Clients", value: "0", change: "0%", gradient: "from-[#937CB4] to-[#5A4079]", icon: Calendar },
    { label: "Pending Payments", value: "0", change: "0%", gradient: "from-[#422462] to-[#937CB4]", icon: CreditCard },
  ]);

  // Conversion Tracking Card
  const [conversionStats, setConversionStats] = useState({
    proposed: 0,
    converted: 0,
    rejected: 0,
    pending: 0,
    rate: "0.0"
  });

  // Chart Data
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Detailed Table
  const [proposalToBilling, setProposalToBilling] = useState<any[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const parsedUser = JSON.parse(data);
      if (parsedUser.organizationId) {
        setOrgId(Number(parsedUser.organizationId));
      }
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      fetchDashboardData();
    }
  }, [orgId]);

  const fetchDashboardData = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      // 1. Fetch Finance Stats
      const currentYear = new Date().getFullYear();
      const financeRes = await invoiceService.getByOrgForFinance(orgId, currentYear);
      const invoices = financeRes.data.invoices || [];
      
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = invoices
        .filter((inv: any) => new Date(inv.Date).getMonth() === currentMonth)
        .reduce((sum: number, inv: any) => sum + (parseFloat(inv.Total) || 0), 0);
      
      const pendingCount = invoices.filter((inv: any) => inv.status === "Pending").length;

      // 2. Fetch Conversion Stats
      const conversionRes = await proposalService.getConversionStats(orgId);
      const cData = conversionRes.data;
      
      // Transform backend arrays into charts objects
      const transformedChartData = (cData.labels || []).map((label: string, i: number) => ({
        month: label,
        proposed: (cData.proposalCounts && cData.proposalCounts[i]) || 0,
        converted: (cData.achievedCounts && cData.achievedCounts[i]) || 0,
        rejected: 0,
        pending: ((cData.proposalCounts && cData.proposalCounts[i]) || 0) - ((cData.achievedCounts && cData.achievedCounts[i]) || 0)
      }));

      const totalProposed = (cData.proposalCounts || []).reduce((a: number, b: number) => a + b, 0);
      const totalConverted = (cData.achievedCounts || []).reduce((a: number, b: number) => a + b, 0);
      
      // 3. Update Detailed List (Fetch from general table data for now)
      const tableRes = await proposalService.getTableData(orgId, { page: 0, pageSize: 10 });
      const proposals = tableRes.data.praposals || [];
      
      const detailedMapping = proposals.map((p: any) => ({
        proposalId: p.invoiceId || `PRO-${p.id}`,
        client: p.name,
        proposalValue: `₹${p.pricing?.toLocaleString('en-IN')}`,
        proposalDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A',
        status: p.status === "Approval" ? "Converted" : p.status,
        invoiceId: p.status === "Approval" ? `INV-${p.id}` : "-",
        invoiceAmount: p.status === "Approval" ? `₹${p.pricing?.toLocaleString('en-IN')}` : "-",
        billingDate: p.status === "Approval" ? new Date(p.Date || p.createdAt).toLocaleDateString() : "-",
        conversionDays: 0
      }));

      setStats([
        { label: "Monthly Revenue", value: `₹${(monthlyRevenue / 1000).toFixed(0)}K`, change: "+0%", gradient: "from-[#422462] to-[#5A4079]", icon: DollarSign },
        { label: "Total Transactions", value: invoices.length.toString(), change: "+0%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
        { label: "Active Clients", value: [...new Set(invoices.map((i: any) => i.clientName))].length.toString(), change: "+0%", gradient: "from-[#937CB4] to-[#5A4079]", icon: Calendar },
        { label: "Pending Payments", value: pendingCount.toString(), change: "-0%", gradient: "from-[#422462] to-[#937CB4]", icon: CreditCard },
      ]);

      setConversionStats({
        proposed: totalProposed,
        converted: totalConverted,
        rejected: 0,
        pending: totalProposed - totalConverted,
        rate: totalProposed > 0 ? ((totalConverted / totalProposed) * 100).toFixed(1) : "0.0"
      });

      setChartData(transformedChartData);
      setProposalToBilling(detailedMapping);

    } catch (error) {
      console.error("Error fetching billing dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="col-span-4 flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-[#422462] animate-spin" />
            <span className="ml-3 text-[#5A4079] font-medium">Loading Dashboard Data...</span>
          </div>
        ) : stats.map((stat, index) => {
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
            <p className="text-2xl font-bold text-[#200B43]">{conversionStats.proposed}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-green-300 bg-green-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-700 font-medium">Converted</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{conversionStats.converted}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-red-300 bg-red-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <p className="text-xs text-red-700 font-medium">Rejected</p>
            </div>
            <p className="text-2xl font-bold text-red-700">{conversionStats.rejected}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-yellow-300 bg-yellow-50/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-yellow-700 font-medium">Pending</p>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{conversionStats.pending}</p>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-[#937CB4]/30 bg-gradient-to-br from-[#422462]/10 to-[#937CB4]/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#422462]" />
              <p className="text-xs text-[#5A4079] font-medium">Success Rate</p>
            </div>
            <p className="text-2xl font-bold gradient-text">{conversionStats.rate}%</p>
          </div>
        </div>
 
        <div className="bg-white/60 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-[#200B43] mb-4">Monthly Proposal Conversion Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
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