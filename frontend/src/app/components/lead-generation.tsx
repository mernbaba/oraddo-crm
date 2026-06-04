import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  UserPlus,
  TrendingUp,
  Building2,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "./ui/modal";
import { leadService } from "../services/leadService";

// The DB has no hot/warm/cold column, so we reuse the model's free-text `level`
// field as the lead stage. These are the values the UI reads/writes.
const STATUS_OPTIONS = ["hot", "warm", "cold"];

const statusColors: Record<string, string> = {
  hot: "bg-red-100 text-red-800 border-red-300",
  warm: "bg-yellow-100 text-yellow-800 border-yellow-300",
  cold: "bg-blue-100 text-blue-800 border-blue-300",
};

const statusChartColor: Record<string, string> = {
  hot: "#ef4444",
  warm: "#f59e0b",
  cold: "#3b82f6",
};

const EMPTY_FORM = {
  company_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  company_website: "",
  industry: "",
  City: "",
  no_ofEmployees: "",
  revenue: "",
  level: "warm",
  Comments: "",
};

type FormState = typeof EMPTY_FORM;

// Map a raw LeadCreation row into the shape the UI renders.
const normalizeLead = (row: any) => {
  const contact = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return {
    id: row.id,
    company: row.company_name || contact || row.createdBy || "Unnamed Lead",
    contact: contact || row.createdBy || "—",
    email: row.email || "",
    phone: row.phone_number || row.contact_number || "",
    industry: row.industry || "",
    location: row.City || row.location || row.state || row.country || "",
    website: row.company_website || "",
    employees: row.no_ofEmployees || row.employee_count || "",
    value: row.revenue || "",
    status: String(row.level || "").toLowerCase(),
    lastContact: row.updatedAt || row.createdAt || "",
    raw: row,
  };
};

type UILead = ReturnType<typeof normalizeLead>;

const formatDate = (v: string): string => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const formatValue = (v: string): string => {
  if (!v) return "—";
  const raw = String(v).trim();
  // If it's a plain/grouped number (optionally with a currency symbol), pretty-print it.
  if (/^[₹$\s]*[\d,]+(\.\d+)?$/.test(raw)) {
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (!isNaN(n) && n > 0) return `₹${n.toLocaleString("en-IN")}`;
  }
  return raw;
};

