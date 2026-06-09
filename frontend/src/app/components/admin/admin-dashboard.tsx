import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  UserCheck,
  UserX,
  Sparkles,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { orgService } from "../../services/orgService";
import { plansService } from "../../services/plansService";
import { revenueService } from "../../services/revenueService";
import { notificationService } from "../../services/notificationService";
import { contactService } from "../../services/contactService";

const PLAN_COLORS: Record<string, string> = {
  Free: "#937CB4",
  Basic: "#5A4079",
  Pro: "#422462",
  Enterprise: "#200B43",
};

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    mrr: 0,
    newUsersToday: 0,
    openQueries: 0,
  });
  const [planDistribution, setPlanDistribution] = useState<{ name: string; value: number; color: string }[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<{ month: string; revenue: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch everything in parallel
      const [orgsRes, plansRes, revenuesRes, notifRes, queriesRes] = await Promise.allSettled([
        orgService.getAll(),
        plansService.getAll(),
        revenueService.getAll(),
        notificationService.getAll(),
        contactService.getAll(),
      ]);

      // ── Orgs / Users ──────────────────────────────────
      const orgsData = orgsRes.status === "fulfilled" ? orgsRes.value.data : null;
      const orgs: any[] = Array.isArray(orgsData?.Clients) ? orgsData.Clients : [];

      const today = new Date().toISOString().substring(0, 10);
      const newUsersToday = orgs.filter(o => (o.createdAt ?? "").startsWith(today)).length;

      // Plan distribution from org data
      const planCounts: Record<string, number> = {};
      orgs.forEach(o => {
        const plan = o.plan ?? o.planName ?? o.subscriptionPlan ?? "Free";
        planCounts[plan] = (planCounts[plan] ?? 0) + 1;
      });

      // ── Plans ─────────────────────────────────────────
      const plans = plansRes.status === "fulfilled" && Array.isArray(plansRes.value.data)
        ? plansRes.value.data : [];

      // Fall back to plan names from orgs if plans API didn't return useful data
      const planNames = plans.length > 0 ? plans.map(p => p.name) : Object.keys(planCounts);
      const distribution = planNames
        .filter(name => planCounts[name] !== undefined)
        .map(name => ({
          name,
          value: planCounts[name] ?? 0,
          color: PLAN_COLORS[name] ?? "#937CB4",
        }));
      // also include any plan names from orgs not in plans API
      Object.keys(planCounts).forEach(name => {
        if (!distribution.find(d => d.name === name)) {
          distribution.push({ name, value: planCounts[name], color: PLAN_COLORS[name] ?? "#937CB4" });
        }
      });
      setPlanDistribution(distribution);

      const activeSubscriptions = orgs.filter(o => {
        const plan = o.plan ?? o.planName ?? "Free";
        return plan !== "Free" && (o.status ?? "active") === "active";
      }).length;

      // ── Revenue ───────────────────────────────────────
      const revenues = revenuesRes.status === "fulfilled" && Array.isArray(revenuesRes.value.data)
        ? revenuesRes.value.data : [];

      const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount ?? r.totalRevenue ?? 0), 0);
      const currentMonth = new Date().toISOString().substring(0, 7);
      const mrr = revenues
        .filter(r => (r.createdAt ?? r.month ?? "").startsWith(currentMonth))
        .reduce((sum, r) => sum + (r.amount ?? r.totalRevenue ?? 0), 0);

      // Build chart from last 6 revenue records
      const chartData = revenues.slice(-6).map((r, i) => ({
        month: r.month ?? r.createdAt?.substring(0, 7) ?? `M${i + 1}`,
        revenue: r.amount ?? r.totalRevenue ?? 0,
      }));
      setRevenueChartData(chartData);

      // ── Notifications (recent activity) ───────────────
      const notifs = notifRes.status === "fulfilled" && Array.isArray(notifRes.value.data)
        ? notifRes.value.data : [];

      const activity = notifs.slice(0, 6).map((n: any, i: number) => ({
        id: n._id ?? i,
        action: n.message ?? n.title ?? "Platform event",
        user: n.email ?? n.adminId ?? "System",
        time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "—",
        status: n.type === "error" ? "error" : n.type === "warning" ? "warning" : "success",
      }));
      setRecentActivity(activity);

      // ── Queries (open = null/Processing status, not Converted/Dead) ──
      const contacts = queriesRes.status === "fulfilled" && Array.isArray(queriesRes.value.data)
        ? queriesRes.value.data : [];
      const openQueries = contacts.filter(q => q.status !== "Converted" && q.status !== "Dead").length;

      setStats({
        totalUsers: orgs.length,
        totalRevenue,
        activeSubscriptions,
        mrr,
        newUsersToday,
        openQueries,
      });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const metricCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      change: "+live",
      icon: Users,
      gradient: "from-[#937CB4] to-[#5A4079]",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "live",
      icon: DollarSign,
      gradient: "from-[#5A4079] to-[#422462]",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions,
      change: "live",
      icon: CreditCard,
      gradient: "from-[#422462] to-[#200B43]",
    },
    {
      label: "MRR (This Month)",
      value: `$${stats.mrr.toLocaleString()}`,
      change: "live",
      icon: TrendingUp,
      gradient: "from-[#937CB4] via-[#5A4079] to-[#422462]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1 text-sm border border-red-300 px-3 py-1 rounded-lg hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="gradient-card gradient-card-hover border-[#937CB4]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">{card.label}</CardTitle>
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-[#937CB4]" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-[#200B43]">{card.value}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">Live from server</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <Activity className="h-5 w-5" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#937CB4]" />
              </div>
            ) : revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#422462" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#422462" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#5A4079" />
                  <YAxis stroke="#5A4079" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #937CB4', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#422462" fillOpacity={1} fill="url(#revenueGradient)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[#5A4079]">
                <p className="text-sm">No revenue data available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#937CB4]" />
              </div>
            ) : planDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #937CB4', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[#5A4079]">
                <p className="text-sm">No subscription data available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43] flex items-center gap-2">
            <Activity className="h-5 w-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#937CB4]" />
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF] to-white border border-[#937CB4]/20 hover:shadow-md transition-all"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success" ? "bg-green-500" :
                    activity.status === "error" ? "bg-red-500" :
                    activity.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#200B43]">{activity.action}</p>
                    <p className="text-xs text-[#5A4079]">{activity.user}</p>
                    <p className="text-xs text-[#958CA7] mt-1">{activity.time}</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-[#937CB4] opacity-60" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[#5A4079] text-sm">
              No recent activity found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "New Users Today", value: stats.newUsersToday, icon: UserCheck, note: "Live from DB" },
          { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard, note: "Paid plans only" },
          { label: "Open Queries", value: stats.openQueries, icon: UserX, note: "Pending + in-progress" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="gradient-card gradient-card-hover border-[#937CB4]/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#200B43]">{s.label}</CardTitle>
                <Icon className="h-5 w-5 text-[#5A4079]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#937CB4]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-[#200B43]">{s.value}</div>
                    <p className="text-xs text-[#5A4079] mt-1">{s.note}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}