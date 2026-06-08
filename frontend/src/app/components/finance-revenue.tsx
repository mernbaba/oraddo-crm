import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Download,
  ArrowDownRight,
  Target,
  Award,
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Yearly revenue goal used for the "Target Achievement" card.
const REVENUE_TARGET = 1_500_000;

interface MonthRow {
  month: string;
  revenue: number;
  invoices: number;
}

const emptyYear = (): MonthRow[] =>
  MONTHS.map((m) => ({ month: m, revenue: 0, invoices: 0 }));

export function FinanceRevenue() {
  const navigate = useNavigate();

  const [orgId, setOrgId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentYearData, setCurrentYearData] = useState<MonthRow[]>(emptyYear);
  const [prevYearRevenue, setPrevYearRevenue] = useState(0);
  const [hasPrevYear, setHasPrevYear] = useState(false);

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

  // Revenue = Approved invoices (Total) bucketed by month of createdAt. The
  // previous year is fetched too so we can show YoY growth.
  const load = async (org: number, yearNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const [curRes, prevRes] = await Promise.all([
        invoiceService.getByOrgForFinance(org, yearNum),
        invoiceService.getByOrgForFinance(org, yearNum - 1),
      ]);

      const curInvoices = curRes.data?.invoices ?? [];
      const prevInvoices = prevRes.data?.invoices ?? [];

      const revByMonth = new Array(12).fill(0);
      const cntByMonth = new Array(12).fill(0);
      curInvoices.forEach((inv: any) => {
        const d = new Date(inv.createdAt || inv.Date);
        if (isNaN(d.getTime())) return;
        revByMonth[d.getMonth()] += parseFloat(inv.Total) || 0;
        cntByMonth[d.getMonth()] += 1;
      });

      setCurrentYearData(
        MONTHS.map((m, i) => ({ month: m, revenue: revByMonth[i], invoices: cntByMonth[i] }))
      );

      const prevRev = prevInvoices.reduce(
        (s: number, inv: any) => s + (parseFloat(inv.Total) || 0),
        0
      );
      setPrevYearRevenue(prevRev);
      setHasPrevYear(prevInvoices.length > 0);
    } catch (e) {
      console.error("Failed to load revenue data", e);
      setError("Failed to load revenue data. Please try again.");
      setCurrentYearData(emptyYear());
      setPrevYearRevenue(0);
      setHasPrevYear(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived figures ────────────────────────────────────────────────────────
  const yearlyRevenue = currentYearData.reduce((sum, m) => sum + m.revenue, 0);
  const totalInvoices = currentYearData.reduce((sum, m) => sum + m.invoices, 0);
  const monthsWithData = currentYearData.filter((m) => m.revenue > 0);
  const avgMonthlyRevenue = monthsWithData.length > 0 ? yearlyRevenue / monthsWithData.length : 0;
  const peakMonth =
    monthsWithData.length > 0
      ? monthsWithData.reduce((max, m) => (m.revenue > max.revenue ? m : max), monthsWithData[0])
      : null;
  const targetAchievement = yearlyRevenue > 0 ? (yearlyRevenue / REVENUE_TARGET) * 100 : 0;

  const yearOverYearGrowth =
    hasPrevYear && prevYearRevenue > 0
      ? ((yearlyRevenue - prevYearRevenue) / prevYearRevenue) * 100
      : 0;

  const monthlyGrowthData = currentYearData.map((month, index) => {
    if (index === 0 || month.revenue === 0) {
      return { ...month, growth: 0 };
    }
    const prevMonth = currentYearData[index - 1];
    if (prevMonth.revenue === 0) {
      return { ...month, growth: 0 };
    }
    const growth = ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;
    return { ...month, growth: parseFloat(growth.toFixed(1)) };
  });

  // Year dropdown: current year and the previous four.
  const years = useMemo(() => {
    const cy = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(cy - i));
  }, []);

  const handleExportReport = () => {
    const rows = [
      ["Month", "Revenue", "Invoices", "Avg / Invoice", "Growth %"],
      ...monthlyGrowthData.map((m) => [
        m.month,
        m.revenue,
        m.invoices,
        m.invoices > 0 ? Math.round(m.revenue / m.invoices) : 0,
        m.growth,
      ]),
      [],
      [
        `Total ${selectedYear}`,
        yearlyRevenue,
        totalInvoices,
        totalInvoices > 0 ? Math.round(yearlyRevenue / totalInvoices) : 0,
        yearOverYearGrowth.toFixed(1),
      ],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <TrendingUp className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Revenue Management
            </h2>
            <p className="text-[#5A4079] text-sm">
              Monthly revenue tracking and performance analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportReport}
            disabled={yearlyRevenue === 0}
            className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button
            onClick={() => navigate("/app/business-development/invoice")}
            className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43] shadow-lg"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Create Revenue
          </Button>
        </div>
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
              <span
                className={`text-sm font-bold ${
                  yearOverYearGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {yearOverYearGrowth >= 0 ? "+" : ""}
                {yearOverYearGrowth.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-[#5A4079] font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-[#200B43]">
                ${yearlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-[#5A4079]">Yearly {selectedYear}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Avg Monthly</p>
              <p className="text-2xl font-bold text-blue-700">
                ${avgMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-600">{monthsWithData.length} months tracked</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-amber-600 font-medium mb-1">Peak Month</p>
              <p className="text-2xl font-bold text-amber-700">
                ${peakMonth ? peakMonth.revenue.toLocaleString() : "0"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-amber-600">{peakMonth ? peakMonth.month : "-"}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-1">Target Achievement</p>
              <p className="text-2xl font-bold text-emerald-700">
                {targetAchievement.toFixed(1)}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-emerald-600">
            Target: ${REVENUE_TARGET.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 p-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#200B43]">
                Monthly Revenue Growth - {selectedYear}
              </h3>
              <p className="text-sm text-[#5A4079]">
                Track monthly revenue performance throughout the year
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-[#937CB4] animate-pulse-glow" />
          </div>
          {monthsWithData.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center text-[#5A4079]">
              <TrendingUp className="h-12 w-12 text-[#937CB4] mb-3" />
              <p>No revenue recorded for {selectedYear} yet.</p>
              <p className="text-xs mt-1">Approved invoices are counted as revenue.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={currentYearData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#422462" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#422462" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                <XAxis
                  dataKey="month"
                  stroke="#5A4079"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#5A4079" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #937CB4",
                    borderRadius: "8px",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value: any, name: string) => [`$${Number(value).toLocaleString()}`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  stroke="#422462"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#422462"
                  strokeWidth={3}
                  dot={{ fill: "#422462", r: 5 }}
                  name="Revenue Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="p-6 border-b border-[#937CB4]/20">
            <h3 className="text-xl font-bold text-[#200B43]">Monthly Revenue Breakdown - {selectedYear}</h3>
            <p className="text-sm text-[#5A4079] mt-1">Approved invoice revenue by month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
                <tr>
                  <th className="text-left py-3 px-4 text-white font-semibold text-sm">Month</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Total Revenue</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Invoices</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Avg / Invoice</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Growth %</th>
                </tr>
              </thead>
              <tbody>
                {monthlyGrowthData.map((month, idx) => {
                  const hasData = month.revenue > 0;
                  const avgInvoice = month.invoices > 0 ? month.revenue / month.invoices : 0;

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
                        <p className="text-sm font-bold text-[#422462]">
                          {hasData ? `$${month.revenue.toLocaleString()}` : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-blue-700">
                          {hasData ? month.invoices.toLocaleString() : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-purple-700">
                          {hasData
                            ? `$${avgInvoice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            : "-"}
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
                            <span
                              className={`text-sm font-bold ${
                                month.growth >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
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
                <tr className="bg-gradient-to-r from-[#422462]/10 to-[#937CB4]/10 border-t-2 border-[#422462]/30 font-bold">
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-[#200B43]">TOTAL {selectedYear}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-[#200B43]">
                      ${yearlyRevenue.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-blue-700">
                      {totalInvoices.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-purple-700">
                      {totalInvoices > 0
                        ? `$${(yearlyRevenue / totalInvoices).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "-"}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {yearOverYearGrowth !== 0 && hasPrevYear ? (
                      <div className="flex items-center justify-end gap-1">
                        {yearOverYearGrowth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            yearOverYearGrowth >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {yearOverYearGrowth >= 0 ? "+" : ""}
                          {yearOverYearGrowth.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#5A4079]">-</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
