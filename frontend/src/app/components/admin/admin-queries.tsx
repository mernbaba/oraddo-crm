import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import {
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Calendar,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2
} from "lucide-react";
import { contactService, ApiContact } from "../../services/contactService";

interface Query {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "feature-request" | "general";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

function mapContactToQuery(c: ApiContact): Query {
  return {
    id: c.id,
    name: c.Name ?? "Unknown",
    email: c.Email ?? "",
    subject: c.CompanyName ?? c.Message?.substring(0, 60) ?? "No subject",
    message: c.Message ?? "",
    status: (c.status as Query["status"]) ?? "open",
    priority: "medium",
    category: "general",
    createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString() : "—",
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleString() : "—",
    assignedTo: undefined,
  };
}

export function AdminQueries() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await contactService.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setQueries(data.map(mapContactToQuery));
    } catch (err: any) {
      console.error("Failed to fetch queries:", err);
      setError(err?.response?.data?.message ?? "Failed to load queries from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  const stats = [
    { label: "Total Queries", value: queries.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Open", value: queries.filter(q => q.status === "open").length, gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "In Progress", value: queries.filter(q => q.status === "in-progress").length, gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Resolved", value: queries.filter(q => q.status === "resolved").length, gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || query.status === filterStatus;
    const matchesPriority = filterPriority === "all" || query.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return { className: "bg-blue-500 text-white", icon: MessageSquare };
      case "in-progress": return { className: "bg-yellow-500 text-white", icon: Clock };
      case "resolved": return { className: "bg-green-500 text-white", icon: CheckCircle };
      case "closed": return { className: "bg-gray-500 text-white", icon: XCircle };
      default: return { className: "bg-gray-500 text-white", icon: MessageSquare };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-400 text-white";
      case "medium": return "bg-blue-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "urgent": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleStatusChange = async (queryId: number, newStatus: Query["status"]) => {
    try {
      const dbStatus = newStatus === "resolved" ? "Converted" : newStatus === "closed" ? "Dead" : "Processing";
      const res = await contactService.update(queryId, { status: dbStatus as any, updatedAt: new Date().toISOString() });
      setQueries(prev => prev.map(q => q.id === queryId ? mapContactToQuery(res.data) : q));
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to update status.");
    }
  };

  const handleSendResponse = async () => {
    if (!selectedQuery || !responseMessage) return;
    setSaving(true);
    try {
      await contactService.update(selectedQuery.id, {
        status: "Converted" as any,
        adminResponse: responseMessage,
        updatedAt: new Date().toISOString()
      } as any);
      setQueries(prev => prev.map(q =>
        q.id === selectedQuery.id ? { ...q, status: "resolved" } : q
      ));
      setShowQueryModal(false);
      setResponseMessage("");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to send response.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (queryId: number) => {
    if (!confirm("Are you sure you want to delete this query?")) return;
    try {
      await contactService.delete(queryId);
      setQueries(prev => prev.filter(q => q.id !== queryId));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to delete query.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-[#937CB4]" /> : stat.value}
              </h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-100 text-red-700" onClick={fetchQueries}>
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* Filter Bar */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]">
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <Button variant="outline" className="border-[#937CB4]/30 hover:bg-[#F0E9FF] hover:text-[#200B43] text-[#5A4079]" onClick={fetchQueries}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#937CB4] mx-auto mb-3" />
            <p className="text-[#5A4079] text-sm">Loading queries from server...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQueries.map((query) => {
            const statusBadge = getStatusBadge(query.status);
            const StatusIcon = statusBadge.icon;
            return (
              <Card key={query.id} className="gradient-card gradient-card-hover border-[#937CB4]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getPriorityBadge(query.priority)}>{query.priority.toUpperCase()}</Badge>
                        <Badge className={statusBadge.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {query.status.replace("-", " ")}
                        </Badge>
                        <Badge variant="outline" className="border-[#937CB4]/30 text-[#422462]">{query.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-[#200B43] mb-2">{query.subject}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2 text-[#5A4079]"><User className="h-4 w-4" /><span>{query.name}</span></div>
                        <div className="flex items-center gap-2 text-[#5A4079]"><Mail className="h-4 w-4" /><span>{query.email}</span></div>
                        <div className="flex items-center gap-2 text-[#5A4079]"><Calendar className="h-4 w-4" /><span>{query.createdAt}</span></div>
                      </div>
                      <p className="text-sm text-[#5A4079] line-clamp-2 mb-3">{query.message}</p>
                      {query.assignedTo && (
                        <div className="text-xs text-[#958CA7]">Assigned to: <span className="font-medium">{query.assignedTo}</span></div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                        onClick={() => { setSelectedQuery(query); setResponseMessage(""); setShowQueryModal(true); }}
                      >
                        View & Respond
                      </Button>
                      <select
                        value={query.status}
                        onChange={(e) => handleStatusChange(query.id, e.target.value as Query["status"])}
                        className="px-3 py-1 text-sm rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 hover:bg-red-50"
                        onClick={() => handleDelete(query.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredQueries.length === 0 && !error && (
            <Card className="gradient-card border-[#937CB4]/30">
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-[#937CB4] mx-auto mb-4" />
                <p className="text-[#5A4079]">No queries found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* View & Respond Modal */}
      {showQueryModal && selectedQuery && (
        <Modal isOpen={showQueryModal} onClose={() => setShowQueryModal(false)} title="Query Details" size="lg">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#F0E9FF] border border-[#937CB4]/30">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getPriorityBadge(selectedQuery.priority)}>{selectedQuery.priority.toUpperCase()}</Badge>
                <Badge className={getStatusBadge(selectedQuery.status).className}>{selectedQuery.status.replace("-", " ")}</Badge>
                <Badge variant="outline" className="border-[#937CB4]/30">{selectedQuery.category}</Badge>
              </div>
              <h3 className="font-semibold text-lg text-[#200B43] mb-2">{selectedQuery.subject}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-[#5A4079]">
                <div><strong>From:</strong> {selectedQuery.name}</div>
                <div><strong>Email:</strong> {selectedQuery.email}</div>
                <div><strong>Created:</strong> {selectedQuery.createdAt}</div>
                <div><strong>Updated:</strong> {selectedQuery.updatedAt}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Message</label>
              <div className="p-4 rounded-lg bg-white border border-[#937CB4]/30 text-[#5A4079]">{selectedQuery.message}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Your Response</label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                rows={6}
                placeholder="Type your response here..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowQueryModal(false)}>Close</Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSendResponse}
                disabled={!responseMessage.trim() || saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send Response
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
