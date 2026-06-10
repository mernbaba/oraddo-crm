import { Sparkles, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  invoiceService,
  InvoiceAiDraft,
  InvoiceCurrency,
} from "../../services/revenueService";
import {
  INVOICE_ISSUER,
  computeInvoiceTotals,
  formatInvoiceAmount,
} from "./invoiceBranding";

export type InvoiceStatus = "Pending" | "Approved" | "Decline";

/** A single billed line — maps to the Module / Base / Amount table columns. */
export interface InvoiceLineItem {
  module: string;
  base: string;
  amount: string; // kept as string for the input; parsed on save
}

export interface InvoiceFormValues {
  clientName: string;
  companyName: string; // issuing company (defaults to the branding issuer)
  status: InvoiceStatus;
  date: string; // yyyy-mm-dd
  billTo: string; // multi-line client block
  items: InvoiceLineItem[];
  totalPrize: string; // full project price
  gst: string; // "18%" or "0"
  currency: InvoiceCurrency;
  invoiceType: string;
  comments: string;
  ai_prompt: string;
}

const todayInput = () => new Date().toISOString().split("T")[0];

export const emptyInvoiceForm = (): InvoiceFormValues => ({
  clientName: "",
  companyName: INVOICE_ISSUER.name,
  status: "Pending",
  date: todayInput(),
  billTo: "",
  items: [{ module: "", base: "Advance Payment", amount: "" }],
  totalPrize: "",
  gst: "0",
  currency: "INR",
  invoiceType: "Professional Services",
  comments: "",
  ai_prompt: "",
});

const inputCls =
  "w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]";
const labelCls = "block text-sm font-medium text-[#200B43] mb-1.5";

interface Props {
  value: InvoiceFormValues;
  onChange: (next: InvoiceFormValues) => void;
  /** Show the AI generator panel (create flow only). */
  showAiAssist?: boolean;
}

