import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
} from "recharts";
import { invoiceService } from "../services/revenueService";
import { expenseService } from "../services/expenseService";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthRow {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

const emptyYear = (): MonthRow[] =>
  MONTHS.map((m) => ({ month: m, revenue: 0, expense: 0, profit: 0 }));

export function FinanceFinancial() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentYearData, setCurrentYearData] = useState<MonthRow[]>(emptyYear);
  const [prevYearProfit, setPrevYearProfit] = useState(0);
  const [hasPrevYear, setHasPrevYear] = useState(false);
  const [dataYears, setDataYears] = useState<string[]>([]);

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setLoading(false);
      setError("You are not logged in.");
      return;
    }
    try {
      const u = JSON.parse(raw);
      const org = u?.organizationId ?? u?.organizationID;
      if (org != null && org !== "") {
        setOrgId(Number(org));
      } else {
        setLoading(false);
        setError("No organization is linked to your account.");
      }
    } catch {
      setLoading(false);
      setError("Could not read your session. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (orgId == null) return;
    load(orgId, Number(selectedYear));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, selectedYear]);

  const load = async (org: number, yearNum: number) => {
    setLoading(true);
    setError(null);
    try {
      // Revenue = Approved invoices (Total) by createdAt; Expense = employee
      // expenses (amount) by date. Fetch current + previous year invoices for YoY,
      // and all expenses once (bucketed client-side by year).
      const [invCurRes, invPrevRes, expRes] = await Promise.all([
        invoiceService.getByOrgForFinance(org, yearNum),
        invoiceService.getByOrgForFinance(org, yearNum - 1),
        expenseService.getByOrg(org, { page: 0, pageSize: 100000 }),
      ]);

      const curInvoices = invCurRes.data?.invoices ?? [];
      const prevInvoices = invPrevRes.data?.invoices ?? [];
      const expenses =
        (expRes.data as any)?.employeeExpenses ??
        (Array.isArray(expRes.data) ? expRes.data : []);

      const revByMonth = new Array(12).fill(0);
      curInvoices.forEach((inv: any) => {
        const d = new Date(inv.createdAt || inv.Date);
        if (!isNaN(d.getTime())) revByMonth[d.getMonth()] += parseFloat(inv.Total) || 0;
      });

      const expByMonth = new Array(12).fill(0);
      let prevExpense = 0;
      const yearSet = new Set<string>();
      (expenses as any[]).forEach((e) => {
        const d = new Date(e.date || e.createdAt);
        if (isNaN(d.getTime())) return;
        const y = d.getFullYear();
        yearSet.add(String(y));
        const amt = Number(e.amount) || 0;
        if (y === yearNum) expByMonth[d.getMonth()] += amt;
        else if (y === yearNum - 1) prevExpense += amt;
      });

      setCurrentYearData(
        MONTHS.map((m, i) => ({
          month: m,
          revenue: revByMonth[i],
          expense: expByMonth[i],
          profit: revByMonth[i] - expByMonth[i],
        }))
      );

      const prevRevenue = prevInvoices.reduce(
        (s: number, inv: any) => s + (parseFloat(inv.Total) || 0),
        0
      );
      setPrevYearProfit(prevRevenue - prevExpense);
      setHasPrevYear(prevInvoices.length > 0 || prevExpense > 0);
      setDataYears(Array.from(yearSet));
    } catch (e) {
      console.error("Failed to load financial data", e);
      setError("Failed to load financial data. Please try again.");
      setCurrentYearData(emptyYear());
    } finally {
      setLoading(false);
    }
  };

  // ── Derived figures (operate on currentYearData) ──────────────────────────
  const yearlyRevenue = currentYearData.reduce((sum, m) => sum + m.revenue, 0);
  const yearlyExpense = currentYearData.reduce((sum, m) => sum + m.expense, 0);
  const yearlyProfit = yearlyRevenue - yearlyExpense;
  const profitMargin = yearlyRevenue > 0 ? ((yearlyProfit / yearlyRevenue) * 100).toFixed(1) : "0.0";

  const yearOverYearGrowth =
    hasPrevYear && prevYearProfit > 0
      ? ((yearlyProfit - prevYearProfit) / prevYearProfit) * 100
      : 0;

  const monthlyGrowthData = currentYearData.map((month, index) => {
    if (index === 0 || month.profit === 0) {
      return { ...month, growth: 0 };
    }
    const prevMonth = currentYearData[index - 1];
    if (prevMonth.profit === 0) {
      return { ...month, growth: 0 };
    }
    const growth = ((month.profit - prevMonth.profit) / Math.abs(prevMonth.profit)) * 100;
    return { ...month, growth: parseFloat(growth.toFixed(1)) };
  });

  const monthsWithData = currentYearData.filter((m) => m.revenue > 0 || m.expense > 0);
  const profitableMonths = monthsWithData.filter((m) => m.profit > 0).length;
  const lossMonths = monthsWithData.filter((m) => m.profit < 0).length;

  // Year dropdown: years present in data + current and prior two.
  const years = useMemo(() => {
    const s = new Set<string>(dataYears);
    const cy = new Date().getFullYear();
    s.add(String(cy));
    s.add(String(cy - 1));
    s.add(String(cy - 2));
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, [dataYears]);

  const handleGenerateReport = () => {
    const rows = [
      ["Month", "Revenue", "Expense", "Profit/Loss", "Margin %"],
      ...currentYearData.map((m) => [
        m.month,
        m.revenue,
        m.expense,
        m.profit,
        m.revenue > 0 ? ((m.profit / m.revenue) * 100).toFixed(1) : "0.0",
      ]),
      [],
      ["Yearly Total", yearlyRevenue, yearlyExpense, yearlyProfit, profitMargin],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-[#937CB4]/30 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-bold text-[#200B43] mb-2">{data.month}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#5A4079]">Revenue:</span>
              <span className="text-xs font-bold text-green-600">${data.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#5A4079]">Expense:</span>
              <span className="text-xs font-bold text-red-600">${data.expense.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#937CB4]/20">
              <span className="text-xs font-medium text-[#422462]">
                {data.profit >= 0 ? "Profit:" : "Loss:"}
              </span>
              <span className={`text-xs font-bold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${Math.abs(data.profit).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <BarChart3 className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Financial Management
            </h2>
            <p className="text-[#5A4079] text-sm">
              Revenue vs Expense comparison with profit/loss analysis
            </p>
          </div>
        </div>
        <Button
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          {orgId != null && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => load(orgId, Number(selectedYear))}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#422462]" />
          <span className="text-sm font-medium text-[#422462]">Year:</span>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && (
          <span className="flex items-center gap-2 text-sm text-[#5A4079]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {yearOverYearGrowth !== 0 && hasPrevYear && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/30">
              {yearOverYearGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs text-[#5A4079]">YoY Growth:</span>
              <span className={`text-sm font-bold ${yearOverYearGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {yearOverYearGrowth >= 0 ? "+" : ""}
                {yearOverYearGrowth.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-green-600 font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">${yearlyRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-green-600">Yearly {selectedYear}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-red-600 font-medium mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">${yearlyExpense.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-red-600">Yearly {selectedYear}</p>
        </div>

        <div
          className={`relative overflow-hidden rounded-xl border p-5 shadow-md hover:shadow-lg transition-all ${
            yearlyProfit >= 0
              ? "border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF] to-white"
              : "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={`text-xs font-medium mb-1 ${yearlyProfit >= 0 ? "text-[#422462]" : "text-orange-600"}`}>
                Net {yearlyProfit >= 0 ? "Profit" : "Loss"}
              </p>
              <p className={`text-2xl font-bold ${yearlyProfit >= 0 ? "text-[#200B43]" : "text-orange-700"}`}>
                ${Math.abs(yearlyProfit).toLocaleString()}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                yearlyProfit >= 0
                  ? "bg-gradient-to-br from-[#937CB4] to-[#422462]"
                  : "bg-gradient-to-br from-orange-500 to-orange-600"
              }`}
            >
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className={`text-xs ${yearlyProfit >= 0 ? "text-[#5A4079]" : "text-orange-600"}`}>
            Yearly {selectedYear}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Profit Margin</p>
              <p className="text-2xl font-bold text-blue-700">{profitMargin}%</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600">
              {profitableMonths} Profitable / {lossMonths} Loss
            </span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 p-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#200B43]">Revenue vs Expense - Monthly Comparison</h3>
              <p className="text-sm text-[#5A4079]">Track monthly performance throughout {selectedYear}</p>
            </div>
            <Sparkles className="h-6 w-6 text-[#937CB4] animate-pulse-glow" />
          </div>
          {monthsWithData.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center text-[#5A4079]">
              <BarChart3 className="h-12 w-12 text-[#937CB4] mb-3" />
              <p>No financial activity recorded for {selectedYear} yet.</p>
              <p className="text-xs mt-1">Approved invoices count as revenue; submitted expenses count as costs.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={currentYearData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                <XAxis dataKey="month" stroke="#5A4079" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#5A4079" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area type="monotone" dataKey="revenue" fill="url(#revenueGradient)" stroke="#10b981" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expense" fill="url(#expenseGradient)" stroke="#ef4444" strokeWidth={2} name="Expense" />
                <Line type="monotone" dataKey="profit" stroke="#422462" strokeWidth={3} dot={{ fill: "#422462", r: 4 }} name="Profit/Loss" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-4 text-white font-semibold text-sm">Month</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">Revenue</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">Expense</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">Profit/Loss</th>
                <th className="text-center py-3 px-4 text-white font-semibold text-sm">Status</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">Margin %</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyGrowthData.map((month, idx) => {
                const margin = month.revenue > 0 ? ((month.profit / month.revenue) * 100).toFixed(1) : "0.0";
                const isProfit = month.profit >= 0;
                const hasData = month.revenue > 0 || month.expense > 0;

                return (
                  <tr
                    key={idx}
                    className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                      idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                    } ${!hasData ? "opacity-40" : ""}`}
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-[#200B43]">{month.month}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="text-sm font-bold text-green-600">
                        {hasData ? `$${month.revenue.toLocaleString()}` : "-"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="text-sm font-bold text-red-600">
                        {hasData ? `$${month.expense.toLocaleString()}` : "-"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className={`text-sm font-bold ${isProfit ? "text-[#200B43]" : "text-orange-600"}`}>
                        {hasData ? `$${Math.abs(month.profit).toLocaleString()}` : "-"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasData ? (
                        isProfit ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">
                            <TrendingUp className="h-3 w-3" />
                            Profit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                            <TrendingDown className="h-3 w-3" />
                            Loss
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-[#5A4079]">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className={`text-sm font-semibold ${isProfit ? "text-blue-600" : "text-orange-600"}`}>
                        {hasData ? `${margin}%` : "-"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {hasData && idx > 0 && month.growth !== 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          {month.growth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-sm font-bold ${month.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {month.growth >= 0 ? "+" : ""}
                            {month.growth}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#5A4079]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
