import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserPlus, TrendingUp, Target, Mail, Phone, Building2, Plus, Star, Search, Filter, Edit2, Trash2, X } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Modal } from "./ui/modal";

const leads = [
  { 
    id: "1", 
    name: "Acme Corporation", 
    contact: "Jennifer Martinez", 
    email: "j.martinez@acme.com", 
    phone: "+1 (555) 123-4567",
    source: "Website", 
    score: 85, 
    status: "hot", 
    value: "₹125,000",
    assignedTo: "Sarah J.",
    lastContact: "2026-01-08"
  },
  { 
    id: "2", 
    name: "TechStart Inc", 
    contact: "Robert Chen", 
    email: "r.chen@techstart.io", 
    phone: "+1 (555) 234-5678",
    source: "LinkedIn", 
    score: 72, 
    status: "warm", 
    value: "₹89,000",
    assignedTo: "Mike C.",
    lastContact: "2026-01-09"
  },
  { 
    id: "3", 
    name: "Global Ventures", 
    contact: "Sarah Thompson", 
    email: "s.thompson@globalventures.com", 
    phone: "+1 (555) 345-6789",
    source: "Referral", 
    score: 91, 
    status: "hot", 
    value: "₹210,000",
    assignedTo: "John S.",
    lastContact: "2026-01-10"
  },
  { 
    id: "4", 
    name: "Innovation Labs", 
    contact: "Michael Foster", 
    email: "m.foster@innovationlabs.com", 
    phone: "+1 (555) 456-7890",
    source: "Trade Show", 
    score: 58, 
    status: "warm", 
    value: "₹67,000",
    assignedTo: "Emily D.",
    lastContact: "2026-01-07"
  },
  { 
    id: "5", 
    name: "DataFlow Systems", 
    contact: "Lisa Anderson", 
    email: "l.anderson@dataflow.io", 
    phone: "+1 (555) 567-8901",
    source: "Cold Outreach", 
    score: 42, 
    status: "cold", 
    value: "₹45,000",
    assignedTo: "Tom B.",
    lastContact: "2026-01-06"
  },
];

const leadSourceData = [
  { source: "Website", count: 145, converted: 42 },
  { source: "LinkedIn", count: 98, converted: 28 },
  { source: "Referral", count: 76, converted: 35 },
  { source: "Trade Show", count: 62, converted: 18 },
  { source: "Cold Outreach", count: 124, converted: 22 },
  { source: "Email Campaign", count: 89, converted: 25 },
];

const leadTrendsData = [
  { month: "Jan", generated: 142, qualified: 85, converted: 12 },
  { month: "Feb", generated: 158, qualified: 92, converted: 18 },
  { month: "Mar", generated: 135, qualified: 78, converted: 15 },
  { month: "Apr", generated: 176, qualified: 105, converted: 22 },
  { month: "May", generated: 189, qualified: 118, converted: 28 },
  { month: "Jun", generated: 168, qualified: 102, converted: 24 },
];

const scoreDistribution = [
  { range: "0-20", count: 45, color: "#ef4444" },
  { range: "21-40", count: 78, color: "#f59e0b" },
  { range: "41-60", count: 124, color: "#eab308" },
  { range: "61-80", count: 186, color: "#84cc16" },
  { range: "81-100", count: 161, color: "#10b981" },
];