export function InvoiceForm({ value, onChange, showAiAssist }: Props) {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const set = <K extends keyof InvoiceFormValues>(
    key: K,
    v: InvoiceFormValues[K]
  ) => onChange({ ...value, [key]: v });

  const updateItem = (i: number, patch: Partial<InvoiceLineItem>) => {
    const items = value.items.map((it, idx) =>
      idx === i ? { ...it, ...patch } : it
    );
    set("items", items);
  };

  const addItem = () =>
    set("items", [...value.items, { module: "", base: "", amount: "" }]);

  const removeItem = (i: number) =>
    set(
      "items",
      value.items.filter((_, idx) => idx !== i)
    );

  const handleGenerate = async () => {
    if (!value.ai_prompt.trim()) {
      setAiError("Please describe the work/invoice first.");
      return;
    }
    setAiError(null);
    setGenerating(true);
    try {
      const { data } = await invoiceService.generateAi(value.ai_prompt);
      onChange(aiDraftToForm(data, value));
    } catch (err: any) {
      setAiError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to generate invoice. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Live totals preview so the user sees the math before saving.
  const { subtotal, gstCharges, total } = computeInvoiceTotals(
    value.items.map((it) => it.amount),
    value.gst
  );

  return (
    <div className="space-y-5">
      {/* AI assist */}
      {showAiAssist && (
        <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]/30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#200B43] text-sm">AI Invoice Generator</h3>
              <p className="text-xs text-[#5A4079]">
                Describe the work to pre-fill the invoice. You can edit everything below.
              </p>
            </div>
          </div>
          <textarea
            rows={3}
            value={value.ai_prompt}
            onChange={(e) => set("ai_prompt", e.target.value)}
            disabled={generating}
            className={inputCls + " resize-none disabled:opacity-60"}
            placeholder="e.g. Advance payment invoice for K Raghavendra (Saksam Sol) for Website Redesigning — 10,000 INR advance of a 30,000 INR project..."
          />
          {aiError && <p className="text-xs text-red-600">{aiError}</p>}
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#5A4079] hover:to-[#422462] disabled:opacity-70"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Invoice
              </>
            )}
          </Button>
        </div>
      )}

      {/* Client + status + date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Client Name *</label>
          <input
            type="text"
            value={value.clientName}
            onChange={(e) => set("clientName", e.target.value)}
            placeholder="K Raghavendra"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Issuing Company</label>
          <input
            type="text"
            value={value.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            value={value.status}
            onChange={(e) => set("status", e.target.value as InvoiceStatus)}
            className={inputCls}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Decline">Decline</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Invoice Date</label>
          <input
            type="date"
            value={value.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Bill To */}
      <div>
        <label className={labelCls}>Bill To (client billing details)</label>
        <textarea
          rows={4}
          value={value.billTo}
          onChange={(e) => set("billTo", e.target.value)}
          placeholder={"Saksam Sol\n9398906639\nRaghavendrak@saksamsol.com\nhttps://saksamsol.com/"}
          className={inputCls}
        />
        <p className="text-xs text-[#5A4079] mt-1.5">
          💡 One detail per line (company, phone, email, website). Shown under “Bill To”.
        </p>
      </div>

      {/* Line items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls + " mb-0"}>Line Items</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_120px_36px] gap-2 px-1 text-xs font-semibold text-[#5A4079]">
            <span>Module</span>
            <span>Base</span>
            <span>Amount</span>
            <span />
          </div>
          {value.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_120px_36px] gap-2 items-center">
              <input
                type="text"
                value={it.module}
                onChange={(e) => updateItem(i, { module: e.target.value })}
                placeholder="Website Redesigning"
                className={inputCls}
              />
              <input
                type="text"
                value={it.base}
                onChange={(e) => updateItem(i, { base: e.target.value })}
                placeholder="Advance Payment"
                className={inputCls}
              />
              <input
                type="number"
                value={it.amount}
                onChange={(e) => updateItem(i, { amount: e.target.value })}
                placeholder="10000"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-1.5 rounded hover:bg-red-50 text-red-600 justify-self-center"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Total Price (full project)</label>
          <input
            type="number"
            value={value.totalPrize}
            onChange={(e) => set("totalPrize", e.target.value)}
            placeholder="30000"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>GST</label>
          <input
            type="text"
            value={value.gst}
            onChange={(e) => set("gst", e.target.value)}
            placeholder="18% or 0"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select
            value={value.currency}
            onChange={(e) => set("currency", e.target.value as InvoiceCurrency)}
            className={inputCls}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>

      {/* Live totals preview */}
      <div className="rounded-lg bg-[#F0E9FF]/40 border border-[#937CB4]/20 px-4 py-3 text-sm">
        <div className="flex justify-between text-[#5A4079]">
          <span>Sub Total</span>
          <span>{value.currency} {formatInvoiceAmount(subtotal, value.currency)}</span>
        </div>
        {gstCharges > 0 && (
          <div className="flex justify-between text-[#5A4079]">
            <span>GST</span>
            <span>{value.currency} {formatInvoiceAmount(gstCharges, value.currency)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-[#200B43] mt-1 pt-1 border-t border-[#937CB4]/20">
          <span>Total Payment</span>
          <span>{value.currency} {formatInvoiceAmount(total, value.currency)}</span>
        </div>
      </div>

      {/* Type + comments */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelCls}>Invoice Type</label>
          <input
            type="text"
            value={value.invoiceType}
            onChange={(e) => set("invoiceType", e.target.value)}
            placeholder="Professional Services"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Comments / Notes</label>
          <textarea
            rows={2}
            value={value.comments}
            onChange={(e) => set("comments", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

// ── AI draft → form mapping ─────────────────────────────────────────────────
// Merge the AI-generated draft into the current form. Fields the model omits
// fall back to the existing value, so a partial response never wipes the form.
// `status` and the issuing company are never AI-controlled.
function aiDraftToForm(
  draft: InvoiceAiDraft,
  current: InvoiceFormValues
): InvoiceFormValues {
  const items =
    Array.isArray(draft.items) && draft.items.length
      ? draft.items.map((it) => ({
          module: it?.module || "",
          base: it?.base || "",
          amount:
            it?.amount != null && !Number.isNaN(it.amount)
              ? String(it.amount)
              : "",
        }))
      : current.items;

  return {
    clientName: draft.clientName ?? current.clientName,
    companyName: current.companyName,
    status: current.status,
    date: current.date,
    billTo: draft.billTo ?? current.billTo,
    items,
    totalPrize:
      draft.totalPrize != null && !Number.isNaN(draft.totalPrize)
        ? String(draft.totalPrize)
        : current.totalPrize,
    gst: draft.gst ?? current.gst,
    currency: draft.currency ?? current.currency,
    invoiceType: draft.invoiceType ?? current.invoiceType,
    comments: draft.comments ?? current.comments,
    ai_prompt: current.ai_prompt,
  };
}
