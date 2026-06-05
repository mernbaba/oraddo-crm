import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DollarSign, Clock, CheckCircle2, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { expenseService } from "../services/expenseService";

type ExpenseStatus = "Pending" | "Approved" | "Declined";

interface DisplayExpense {
  id: number;
  employee: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
}

const normalizeStatus = (s?: string): ExpenseStatus =>
  s === "Approved" || s === "Declined" ? s : "Pending";

const mapExpense = (e: any): DisplayExpense => ({
  id: e.id,
  employee: e.employee?.emp_name || "Unknown",
  // The model has no dedicated category column, so the short expense title
  // doubles as the category dimension for the breakdown chart.
  category: e.expenseTitle || "Uncategorized",
  description: e.notes || "",
  amount: Number(e.amount) || 0,
  date: e.date || e.createdAt || "",
  status: normalizeStatus(e.status),
});

export function HRExpenses() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<DisplayExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
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
    loadExpenses(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const loadExpenses = async (organizationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await expenseService.getByOrg(organizationId, { page: 0, pageSize: 1000 });
      const rows = res.data?.employeeExpenses ?? res.data ?? [];
      setExpenses((Array.isArray(rows) ? rows : []).map(mapExpense));
    } catch (e) {
      console.error("Failed to load expenses", e);
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: number, status: ExpenseStatus) => {
    const previous = expenses;
    setUpdatingId(id);
    // Optimistic update; revert on failure.
    setExpenses((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await expenseService.update(id, { status });
    } catch (e) {
      console.error("Failed to update expense status", e);
      setExpenses(previous);
      alert("Failed to update the claim. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Derived stats / chart data ───────────────────────────────────────────
  const now = new Date();
  const isThisMonth = (d: string) => {
    const x = new Date(d);
    return !isNaN(x.getTime()) && x.getMonth() === now.getMonth() && x.getFullYear() === now.getFullYear();
  };
  const monthTotal = expenses.filter((e) => isThisMonth(e.date)).reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter((e) => e.status === "Pending");
  const approved = expenses.filter((e) => e.status === "Approved");
  const pendingTotal = pending.reduce((s, e) => s + e.amount, 0);
  const approvedTotal = approved.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = new Map<string, number>();
  expenses.forEach((e) =>
    categoryTotals.set(e.category, (categoryTotals.get(e.category) || 0) + e.amount)
  );
  const expensesByCategory = Array.from(categoryTotals, ([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const recentExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const statusBadge = (status: ExpenseStatus) => {
    if (status === "Approved")
      return <Badge className="bg-gradient-to-r from-[#422462] to-[#5A4079] mt-1">Approved</Badge>;
    if (status === "Declined")
      return <Badge className="bg-red-100 text-red-700 border border-red-300 mt-1">Declined</Badge>;
    return <Badge variant="secondary" className="mt-1">Pending</Badge>;
  };

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
              onClick={() => loadExpenses(orgId)}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-[#937CB4]/30 bg-white/80 px-4 py-3 text-sm text-[#5A4079]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading expenses…</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Expenses</CardTitle>
            <DollarSign className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹{monthTotal.toLocaleString()}</div>
            <p className="text-xs text-[#422462]">This month</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹{pendingTotal.toLocaleString()}</div>
            <p className="text-xs text-[#422462]">{pending.length} requests</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Approved</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">₹{approvedTotal.toLocaleString()}</div>
            <p className="text-xs text-[#422462]">{approved.length} approved</p>
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
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {recentExpenses.length === 0 && !loading && (
                <p className="text-sm text-[#5A4079] text-center py-8">No expense claims found.</p>
              )}
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-[#200B43]">{expense.employee}</p>
                      <p className="text-sm text-[#5A4079]">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#200B43]">₹{expense.amount.toLocaleString()}</p>
                      {statusBadge(expense.status)}
                    </div>
                  </div>
                  {expense.description && <p className="text-sm text-[#5A4079]">{expense.description}</p>}
                  {expense.date && (
                    <p className="text-xs text-[#5A4079]">{new Date(expense.date).toLocaleDateString()}</p>
                  )}
                  {expense.status === "Pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                        disabled={updatingId === expense.id}
                        onClick={() => handleStatus(expense.id, "Approved")}
                      >
                        {updatingId === expense.id && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#937CB4]/30"
                        disabled={updatingId === expense.id}
                        onClick={() => handleStatus(expense.id, "Declined")}
                      >
                        Reject
                      </Button>
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
            <CardDescription className="text-[#5A4079]">Breakdown by expense title</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#5A4079]">
                No expense data to chart yet.
              </div>
            ) : (
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
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#422462" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