export function LeadGeneration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const nameMatch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     lead.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === "all" || lead.status === filterStatus;
    const sourceMatch = filterSource === "all" || lead.source === filterSource;
    return nameMatch && statusMatch && sourceMatch;
  });

  const handleViewDetails = (lead: typeof leads[0]) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleEdit = (lead: typeof leads[0]) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Generation</h2>
          <p className="text-muted-foreground">
            Capture, qualify, and nurture leads through the sales funnel
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">594</div>
            <p className="text-xs text-muted-foreground">
              +28 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.8%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.3</div>
            <p className="text-xs text-muted-foreground">
              +5.2 point increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2.8M</div>
            <p className="text-xs text-muted-foreground">
              From qualified leads
            </p>
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
          <div className="flex items-center justify-between mb-4">
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
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Sources</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Email Campaign">Email Campaign</option>
              </select>
            </div>
          </div>
          {filteredLeads.map((lead) => {
            const statusColors = {
              hot: "bg-red-100 text-red-800 border-red-300",
              warm: "bg-yellow-100 text-yellow-800 border-yellow-300",
              cold: "bg-blue-100 text-blue-800 border-blue-300",
            };

            const initials = lead.assignedTo.split(' ').map(n => n[0]).join('');

            return (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle>{lead.name}</CardTitle>
                          <CardDescription>{lead.contact}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-bold">{lead.value}</div>
                      <Badge variant="outline" className={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium">{lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium">{lead.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Source</p>
                        <p className="text-sm font-medium">{lead.source}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Contact</p>
                        <p className="text-sm font-medium">{new Date(lead.lastContact).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-muted-foreground">Lead Score</span>
                        </div>
                        <span className="text-sm font-bold">{lead.score}/100</span>
                      </div>
                      <Progress value={lead.score} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">Assigned to {lead.assignedTo}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Contact</Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(lead)}>View Details</Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(lead)}>Update Status</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources Performance</CardTitle>
                <CardDescription>Lead count and conversion by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leadSourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Total Leads" />
                    <Bar dataKey="converted" fill="#10b981" name="Converted" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Score Distribution</CardTitle>
                <CardDescription>Distribution of leads by score range</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.range}: ${entry.count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {leadSourceData.map((source, index) => {
              const conversionRate = Math.round((source.converted / source.count) * 100);

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{source.source}</CardTitle>
                      <Badge variant={conversionRate > 30 ? "default" : conversionRate > 20 ? "secondary" : "outline"}>
                        {conversionRate}% conversion
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Leads</p>
                        <p className="text-2xl font-bold">{source.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Converted</p>
                        <p className="text-2xl font-bold">{source.converted}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rate</p>
                        <p className="text-2xl font-bold">{conversionRate}%</p>
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
              <CardTitle>Lead Generation Trends</CardTitle>
              <CardDescription>Monthly lead generation and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={leadTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="generated" stroke="#3b82f6" strokeWidth={2} name="Generated" />
                  <Line type="monotone" dataKey="qualified" stroke="#f59e0b" strokeWidth={2} name="Qualified" />
                  <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} name="Converted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Company Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Contact Person</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Source</label>
              <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option>Website</option>
                <option>LinkedIn</option>
                <option>Referral</option>
                <option>Trade Show</option>
                <option>Cold Outreach</option>
                <option>Email Campaign</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option>hot</option>
                <option>warm</option>
                <option>cold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Estimated Value</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="$0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Lead Score</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="0-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#200B43] mb-2">Notes</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              placeholder="Add any additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">Create Lead</Button>
          </div>
        </form>
      </Modal>

      {/* View Lead Details Modal */}
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
                  <h3 className="text-2xl font-bold text-[#200B43]">{selectedLead.name}</h3>
                  <p className="text-[#5A4079]">{selectedLead.contact}</p>
                </div>
              </div>
              <Badge className={
                selectedLead.status === "hot" ? "bg-red-100 text-red-800" :
                selectedLead.status === "warm" ? "bg-yellow-100 text-yellow-800" :
                "bg-blue-100 text-blue-800"
              }>
                {selectedLead.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Email</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Phone</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Source</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.source}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Estimated Value</label>
                  <p className="text-2xl font-bold text-[#200B43]">{selectedLead.value}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Assigned To</label>
                  <p className="text-[#200B43] font-medium">{selectedLead.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Last Contact</label>
                  <p className="text-[#200B43] font-medium">{new Date(selectedLead.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#5A4079]">Lead Score</label>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-[#200B43]">{selectedLead.score}/100</span>
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </div>
                <Progress value={selectedLead.score} className="h-3" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Lead
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Lead Modal */}
      {selectedLead && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Lead"
          size="lg"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue={selectedLead.name}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Contact Person</label>
                <input
                  type="text"
                  defaultValue={selectedLead.contact}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedLead.email}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedLead.phone}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Source</label>
                <select 
                  defaultValue={selectedLead.source}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option>Website</option>
                  <option>LinkedIn</option>
                  <option>Referral</option>
                  <option>Trade Show</option>
                  <option>Cold Outreach</option>
                  <option>Email Campaign</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
                <select 
                  defaultValue={selectedLead.status}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Estimated Value</label>
                <input
                  type="text"
                  defaultValue={selectedLead.value}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Lead Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={selectedLead.score}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}