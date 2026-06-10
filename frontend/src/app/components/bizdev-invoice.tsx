import { Receipt, Plus, Search, Filter, Download, Eye, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Modal } from "./ui/modal";
import { invoiceService, ApiInvoice, InvoiceCurrency } from "../services/revenueService";
import {
  InvoiceForm,
  InvoiceFormValues,
  InvoiceStatus,
  emptyInvoiceForm,
} from "./invoice/invoice-form";
import { INVOICE_ISSUER, computeInvoiceTotals, formatInvoiceAmount } from "./invoice/invoiceBranding";

const todayInput = () => new Date().toISOString().split("T")[0];

// ── Form ↔ API mapping ──────────────────────────────────────────────────────
const invoiceToForm = (inv: ApiInvoice): InvoiceFormValues => {
  const services = Array.isArray(inv.services) ? inv.services : [];
  const base = Array.isArray(inv.base) ? inv.base : [];
  const amount = Array.isArray(inv.amount) ? inv.amount : [];
  const len = Math.max(services.length, base.length, amount.length);
  const items =
    len > 0
      ? Array.from({ length: len }, (_, i) => ({
          module: services[i] || "",
          base: base[i] || "",
          amount: amount[i] != null ? String(amount[i]) : "",
        }))
      : [{ module: "", base: "Advance Payment", amount: "" }];

  return {
    clientName: inv.clientName || "",
    companyName: inv.companyName || INVOICE_ISSUER.name,
    status: (inv.status as InvoiceStatus) || "Pending",
    date: inv.Date ? new Date(inv.Date).toISOString().split("T")[0] : todayInput(),
    billTo: inv.billTo || "",
    items,
    totalPrize: inv.totalPrize != null && inv.totalPrize !== "" ? String(inv.totalPrize) : "",
    gst: inv.GST || "0",
    currency: (inv.currency as InvoiceCurrency) || "INR",
    invoiceType: inv.invoiceType || "Professional Services",
    comments: inv.comments || "",
    ai_prompt: "",
  };
};

const formToPayload = (f: InvoiceFormValues, orgId: number): Partial<ApiInvoice> => {
  const items = f.items.filter(
    (it) => it.module.trim() || it.base.trim() || String(it.amount).trim()
  );
  const services = items.map((it) => it.module);
  const base = items.map((it) => it.base);
  const amount = items.map((it) => parseFloat(it.amount) || 0);

  const { total } = computeInvoiceTotals(amount, f.gst);
  const totalPrizeNum = parseFloat(f.totalPrize) || total;

  // invoiceId is intentionally omitted: the backend generates it on create,
  // and leaving it out on update keeps the existing id untouched.
  return {
    billTo: f.billTo.trim() || f.clientName,
    Date: f.date,
    base,
    amount,
    currency: f.currency,
    comments: f.comments,
    status: f.status,
    GST: f.gst || "0",
    Total: String(total),
    totalPrize: String(totalPrizeNum),
    companyName: f.companyName || INVOICE_ISSUER.name,
    clientName: f.clientName,
    organizationID: orgId,
    services,
    invoiceType: f.invoiceType,
  };
};

