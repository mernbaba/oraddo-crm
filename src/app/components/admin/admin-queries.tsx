import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Calendar,
  Sparkles,
  Send
} from "lucide-react";

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

export function AdminQueries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const [queries, setQueries] = useState<Query[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      subject: "Unable to access premium features",
      message: "I upgraded to Pro plan yesterday but still can't access the advanced analytics dashboard. Please help!",
      status: "open",
      priority: "high",
      category: "technical",
      createdAt: "2026-02-18 10:30",
      updatedAt: "2026-02-18 10:30"
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@email.com",
      subject: "Billing inquiry about invoice",
      message: "I received an invoice for $99 but I thought I was on the basic plan at $29. Can you clarify?",
      status: "in-progress",
      priority: "medium",
      category: "billing",
      createdAt: "2026-02-18 09:15",
      updatedAt: "2026-02-18 11:20",
      assignedTo: "Admin Team"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      subject: "Feature request: Dark mode",
      message: "Would love to see a dark mode option for the dashboard. Many users work late hours and this would be really helpful!",
      status: "open",
      priority: "low",
      category: "feature-request",
      createdAt: "2026-02-17 16:45",
      updatedAt: "2026-02-17 16:45"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      subject: "Data export not working",
      message: "When I try to export my data to CSV, I get an error message. This is urgent as I need it for a presentation.",
      status: "open",
      priority: "urgent",
      category: "technical",
      createdAt: "2026-02-18 08:20",
      updatedAt: "2026-02-18 08:20"
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom.brown@email.com",
      subject: "How to add team members?",
      message: "I'm on the Pro plan and need to add 3 team members but can't find where to do this in the settings.",
      status: "resolved",
      priority: "medium",
      category: "general",
      createdAt: "2026-02-17 14:30",
      updatedAt: "2026-02-18 09:00",
      assignedTo: "Support Team"
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      subject: "Enterprise plan customization",
      message: "We're interested in the Enterprise plan but need some custom integrations. Can we schedule a call?",
      status: "in-progress",
      priority: "high",
      category: "general",
      createdAt: "2026-02-16 11:00",
      updatedAt: "2026-02-17 15:30",
      assignedTo: "Sales Team"
    },
  ]);

  const stats = [
    { label: "Total Queries", value: queries.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Open", value: queries.filter(q => q.status === "open").length, gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "In Progress", value: queries.filter(q => q.status === "in-progress").length, gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Resolved Today", value: queries.filter(q => q.status === "resolved").length, gradient: "from-[#422462] to-[#937CB4]" },
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

  const handleViewQuery = (query: Query) => {
    setSelectedQuery(query);
    setResponseMessage("");
    setShowQueryModal(true);
  };

  const handleStatusChange = (queryId: number, newStatus: Query["status"]) => {
    setQueries(queries.map(q =>
      q.id === queryId ? { ...q, status: newStatus, updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ") } : q
    ));
    if (selectedQuery?.id === queryId) {
      setSelectedQuery({ ...selectedQuery, status: newStatus });
    }
  };

  const handleSendResponse = () => {
    if (!selectedQuery || !responseMessage) return;
    
    alert(`Response sent to ${selectedQuery.email}:\n\n${responseMessage}`);
    handleStatusChange(selectedQuery.id, "resolved");
    setShowQueryModal(false);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                      <Badge className={getPriorityBadge(query.priority)}>
                        {query.priority.toUpperCase()}
                      </Badge>
                      <Badge className={statusBadge.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {query.status.replace("-", " ")}
                      </Badge>
                      <Badge variant="outline" className="border-[#937CB4]/30 text-[#422462]">
                        {query.category}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-[#200B43] mb-2">{query.subject}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <User className="h-4 w-4" />
                        <span>{query.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <Mail className="h-4 w-4" />
                        <span>{query.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <Calendar className="h-4 w-4" />
                        <span>{query.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#5A4079] line-clamp-2 mb-3">{query.message}</p>

                    {query.assignedTo && (
                      <div className="text-xs text-[#958CA7]">
                        Assigned to: <span className="font-medium">{query.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                      onClick={() => handleViewQuery(query)}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredQueries.length === 0 && (
          <Card className="gradient-card border-[#937CB4]/30">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-[#937CB4] mx-auto mb-4" />
              <p className="text-[#5A4079]">No queries found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {showQueryModal && selectedQuery && (
        <Modal
          isOpen={showQueryModal}
          onClose={() => setShowQueryModal(false)}
          title="Query Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#F0E9FF] border border-[#937CB4]/30">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getPriorityBadge(selectedQuery.priority)}>
                  {selectedQuery.priority.toUpperCase()}
                </Badge>
                <Badge className={getStatusBadge(selectedQuery.status).className}>
                  {selectedQuery.status.replace("-", " ")}
                </Badge>
                <Badge variant="outline" className="border-[#937CB4]/30">
                  {selectedQuery.category}
                </Badge>
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
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Message
              </label>
              <div className="p-4 rounded-lg bg-white border border-[#937CB4]/30 text-[#5A4079]">
                {selectedQuery.message}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Your Response
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                rows={6}
                placeholder="Type your response here..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowQueryModal(false)}
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSendResponse}
                disabled={!responseMessage.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
