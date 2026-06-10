import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Modal } from "./ui/modal";
import { proposalService, Proposal } from "../services/proposalService";
import {
  ProposalForm,
  ProposalFormValues,
  emptyProposalForm,
  DEFAULT_TOGETSTARTED,
} from "./proposal/proposal-form";
import { formatProposalAmount } from "./proposal/proposalBranding";

const proposalToForm = (p: Proposal): ProposalFormValues => ({
  companyname: p.companyname || "",
  name: p.name || "",
  status: p.status || "Pending",
  requirements: p.requirements || "",
  service:
    Array.isArray(p.service) && p.service.length
      ? p.service.map((s: any) => ({ title: s?.title || "", content: s?.content || "" }))
      : [{ title: "", content: "" }],
  timeline: p.timeline || "",
  pricing: p.pricing != null ? String(p.pricing) : "",
  currency: p.currency || "INR",
  pricing_note: p.pricing_note || "",
  togetstarted: p.togetstarted || DEFAULT_TOGETSTARTED,
  ai_prompt: p.ai_prompt || "",
});

const formToPayload = (
  f: ProposalFormValues,
  orgId: number
): Partial<Proposal> => ({
  companyname: f.companyname || f.name,
  name: f.name,
  status: f.status,
  requirements: f.requirements,
  service: f.service.filter((s) => s.title.trim() || s.content.trim()),
  timeline: f.timeline,
  pricing: parseFloat(f.pricing) || 0,
  currency: f.currency,
  pricing_note: f.pricing_note,
  togetstarted: f.togetstarted,
  ai_prompt: f.ai_prompt,
  organizationID: orgId,
});

export function BizDevProposal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [proposalList, setProposalList] = useState<Proposal[]>([]);
  const [statsData, setStatsData] = useState([
    { label: "Total Proposals", value: "0", change: "0%", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Total Value", value: "₹0", change: "0%", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Approval", value: "0", change: "0%", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Declined", value: "0", change: "0%", gradient: "from-[#422462] to-[#937CB4]" },
  ]);
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [createForm, setCreateForm] = useState<ProposalFormValues>(emptyProposalForm());
  const [editForm, setEditForm] = useState<ProposalFormValues>(emptyProposalForm());
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const parsedUser = JSON.parse(data);
      if (parsedUser.organizationId !== undefined && parsedUser.organizationId !== null) {
        setOrgId(Number(parsedUser.organizationId));
      }
    }
  }, []);

  useEffect(() => {
    if (orgId) fetchData();
  }, [orgId, searchTerm]);

  const fetchData = async () => {
    if (orgId === null) return;
    setLoading(true);
    try {
      const statsRes = await proposalService.getByOrg(orgId);
      const allProposals = statsRes.data.praposals || [];

      const totalVal = allProposals.reduce((sum: number, p: any) => sum + (p.pricing || 0), 0);
      const approvalCount = allProposals.filter((p: any) => p.status === "Approval").length;
      const declinedCount = allProposals.filter((p: any) => p.status === "Declined").length;

      setStatsData([
        { label: "Total Proposals", value: allProposals.length.toString(), change: "+0%", gradient: "from-[#422462] to-[#5A4079]" },
        { label: "Total Value", value: `₹${totalVal.toLocaleString("en-IN")}`, change: "+0%", gradient: "from-[#5A4079] to-[#937CB4]" },
        { label: "Approval", value: approvalCount.toString(), change: "+0%", gradient: "from-[#937CB4] to-[#5A4079]" },
        { label: "Declined", value: declinedCount.toString(), change: "-0%", gradient: "from-[#422462] to-[#937CB4]" },
      ]);

      const tableRes = await proposalService.getTableData(orgId, { search: searchTerm, page: 0, pageSize: 50 });
      setProposalList(tableRes.data.praposals || []);
    } catch (error) {
      console.error("Error fetching proposal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approval": return "bg-green-100 text-green-700 border-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Declined": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleCreate = async () => {
    if (orgId === null) {
      alert("Organization ID not found. Please refresh the page.");
      return;
    }
    if (!createForm.name.trim()) {
      alert("Client name is required.");
      return;
    }
    setIsSaving(true);
    try {
      await proposalService.create(formToPayload(createForm, orgId));
      setShowCreateModal(false);
      setCreateForm(emptyProposalForm());
      fetchData();
    } catch (error: any) {
      alert(`Failed to save proposal: ${error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (proposal: Proposal) => {
    setEditingId(proposal.id);
    setEditForm(proposalToForm(proposal));
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (orgId === null || editingId === null) return;
    if (!editForm.name.trim()) {
      alert("Client name is required.");
      return;
    }
    setIsSaving(true);
    try {
      await proposalService.update(editingId, formToPayload(editForm, orgId));
      setShowEditModal(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      alert(`Failed to update proposal: ${error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProposal = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    try {
      await proposalService.delete(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting proposal:", error);
      alert("Failed to delete proposal.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <FileText className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Proposal Quotation</h2>
            <p className="text-[#5A4079]">Manage and track business proposals</p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          onClick={() => { setCreateForm(emptyProposalForm()); setShowCreateModal(true); }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <input
            type="text"
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Client Name</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Sections</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Pricing</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposalList.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5A4079]">No proposals yet. Click “New Proposal” to create one.</td>
                </tr>
              )}
              {proposalList.map((proposal) => (
                <tr key={proposal.id} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-[#422462]">{proposal.id}</td>
                  <td className="p-4 text-sm text-[#200B43]">{proposal.name}</td>
                  <td className="p-4 text-sm text-[#200B43]">{Array.isArray(proposal.service) ? proposal.service.length : 0} Sections</td>
                  <td className="p-4 text-sm font-semibold text-[#422462]">{proposal.currency || "INR"} {formatProposalAmount(proposal.pricing, proposal.currency)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>{proposal.status}</span>
                  </td>
                  <td className="p-4 text-sm text-[#5A4079]">{proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="ghost" title="View / Preview" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Link to={`/app/business-development/proposal/${proposal.id}`}>
                          <Eye className="h-4 w-4 text-[#5A4079]" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" title="Edit" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => openEdit(proposal)}>
                        <Edit className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Delete" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => handleDeleteProposal(proposal.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Proposal" size="lg">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <ProposalForm value={createForm} onChange={setCreateForm} showAiAssist />
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button type="button" disabled={isSaving} onClick={handleCreate} className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
            {isSaving ? "Saving..." : "Save Proposal"}
          </Button>
        </div>
      </Modal>

      {/* Edit */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Proposal" size="lg">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <ProposalForm value={editForm} onChange={setEditForm} />
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
          {editingId && (
            <Button asChild variant="outline" className="border-[#422462]/30 text-[#422462] hover:bg-[#F0E9FF]/50">
              <Link to={`/app/business-development/proposal/${editingId}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" /> Preview
              </Link>
            </Button>
          )}
          <Button type="button" disabled={isSaving} onClick={handleUpdate} className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
