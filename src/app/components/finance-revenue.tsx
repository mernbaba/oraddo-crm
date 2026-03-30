import { DollarSign, TrendingUp, TrendingDown, Calendar, Sparkles, ArrowUpRight, Download, ArrowDownRight, Target, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area } from "recharts";
import { useState } from "react";

export function FinanceRevenue() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const years = ["2026", "2025", "2024"];

  // Revenue data for each year (all 12 months)
  const revenueData: Record<string, any[]> = {
    "2026": [
      { 
        month: "January", 
        revenue: 125000, 
        productSales: 52500, 
        services: 36250, 
        subscriptions: 22500, 
        consulting: 13750 
      },
      { 
        month: "February", 
        revenue: 148000, 
        productSales: 62160, 
        services: 42920, 
        subscriptions: 26640, 
        consulting: 16280 
      },
      { month: "March", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "April", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "May", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "June", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "July", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "August", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "September", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "October", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "November", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
      { month: "December", revenue: 0, productSales: 0, services: 0, subscriptions: 0, consulting: 0 },
    ],
    "2025": [
      { month: "January", revenue: 88000, productSales: 36960, services: 25520, subscriptions: 15840, consulting: 9680 },
      { month: "February", revenue: 92000, productSales: 38640, services: 26680, subscriptions: 16560, consulting: 10120 },
      { month: "March", revenue: 95000, productSales: 39900, services: 27550, subscriptions: 17100, consulting: 10450 },
      { month: "April", revenue: 102000, productSales: 42840, services: 29580, subscriptions: 18360, consulting: 11220 },
      { month: "May", revenue: 98000, productSales: 41160, services: 28420, subscriptions: 17640, consulting: 10780 },
      { month: "June", revenue: 105000, productSales: 44100, services: 30450, subscriptions: 18900, consulting: 11550 },
      { month: "July", revenue: 110000, productSales: 46200, services: 31900, subscriptions: 19800, consulting: 12100 },
      { month: "August", revenue: 115000, productSales: 48300, services: 33350, subscriptions: 20700, consulting: 12650 },
      { month: "September", revenue: 108000, productSales: 45360, services: 31320, subscriptions: 19440, consulting: 11880 },
      { month: "October", revenue: 118000, productSales: 49560, services: 34220, subscriptions: 21240, consulting: 12980 },
      { month: "November", revenue: 122000, productSales: 51240, services: 35380, subscriptions: 21960, consulting: 13420 },
      { month: "December", revenue: 130000, productSales: 54600, services: 37700, subscriptions: 23400, consulting: 14300 },
    ],
    "2024": [
      { month: "January", revenue: 75000, productSales: 31500, services: 21750, subscriptions: 13500, consulting: 8250 },
      { month: "February", revenue: 78000, productSales: 32760, services: 22620, subscriptions: 14040, consulting: 8580 },
      { month: "March", revenue: 82000, productSales: 34440, services: 23780, subscriptions: 14760, consulting: 9020 },
      { month: "April", revenue: 85000, productSales: 35700, services: 24650, subscriptions: 15300, consulting: 9350 },
      { month: "May", revenue: 88000, productSales: 36960, services: 25520, subscriptions: 15840, consulting: 9680 },
      { month: "June", revenue: 92000, productSales: 38640, services: 26680, subscriptions: 16560, consulting: 10120 },
      { month: "July", revenue: 89000, productSales: 37380, services: 25810, subscriptions: 16020, consulting: 9790 },
      { month: "August", revenue: 95000, productSales: 39900, services: 27550, subscriptions: 17100, consulting: 10450 },
      { month: "September", revenue: 98000, productSales: 41160, services: 28420, subscriptions: 17640, consulting: 10780 },
      { month: "October", revenue: 102000, productSales: 42840, services: 29580, subscriptions: 18360, consulting: 11220 },
      { month: "November", revenue: 100000, productSales: 42000, services: 29000, subscriptions: 18000, consulting: 11000 },
      { month: "December", revenue: 108000, productSales: 45360, services: 31320, subscriptions: 19440, consulting: 11880 },
    ],
  };

  const currentYearData = revenueData[selectedYear];

  // Calculate yearly totals and averages
  const yearlyRevenue = currentYearData.reduce((sum, m) => sum + m.revenue, 0);
  const monthsWithData = currentYearData.filter((m) => m.revenue > 0);
  const avgMonthlyRevenue = monthsWithData.length > 0 ? yearlyRevenue / monthsWithData.length : 0;
  const totalProductSales = currentYearData.reduce((sum, m) => sum + m.productSales, 0);
  const totalServices = currentYearData.reduce((sum, m) => sum + m.services, 0);
  const totalSubscriptions = currentYearData.reduce((sum, m) => sum + m.subscriptions, 0);
  const totalConsulting = currentYearData.reduce((sum, m) => sum + m.consulting, 0);

  // Calculate growth from previous year
  const previousYear = (parseInt(selectedYear) - 1).toString();
  const previousYearData = revenueData[previousYear];
  let yearOverYearGrowth = 0;
  if (previousYearData) {
    const prevYearRevenue = previousYearData.reduce((sum, m) => sum + m.revenue, 0);
    if (prevYearRevenue > 0) {
      yearOverYearGrowth = ((yearlyRevenue - prevYearRevenue) / prevYearRevenue) * 100;
    }
  }

  // Calculate monthly growth percentages
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

  // Revenue streams summary
  const revenueStreams = [
    { 
      source: "Product Sales", 
      amount: totalProductSales, 
      percentage: yearlyRevenue > 0 ? (totalProductSales / yearlyRevenue * 100) : 0, 
      color: "#422462" 
    },
    { 
      source: "Services", 
      amount: totalServices, 
      percentage: yearlyRevenue > 0 ? (totalServices / yearlyRevenue * 100) : 0, 
      color: "#5A4079" 
    },
    { 
      source: "Subscriptions", 
      amount: totalSubscriptions, 
      percentage: yearlyRevenue > 0 ? (totalSubscriptions / yearlyRevenue * 100) : 0, 
      color: "#937CB4" 
    },
    { 
      source: "Consulting", 
      amount: totalConsulting, 
      percentage: yearlyRevenue > 0 ? (totalConsulting / yearlyRevenue * 100) : 0, 
      color: "#958CA7" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Button className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462] shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43] shadow-lg">
            <DollarSign className="mr-2 h-4 w-4" />
            Create Revenue
          </Button>
        </div>
      </div>

      {/* Year Selector */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
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

        {/* Average Monthly */}
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

        {/* Peak Month Revenue */}
        <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-amber-600 font-medium mb-1">Peak Month</p>
              <p className="text-2xl font-bold text-amber-700">
                ${Math.max(...monthsWithData.map(m => m.revenue)).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-amber-600">
            {monthsWithData.length > 0 
              ? monthsWithData.reduce((max, m) => m.revenue > max.revenue ? m : max, monthsWithData[0]).month
              : "-"}
          </p>
        </div>

        {/* Revenue Target */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-1">Target Achievement</p>
              <p className="text-2xl font-bold text-emerald-700">
                {yearlyRevenue > 0 ? ((yearlyRevenue / 1500000) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-emerald-600">
            Target: $1,500,000
          </p>
        </div>
      </div>

      {/* Main Revenue Chart - Monthly Growth on Yearly Basis */}
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
                formatter={(value: any, name: string) => {
                  if (name === "revenue") return [`$${value.toLocaleString()}`, "Revenue"];
                  return [value, name];
                }}
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
        </div>
      </div>

      {/* Monthly Revenue Table */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="p-6 border-b border-[#937CB4]/20">
            <h3 className="text-xl font-bold text-[#200B43]">Monthly Revenue Breakdown - {selectedYear}</h3>
            <p className="text-sm text-[#5A4079] mt-1">Detailed monthly revenue by source</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
                <tr>
                  <th className="text-left py-3 px-4 text-white font-semibold text-sm">Month</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Total Revenue</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Product Sales</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Services</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Subscriptions</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Consulting</th>
                  <th className="text-right py-3 px-4 text-white font-semibold text-sm">Growth %</th>
                </tr>
              </thead>
              <tbody>
                {monthlyGrowthData.map((month, idx) => {
                  const hasData = month.revenue > 0;

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
                        <p className="text-sm text-green-700">
                          {hasData ? `$${month.productSales.toLocaleString()}` : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-blue-700">
                          {hasData ? `$${month.services.toLocaleString()}` : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-purple-700">
                          {hasData ? `$${month.subscriptions.toLocaleString()}` : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-orange-700">
                          {hasData ? `$${month.consulting.toLocaleString()}` : "-"}
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
                {/* Yearly Total Row */}
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
                    <p className="text-sm font-bold text-green-700">
                      ${totalProductSales.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-blue-700">
                      ${totalServices.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-purple-700">
                      ${totalSubscriptions.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-bold text-orange-700">
                      ${totalConsulting.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {yearOverYearGrowth !== 0 && previousYearData ? (
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