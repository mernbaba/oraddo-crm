import { useState, useEffect, useMemo } from "react";
import {
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  Download,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { performanceService, PerformanceRecord } from "../services/performanceService";

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The five rating fields stored on a team_perfomance row. Labels match the
// employee portal's "My Performance Metrics" page (hr-all-remaining.tsx).
const METRIC_DEFS = [
  { key: "work_perfomance", label: "Work Performance", icon: Target },
  { key: "availability", label: "Availability", icon: Clock },
  { key: "behaviour", label: "Behaviour", icon: Users },
  { key: "team_performance1", label: "Team Performance I", icon: TrendingUp },
  { key: "team_performance2", label: "Team Performance II", icon: Award },
] as const;

type MetricKey = (typeof METRIC_DEFS)[number]["key"];

// Rating fields may hold a numeric score ("85") or a text label; parse defensively.
const parseScore = (v?: string): number | null => {
  if (v == null || v === "") return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : Math.max(0, Math.min(100, n));
};

const computeOverall = (rec: PerformanceRecord): number | null => {
  const scores = METRIC_DEFS.map((d) => parseScore(rec[d.key] as string | undefined)).filter(
    (s): s is number => s != null
  );
  return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

interface PerfRow {
  id: number; // team_perfomance row id
  empId: number; // Emp_onboarding id
  employeeCode: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  month: string;
  scores: Record<MetricKey, number | null>;
  raws: Record<MetricKey, string>;
  overall: number | null;
  trend: "up" | "down" | null;
  comments: string;
}

interface MonthOption {
  label: string;
  year: number;
  month: string; // short name, e.g. "Feb" — the format the backend filter expects
}

export function HRTeamPerformanceManagement() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [rows, setRows] = useState<PerfRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPerformance, setFilterPerformance] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PerfRow | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "overall" | MetricKey>("overall");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Last 12 months, newest first; reviews are monthly so this covers a year back.
  const monthOptions = useMemo<MonthOption[]>(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        label: d.toLocaleString("default", { month: "long", year: "numeric" }),
        year: d.getFullYear(),
        month: SHORT_MONTHS[d.getMonth()],
      };
    });
  }, []);
  const [selectedMonth, setSelectedMonth] = useState(() => monthOptions[0].label);

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setError("No organization is linked to your account. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const u = JSON.parse(raw);
      const org = u?.organizationId != null ? Number(u.organizationId) : null;
      setOrgId(org);
      if (org == null) {
        setError("No organization is linked to your account. Please log in again.");
        setLoading(false);
      }
    } catch {
      setError("Could not read your session. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orgId == null) return;
    const opt = monthOptions.find((m) => m.label === selectedMonth);
    if (opt) loadPerformances(orgId, opt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, selectedMonth]);

  // Rows come back as team_perfomance records with the employee nested under
  // `teamPerformance` (Emp_onboarding). Department/position on the row itself
  // are a snapshot taken when the review was created; prefer them.
  const mapRow = (rec: PerformanceRecord, prevOverall: Map<number, number>): PerfRow => {
    const emp: any = rec.teamPerformance || {};
    const empId = Number(rec.empOnboardingId ?? emp.id ?? 0);
    const name = emp.emp_name || `Employee #${empId}`;
    const scores = {} as Record<MetricKey, number | null>;
    const raws = {} as Record<MetricKey, string>;
    METRIC_DEFS.forEach((d) => {
      raws[d.key] = (rec[d.key] as string) || "";
      scores[d.key] = parseScore(rec[d.key] as string | undefined);
    });
    const overall = computeOverall(rec);
    const prev = prevOverall.get(empId);
    return {
      id: Number(rec.id),
      empId,
      employeeCode: `EMP-${String(empId).padStart(3, "0")}`,
      name,
      position: rec.position || emp.position || "—",
      department: rec.department || emp.department || "—",
      avatar: initialsOf(name),
      month: rec.date
        ? new Date(rec.date).toLocaleString("default", { month: "long", year: "numeric" })
        : selectedMonth,
      scores,
      raws,
      overall,
      trend: overall != null && prev != null ? (overall >= prev ? "up" : "down") : null,
      comments: rec.comments || "",
    };
  };

  const loadPerformances = async (org: number, opt: MonthOption) => {
    setLoading(true);
    setError(null);
    try {
      // Also fetch the previous month so the trend arrow compares real data;
      // if that request fails the page still renders, just without trends.
      const prevDate = new Date(opt.year, SHORT_MONTHS.indexOf(opt.month) - 1, 1);
      const [curRes, prevRes] = await Promise.all([
        performanceService.getByOrganization(org, { year: opt.year, month: opt.month }),
        performanceService
          .getByOrganization(org, {
            year: prevDate.getFullYear(),
            month: SHORT_MONTHS[prevDate.getMonth()],
          })
          .catch(() => null),
      ]);
      const current = curRes.data?.performances ?? [];
      const previous = prevRes?.data?.performances ?? [];
      const prevOverall = new Map<number, number>();
      previous.forEach((p) => {
        const o = computeOverall(p);
        const empId = Number(p.empOnboardingId ?? (p.teamPerformance as any)?.id);
        if (!isNaN(empId) && o != null) prevOverall.set(empId, o);
      });
      setRows(current.map((p) => mapRow(p, prevOverall)));
    } catch (e) {
      console.error("Failed to load team performance", e);
      setError("Failed to load team performance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(
    () => Array.from(new Set(rows.map((r) => r.department).filter((d) => d && d !== "—"))).sort(),
    [rows]
  );

  const filteredEmployees = rows
    .filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q);

      const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;

      const score = emp.overall;
      const matchesPerformance =
        filterPerformance === "all" ||
        (score != null &&
          ((filterPerformance === "excellent" && score >= 90) ||
            (filterPerformance === "good" && score >= 75 && score < 90) ||
            (filterPerformance === "average" && score >= 60 && score < 75) ||
            (filterPerformance === "needs-improvement" && score < 60)));

      return matchesSearch && matchesDepartment && matchesPerformance;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      const aValue = (sortBy === "overall" ? a.overall : a.scores[sortBy]) ?? -1;
      const bValue = (sortBy === "overall" ? b.overall : b.scores[sortBy]) ?? -1;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const scored = rows.filter((r) => r.overall != null);
  const availabilityScores = rows
    .map((r) => r.scores.availability)
    .filter((s): s is number => s != null);
  const stats = {
    totalEmployees: rows.length,
    avgScore: scored.length
      ? Math.round(scored.reduce((sum, r) => sum + (r.overall as number), 0) / scored.length)
      : 0,
    excellentPerformers: scored.filter((r) => (r.overall as number) >= 90).length,
    needsImprovement: scored.filter((r) => (r.overall as number) < 75).length,
    avgAvailability: availabilityScores.length
      ? Math.round(availabilityScores.reduce((a, b) => a + b, 0) / availabilityScores.length)
      : 0,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  // Show the parsed score when numeric, otherwise the stored label ("Good" etc).
  const cellValue = (row: PerfRow, key: MetricKey) => {
    if (row.scores[key] != null) return String(row.scores[key]);
    return row.raws[key] || "—";
  };

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Position",
      "Department",
      "Month",
      "Overall Score",
      ...METRIC_DEFS.map((d) => d.label),
      "Comments",
    ];
    const rowsCsv = filteredEmployees.map((emp) => [
      emp.employeeCode,
      emp.name,
      emp.position,
      emp.department,
      emp.month,
      emp.overall ?? "",
      ...METRIC_DEFS.map((d) => emp.raws[d.key]),
      emp.comments,
    ]);

    const csvContent = [headers, ...rowsCsv]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `team-performance-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortIndicator = (column: typeof sortBy) =>
    sortBy === column &&
    (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />);

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
              Team Performance Management
            </h2>
            <p className="text-[#5A4079] text-sm">
              Monthly performance analysis for all employees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => (
                <SelectItem key={m.label} value={m.label}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={filteredEmployees.length === 0}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
          {orgId != null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const opt = monthOptions.find((m) => m.label === selectedMonth);
                if (opt) loadPerformances(orgId, opt);
              }}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/40 p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5A4079] font-medium">Reviewed Employees</p>
              <p className="text-2xl font-bold text-[#200B43] mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Average Score</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.avgScore}/100</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Excellent</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.excellentPerformers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">Needs Support</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{stats.needsImprovement}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Avg Availability</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.avgAvailability}%</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]/50" />
          <Input
            placeholder="Search by name, ID, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPerformance} onValueChange={setFilterPerformance}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-48">
            <SelectValue placeholder="Filter by performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Performance</SelectItem>
            <SelectItem value="excellent">Excellent (90+)</SelectItem>
            <SelectItem value="good">Good (75-89)</SelectItem>
            <SelectItem value="average">Average (60-74)</SelectItem>
            <SelectItem value="needs-improvement">Needs Improvement (&lt;60)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <table className="w-full table-fixed">
            <thead className="bg-gradient-to-r from-[#200B43] to-[#422462]">
              <tr>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[16%]">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Employee
                    {sortIndicator("name")}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[11%]">
                  <span className="text-xs">Department</span>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[9%]">
                  <button
                    onClick={() => handleSort("overall")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Overall
                    {sortIndicator("overall")}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[11%]">
                  <button
                    onClick={() => handleSort("work_perfomance")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Work Perf.
                    {sortIndicator("work_perfomance")}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[11%]">
                  <button
                    onClick={() => handleSort("availability")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Availability
                    {sortIndicator("availability")}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <button
                    onClick={() => handleSort("behaviour")}
                    className="flex items-center gap-1 hover:text-[#F0E9FF] transition-colors text-xs"
                  >
                    Behaviour
                    {sortIndicator("behaviour")}
                  </button>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <span className="text-xs">Team Perf. I</span>
                </th>
                <th className="text-left py-3 px-3 text-white font-semibold align-middle w-[10%]">
                  <span className="text-xs">Team Perf. II</span>
                </th>
                <th className="text-center py-3 px-3 text-white font-semibold align-middle w-[12%]">
                  <span className="text-xs">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#422462] mx-auto" />
                    <p className="text-xs text-[#5A4079] mt-2">Loading team performance...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <BarChart3 className="h-8 w-8 text-[#937CB4]/50 mx-auto" />
                    <p className="text-sm text-[#5A4079] mt-2">
                      {rows.length === 0
                        ? `No performance reviews recorded for ${selectedMonth}.`
                        : "No employees match the current filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee, idx) => (
                  <tr
                    key={employee.id}
                    className={`border-b border-[#937CB4]/10 hover:bg-gradient-to-r hover:from-[#F0E9FF]/40 hover:to-transparent transition-all ${
                      idx % 2 === 0 ? "bg-white/40" : "bg-[#F0E9FF]/10"
                    }`}
                  >
                    <td className="py-2.5 px-3 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                          {employee.avatar}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <p className="font-semibold text-[#200B43] text-xs whitespace-nowrap truncate">
                            {employee.name}
                          </p>
                          <p className="text-[10px] text-[#5A4079] whitespace-nowrap">
                            {employee.employeeCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <p className="text-xs text-[#200B43] truncate">{employee.department}</p>
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold ${
                            employee.overall != null ? getScoreColor(employee.overall) : "text-[#5A4079]"
                          }`}
                        >
                          {employee.overall ?? "—"}
                        </span>
                        {employee.trend === "up" && (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        )}
                        {employee.trend === "down" && (
                          <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                        )}
                      </div>
                    </td>
                    {METRIC_DEFS.map((d) => (
                      <td key={d.key} className="py-2.5 px-3 align-middle">
                        <span className="text-xs font-semibold text-[#200B43] truncate block">
                          {cellValue(employee, d.key)}
                        </span>
                      </td>
                    ))}
                    <td className="py-2.5 px-3 align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDetailsModal(true);
                          }}
                          className="text-[#422462] hover:bg-[#F0E9FF] h-7 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployee && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEmployee(null);
          }}
          title="Employee Performance Details"
          size="xl"
        >
          <div className="space-y-6">

            <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-xl">
                {selectedEmployee.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#200B43] to-[#422462] bg-clip-text text-transparent">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-[#5A4079]">
                  {selectedEmployee.employeeCode} • {selectedEmployee.position}
                </p>
                <p className="text-xs text-[#5A4079] mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {selectedEmployee.department} • {selectedEmployee.month}
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${
                    selectedEmployee.overall != null
                      ? getScoreColor(selectedEmployee.overall)
                      : "text-[#5A4079]"
                  }`}
                >
                  {selectedEmployee.overall ?? "—"}
                  {selectedEmployee.overall != null && <span className="text-2xl">/100</span>}
                </div>
                {selectedEmployee.overall != null && (
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBgColor(
                      selectedEmployee.overall
                    )}`}
                  >
                    {getPerformanceLabel(selectedEmployee.overall)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {METRIC_DEFS.map((def) => {
                const Icon = def.icon;
                const score = selectedEmployee.scores[def.key];
                return (
                  <div
                    key={def.key}
                    className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-[#422462]" />
                      <h4 className="font-bold text-[#200B43]">{def.label}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${
                          score != null ? getScoreColor(score) : "text-[#200B43]"
                        }`}
                      >
                        {cellValue(selectedEmployee, def.key)}
                      </span>
                      {score != null && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getScoreBgColor(score)}`}
                        >
                          {getPerformanceLabel(score)}
                        </span>
                      )}
                    </div>
                    {score != null && (
                      <div className="mt-3 h-2 rounded-full bg-[#F0E9FF] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#937CB4] to-[#422462]"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-5 w-5 text-[#422462]" />
                  <h4 className="font-bold text-[#200B43]">Reviewer Comments</h4>
                </div>
                <p className="text-sm text-[#5A4079] whitespace-pre-wrap">
                  {selectedEmployee.comments || "No comments recorded for this review."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedEmployee(null);
                }}
                className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