export function LeadGeneration() {
  const [leads, setLeads] = useState<UILead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id?: number; fullName?: string }>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<UILead | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // Read org + user from the session (populated at login).
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setIsLoading(false);
      setError("You are not logged in.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setCurrentUser({ id: parsed?.id, fullName: parsed?.fullName || parsed?.emp_name });
      const oid = parsed?.organizationId ?? parsed?.organizationID;
      if (oid !== undefined && oid !== null && oid !== "") {
        setOrgId(Number(oid));
      } else {
        setIsLoading(false);
        setError("No organization is linked to your account.");
      }
    } catch (e) {
      console.error("Failed to parse userData", e);
      setIsLoading(false);
      setError("Could not read your session.");
    }
  }, []);

  useEffect(() => {
    if (orgId !== null) fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const fetchLeads = async () => {
    if (orgId === null) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await leadService.getLeadsByOrg(orgId, { page: 0, limit: 1000 });
      const body = res?.data;
      const rows: any[] = body?.data ?? (Array.isArray(body) ? body : []);
      setLeads(rows.map(normalizeLead));
      setTotalCount(body?.totalRows ?? rows.length);
    } catch (e: any) {
      console.error("Failed to load leads", e);
      setError(e?.response?.data?.error || "Could not load leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const industries = useMemo(
    () => Array.from(new Set(leads.map((l) => l.industry).filter(Boolean))).sort(),
    [leads]
  );

  const filteredLeads = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return leads.filter((lead) => {
      const textMatch =
        !q ||
        [lead.company, lead.contact, lead.email, lead.industry].some((v) =>
          (v || "").toLowerCase().includes(q)
        );
      const statusMatch = filterStatus === "all" || lead.status === filterStatus;
      const industryMatch = filterIndustry === "all" || lead.industry === filterIndustry;
      return textMatch && statusMatch && industryMatch;
    });
  }, [leads, searchTerm, filterStatus, filterIndustry]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { hot: 0, warm: 0, cold: 0 };
    leads.forEach((l) => {
      if (counts[l.status] !== undefined) counts[l.status] += 1;
    });
    return counts;
  }, [leads]);

  // Industry breakdown (replaces the old hardcoded "Lead Sources" data).
  const industryChartData = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const key = l.industry || "Unspecified";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map, ([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [leads]);

  const statusChartData = useMemo(
    () =>
      STATUS_OPTIONS.map((s) => ({
        name: s,
        value: statusCounts[s] || 0,
        color: statusChartColor[s],
      })).filter((d) => d.value > 0),
    [statusCounts]
  );

  // Leads created per month (replaces the old hardcoded trend data).
  const trendData = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const d = new Date(l.raw?.createdAt || l.lastContact);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map, ([month, generated]) => ({ month, generated })).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [leads]);

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildPayload = () => ({
    company_name: form.company_name,
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    phone_number: form.phone_number,
    company_website: form.company_website,
    industry: form.industry,
    City: form.City,
    no_ofEmployees: form.no_ofEmployees,
    revenue: form.revenue,
    level: form.level,
    Comments: form.Comments,
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowCreateModal(true);
  };

  const openView = (lead: UILead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const openEdit = (lead: UILead) => {
    const r: any = lead.raw || {};
    setForm({
      company_name: r.company_name || "",
      first_name: r.first_name || "",
      last_name: r.last_name || "",
      email: r.email || "",
      phone_number: r.phone_number || r.contact_number || "",
      company_website: r.company_website || "",
      industry: r.industry || "",
      City: r.City || r.location || "",
      no_ofEmployees: r.no_ofEmployees || r.employee_count || "",
      revenue: r.revenue || "",
      level: String(r.level || "warm").toLowerCase(),
      Comments: r.Comments || "",
    });
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    if (!form.company_name && !form.first_name && !form.email) {
      alert("Please enter at least a company name, contact name, or email.");
      return;
    }
    setIsSaving(true);
    try {
      await leadService.createLead({
        ...buildPayload(),
        organizationID: orgId ?? undefined,
        createdBy: currentUser.fullName || "",
      });
      setShowCreateModal(false);
      setForm(EMPTY_FORM);
      await fetchLeads();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not create the lead.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    setIsSaving(true);
    try {
      await leadService.updateLead(selectedLead.id, buildPayload());
      setShowEditModal(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not update the lead.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (lead: UILead) => {
    if (!window.confirm(`Delete lead "${lead.company}"? This cannot be undone.`)) return;
    try {
      await leadService.deleteLead(lead.id);
      await fetchLeads();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not delete the lead.");
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]";
  const labelCls = "block text-sm font-medium text-[#200B43] mb-2";

  const renderFormFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Company Name</label>
          <input
            type="text"
            className={inputCls}
            value={form.company_name}
            onChange={(e) => setField("company_name", e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className={labelCls}>Industry</label>
          <input
            type="text"
            className={inputCls}
            value={form.industry}
            onChange={(e) => setField("industry", e.target.value)}
            placeholder="e.g. Software, Retail"
          />
        </div>
        <div>
          <label className={labelCls}>First Name</label>
          <input
            type="text"
            className={inputCls}
            value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            placeholder="Contact first name"
          />
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input
            type="text"
            className={inputCls}
            value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            placeholder="Contact last name"
          />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input
            type="tel"
            className={inputCls}
            value={form.phone_number}
            onChange={(e) => setField("phone_number", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className={labelCls}>Website</label>
          <input
            type="text"
            className={inputCls}
            value={form.company_website}
            onChange={(e) => setField("company_website", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            type="text"
            className={inputCls}
            value={form.City}
            onChange={(e) => setField("City", e.target.value)}
            placeholder="City / region"
          />
        </div>
        <div>
          <label className={labelCls}>No. of Employees</label>
          <input
            type="text"
            className={inputCls}
            value={form.no_ofEmployees}
            onChange={(e) => setField("no_ofEmployees", e.target.value)}
            placeholder="e.g. 50-100"
          />
        </div>
        <div>
          <label className={labelCls}>Estimated Value</label>
          <input
            type="text"
            className={inputCls}
            value={form.revenue}
            onChange={(e) => setField("revenue", e.target.value)}
            placeholder="e.g. 125000"
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            className={inputCls}
            value={form.level}
            onChange={(e) => setField("level", e.target.value)}
          >
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          rows={3}
          className={inputCls}
          value={form.Comments}
          onChange={(e) => setField("Comments", e.target.value)}
          placeholder="Add any additional notes..."
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Generation</h2>
          <p className="text-muted-foreground">
            Capture, qualify, and nurture leads through the sales funnel
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">In your organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.hot}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warm Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.warm}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{industries.length}</div>
            <p className="text-xs text-muted-foreground">Distinct sectors</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Active Leads</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-muted-foreground mr-2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Statuses</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-muted-foreground mr-2" />
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading leads…
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-10 text-center space-y-3">
                <p className="text-red-600">{error}</p>
                <Button variant="outline" onClick={fetchLeads}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <p className="text-muted-foreground">
                  {leads.length === 0
                    ? "No leads yet. Add your first lead to get started."
                    : "No leads match your filters."}
                </p>
                {leads.length === 0 && (
                  <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle>{lead.company}</CardTitle>
                          <CardDescription>{lead.contact}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold">{formatValue(lead.value)}</div>
                      {lead.status && statusColors[lead.status] && (
                        <Badge variant="outline" className={statusColors[lead.status]}>
                          {lead.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium truncate">{lead.email || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium truncate">{lead.phone || "—"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Industry</p>
                        <p className="text-sm font-medium">{lead.industry || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">{formatDate(lead.lastContact)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {lead.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {lead.location}
                          </span>
                        )}
                        {lead.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {lead.website}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openView(lead)}>
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEdit(lead)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(lead)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leads by Industry</CardTitle>
                <CardDescription>Top sectors among your leads</CardDescription>
              </CardHeader>
              <CardContent>
                {industryChartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={industryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#5A4079" name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Leads by stage</CardDescription>
              </CardHeader>
              <CardContent>
                {statusChartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {industryChartData.map((source, index) => {
              const share = leads.length ? Math.round((source.count / leads.length) * 100) : 0;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{source.source}</CardTitle>
                      <Badge variant={share > 30 ? "default" : share > 15 ? "secondary" : "outline"}>
                        {share}% of leads
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Leads</p>
                        <p className="text-2xl font-bold">{source.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Share</p>
                        <p className="text-2xl font-bold">{share}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leads Created Over Time</CardTitle>
              <CardDescription>New leads added per month</CardDescription>
            </CardHeader>
            <CardContent>
              {trendData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">
                  Not enough data to chart yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="generated"
                      stroke="#422462"
                      strokeWidth={2}
                      name="Leads Created"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
        size="lg"
      >
        <div className="space-y-4">
          {renderFormFields()}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-[#422462] to-[#5A4079]"
              onClick={handleCreate}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Create Lead"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit */}
      {selectedLead && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Lead"
          size="lg"
        >
          <div className="space-y-4">
            {renderFormFields()}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-[#422462] to-[#5A4079]"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View */}
      {selectedLead && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Lead Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#937CB4]/20">
              <div className="flex items-center gap-3">
                <Building2 className="h-10 w-10 text-[#422462]" />
                <div>
                  <h3 className="text-2xl font-bold text-[#200B43]">{selectedLead.company}</h3>
                  <p className="text-[#5A4079]">{selectedLead.contact}</p>
                </div>
              </div>
              {selectedLead.status && statusColors[selectedLead.status] && (
                <Badge className={statusColors[selectedLead.status]}>
                  {selectedLead.status.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Email</label>
                  <p className="text-[#200B43] font-medium break-all">{selectedLead.email || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Phone</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.phone || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Industry</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.industry || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Website</label>
                  <p className="text-[#200B43] font-medium break-all">{selectedLead.website || "—"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Estimated Value</label>
                  <p className="text-2xl font-bold text-[#200B43]">{formatValue(selectedLead.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Location</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.location || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Employees</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.employees || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Last Updated</label>
                  <p className="text-[#200B43] font-medium">{formatDate(selectedLead.lastContact)}</p>
                </div>
              </div>
            </div>

            {selectedLead.raw?.Comments && (
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Notes</label>
                <p className="text-[#200B43]">{selectedLead.raw.Comments}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079]"
                onClick={() => {
                  setShowViewModal(false);
                  openEdit(selectedLead);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Lead
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