export function BizDevInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceList, setInvoiceList] = useState<ApiInvoice[]>([]);
  const [statsData, setStatsData] = useState([
    { label: "Total Invoices", value: "0", change: "+0", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Total Revenue", value: "₹0", change: "+0%", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Paid", value: "0", change: "+0%", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Pending", value: "0", change: "+0", gradient: "from-[#422462] to-[#937CB4]" },
  ]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);

  const [createForm, setCreateForm] = useState<InvoiceFormValues>(emptyInvoiceForm());
  const [editForm, setEditForm] = useState<InvoiceFormValues>(emptyInvoiceForm());
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
    if (orgId !== null) {
      fetchData();
    }
  }, [orgId, searchTerm]);

  const fetchData = async () => {
    if (orgId === null) return;
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();

      // 1. Finance stats (approved invoices for the year)
      const financeRes = await invoiceService.getByOrgForFinance(orgId, currentYear);
      const financeInvoices = financeRes.data.invoices || [];
      const totalRevenue = financeInvoices.reduce(
        (sum, inv) => sum + (parseFloat(inv.Total) || 0),
        0
      );

      // 2. Table data (all invoices for the year)
      const tableRes = await invoiceService.getTableData(orgId, {
        page: 0,
        pageSize: 50,
        year: currentYear,
      });
      const invoices = tableRes.data.invoices || [];
      setInvoiceList(invoices);

      const paidCount = invoices.filter((inv) => inv.status === "Approved").length;
      const pendingCount = invoices.filter((inv) => inv.status === "Pending").length;

      setStatsData([
        { label: "Total Invoices", value: (tableRes.data.totalInvoice || invoices.length).toString(), change: "+0", gradient: "from-[#422462] to-[#5A4079]" },
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "+0%", gradient: "from-[#5A4079] to-[#937CB4]" },
        { label: "Paid", value: paidCount.toString(), change: "+0%", gradient: "from-[#937CB4] to-[#5A4079]" },
        { label: "Pending", value: pendingCount.toString(), change: "+0", gradient: "from-[#422462] to-[#937CB4]" },
      ]);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Decline": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const filteredInvoices = invoiceList.filter((inv) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (inv.clientName || "").toLowerCase().includes(q) ||
      (inv.invoiceId || "").toLowerCase().includes(q)
    );
  });

  const handleCreate = async () => {
    if (orgId === null) {
      alert("Organization ID not found. Please refresh the page.");
      return;
    }
    if (!createForm.clientName.trim()) {
      alert("Client name is required.");
      return;
    }
    setIsSaving(true);
    try {
      await invoiceService.create(formToPayload(createForm, orgId));
      setShowCreateModal(false);
      setCreateForm(emptyInvoiceForm());
      fetchData();
    } catch (error: any) {
      alert(`Failed to save invoice: ${error?.response?.data?.error || error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (invoice: ApiInvoice) => {
    setEditingId(invoice.id);
    setEditForm(invoiceToForm(invoice));
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (orgId === null || editingId === null) return;
    if (!editForm.clientName.trim()) {
      alert("Client name is required.");
      return;
    }
    setIsSaving(true);
    try {
      await invoiceService.update(editingId, formToPayload(editForm, orgId));
      setShowEditModal(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      alert(`Failed to update invoice: ${error?.response?.data?.error || error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await invoiceService.delete(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <Receipt className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Invoice Generation</h2>
            <p className="text-[#5A4079]">Create and manage invoices</p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          onClick={() => { setCreateForm(emptyInvoiceForm()); setShowCreateModal(true); }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <DollarSign className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <input
            type="text"
            placeholder="Search invoices..."
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
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Invoice ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5A4079]">
                    No invoices yet. Click “New Invoice” to create one.
                  </td>
                </tr>
              )}
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-[#422462]">{invoice.invoiceId}</td>
                  <td className="p-4 text-sm text-[#200B43]">{invoice.clientName}</td>
                  <td className="p-4 text-sm font-semibold text-[#422462]">
                    {invoice.currency || "INR"} {formatInvoiceAmount(invoice.Total, invoice.currency)}
                  </td>
                  <td className="p-4 text-sm text-[#5A4079]">{invoice.Date ? new Date(invoice.Date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="ghost" title="View / Preview" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Link to={`/app/business-development/invoice/${invoice.id}`}>
                          <Eye className="h-4 w-4 text-[#5A4079]" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" title="Download PDF" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Link to={`/app/business-development/invoice/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 text-[#5A4079]" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" title="Edit" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => openEdit(invoice)}>
                        <Edit className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Delete" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => handleDeleteInvoice(invoice.id)}>
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Invoice" size="lg">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <InvoiceForm value={createForm} onChange={setCreateForm} showAiAssist />
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button type="button" disabled={isSaving} onClick={handleCreate} className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
            {isSaving ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </Modal>

      {/* Edit */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Invoice" size="lg">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <InvoiceForm value={editForm} onChange={setEditForm} />
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
          {editingId && (
            <Button asChild variant="outline" className="border-[#422462]/30 text-[#422462] hover:bg-[#F0E9FF]/50">
              <Link to={`/app/business-development/invoice/${editingId}`} target="_blank" rel="noopener noreferrer">
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
