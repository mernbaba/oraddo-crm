import { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
} from "recharts";

export function FinanceFinancial() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const years = ["2026", "2025", "2024"];

  const financialData: Record<string, any[]> = {
    "2026": [
      { month: "January", revenue: 125000, expense: 78000, profit: 47000 },
      { month: "February", revenue: 148000, expense: 85000, profit: 63000 },
      { month: "March", revenue: 0, expense: 0, profit: 0 },
      { month: "April", revenue: 0, expense: 0, profit: 0 },
      { month: "May", revenue: 0, expense: 0, profit: 0 },
      { month: "June", revenue: 0, expense: 0, profit: 0 },
      { month: "July", revenue: 0, expense: 0, profit: 0 },
      { month: "August", revenue: 0, expense: 0, profit: 0 },
      { month: "September", revenue: 0, expense: 0, profit: 0 },
      { month: "October", revenue: 0, expense: 0, profit: 0 },
      { month: "November", revenue: 0, expense: 0, profit: 0 },
      { month: "December", revenue: 0, expense: 0, profit: 0 },
    ],
    "2025": [
      { month: "January", revenue: 95000, expense: 68000, profit: 27000 },
      { month: "February", revenue: 102000, expense: 72000, profit: 30000 },
      { month: "March", revenue: 110000, expense: 75000, profit: 35000 },
      { month: "April", revenue: 118000, expense: 79000, profit: 39000 },
      { month: "May", revenue: 125000, expense: 82000, profit: 43000 },
      { month: "June", revenue: 132000, expense: 85000, profit: 47000 },
      { month: "July", revenue: 128000, expense: 88000, profit: 40000 },
      { month: "August", revenue: 135000, expense: 90000, profit: 45000 },
      { month: "September", revenue: 142000, expense: 92000, profit: 50000 },
      { month: "October", revenue: 150000, expense: 95000, profit: 55000 },
      { month: "November", revenue: 145000, expense: 93000, profit: 52000 },
      { month: "December", revenue: 158000, expense: 98000, profit: 60000 },
    ],
    "2024": [
      { month: "January", revenue: 85000, expense: 62000, profit: 23000 },
      { month: "February", revenue: 88000, expense: 65000, profit: 23000 },
      { month: "March", revenue: 92000, expense: 67000, profit: 25000 },
      { month: "April", revenue: 95000, expense: 68000, profit: 27000 },
      { month: "May", revenue: 98000, expense: 70000, profit: 28000 },
      { month: "June", revenue: 105000, expense: 72000, profit: 33000 },
      { month: "July", revenue: 102000, expense: 74000, profit: 28000 },
      { month: "August", revenue: 108000, expense: 75000, profit: 33000 },
      { month: "September", revenue: 112000, expense: 77000, profit: 35000 },
      { month: "October", revenue: 115000, expense: 78000, profit: 37000 },
      { month: "November", revenue: 110000, expense: 76000, profit: 34000 },
      { month: "December", revenue: 120000, expense: 80000, profit: 40000 },
    ],
  };

  const currentYearData = financialData[selectedYear];

  const yearlyRevenue = currentYearData.reduce((sum, m) => sum + m.revenue, 0);
  const yearlyExpense = currentYearData.reduce((sum, m) => sum + m.expense, 0);
  const yearlyProfit = yearlyRevenue - yearlyExpense;
  const profitMargin = yearlyRevenue > 0 ? ((yearlyProfit / yearlyRevenue) * 100).toFixed(1) : "0.0";

  const previousYear = (parseInt(selectedYear) - 1).toString();
  const previousYearData = financialData[previousYear];
  let yearOverYearGrowth = 0;
  if (previousYearData) {
    const prevYearProfit = previousYearData.reduce((sum, m) => sum + m.profit, 0);
    if (prevYearProfit > 0) {
      yearOverYearGrowth = ((yearlyProfit - prevYearProfit) / prevYearProfit) * 100;
    }
  }

  const monthlyGrowthData = currentYearData.map((month, index) => {
    if (index === 0 || month.profit === 0) {
      return { ...month, growth: 0 };
    }
    const prevMonth = currentYearData[index - 1];
    if (prevMonth.profit === 0) {
      return { ...month, growth: 0 };
    }
    const growth = ((month.profit - prevMonth.profit) / prevMonth.profit) * 100;
    return { ...month, growth: parseFloat(growth.toFixed(1)) };
  });

  const monthsWithData = currentYearData.filter((m) => m.revenue > 0 || m.expense > 0);
  const profitableMonths = monthsWithData.filter((m) => m.profit > 0).length;
  const lossMonths = monthsWithData.filter((m) => m.profit < 0).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-[#937CB4]/30 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-bold text-[#200B43] mb-2">{data.month}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#5A4079]">Revenue:</span>
              <span className="text-xs font-bold text-green-600">
                ${data.revenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#5A4079]">Expense:</span>
              <span className="text-xs font-bold text-red-600">
                ${data.expense.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#937CB4]/20">
              <span className="text-xs font-medium text-[#422462]">
                {data.profit >= 0 ? "Profit:" : "Loss:"}
              </span>
              <span
                className={`text-xs font-bold ${
                  data.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
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
        <Button className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg">
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

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
        <div className="ml-auto flex items-center gap-2">
          {yearOverYearGrowth !== 0 && previousYearData && (
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

        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-green-600 font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">
                ${yearlyRevenue.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-red-700">
                ${yearlyExpense.toLocaleString()}
              </p>
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
              <p
                className={`text-xs font-medium mb-1 ${
                  yearlyProfit >= 0 ? "text-[#422462]" : "text-orange-600"
                }`}
              >
                Net {yearlyProfit >= 0 ? "Profit" : "Loss"}
              </p>
              <p
                className={`text-2xl font-bold ${
                  yearlyProfit >= 0 ? "text-[#200B43]" : "text-orange-700"
                }`}
              >
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
          <p
            className={`text-xs ${yearlyProfit >= 0 ? "text-[#5A4079]" : "text-orange-600"}`}
          >
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
              <h3 className="text-xl font-bold text-[#200B43]">
                Revenue vs Expense - Monthly Comparison
              </h3>
              <p className="text-sm text-[#5A4079]">
                Track monthly performance throughout {selectedYear}
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-[#937CB4] animate-pulse-glow" />
          </div>
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
              <XAxis
                dataKey="month"
                stroke="#5A4079"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#5A4079" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                fill="url(#revenueGradient)"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expense"
                fill="url(#expenseGradient)"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expense"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#422462"
                strokeWidth={3}
                dot={{ fill: "#422462", r: 4 }}
                name="Profit/Loss"
              />
            </ComposedChart>
          </ResponsiveContainer>
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
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">
                  Profit/Loss
                </th>
                <th className="text-center py-3 px-4 text-white font-semibold text-sm">Status</th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">
                  Margin %
                </th>
                <th className="text-right py-3 px-4 text-white font-semibold text-sm">
                  Growth %
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyGrowthData.map((month, idx) => {
                const margin =
                  month.revenue > 0 ? ((month.profit / month.revenue) * 100).toFixed(1) : "0.0";
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
                      <p
                        className={`text-sm font-bold ${
                          isProfit ? "text-[#200B43]" : "text-orange-600"
                        }`}
                      >
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}