import { Sparkles, Plus, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  ProposalServiceItem,
  ProposalStatus,
  ProposalCurrency,
  ProposalAiDraft,
  proposalService,
} from "../../services/proposalService";

export interface ProposalFormValues {
  companyname: string;
  name: string;
  status: ProposalStatus;
  requirements: string;
  service: ProposalServiceItem[];
  timeline: string;
  pricing: string; // kept as string for the input; parsed on save
  currency: ProposalCurrency;
  pricing_note: string;
  togetstarted: string;
  ai_prompt: string;
}

export const DEFAULT_TOGETSTARTED =
  "To get started, we will raise an invoice for a 50% advance payment to proceed, please share your billing details to raise an invoice.";

export const emptyProposalForm = (): ProposalFormValues => ({
  companyname: "",
  name: "",
  status: "Pending",
  requirements: "",
  service: [{ title: "", content: "" }],
  timeline: "",
  pricing: "",
  currency: "INR",
  pricing_note: "+ GST",
  togetstarted: DEFAULT_TOGETSTARTED,
  ai_prompt: "",
});

const inputCls =
  "w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]";
const labelCls = "block text-sm font-medium text-[#200B43] mb-1.5";

interface Props {
  value: ProposalFormValues;
  onChange: (next: ProposalFormValues) => void;
  /** Show the dummy AI generator panel (create flow only). */
  showAiAssist?: boolean;
}

export function ProposalForm({ value, onChange, showAiAssist }: Props) {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const set = <K extends keyof ProposalFormValues>(
    key: K,
    v: ProposalFormValues[K]
  ) => onChange({ ...value, [key]: v });

  const updateService = (
    i: number,
    patch: Partial<ProposalServiceItem>
  ) => {
    const service = value.service.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    set("service", service);
  };

  const addService = () =>
    set("service", [...value.service, { title: "", content: "" }]);

  const removeService = (i: number) =>
    set(
      "service",
      value.service.filter((_, idx) => idx !== i)
    );

  const moveService = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.service.length) return;
    const service = [...value.service];
    [service[i], service[j]] = [service[j], service[i]];
    set("service", service);
  };

  const handleGenerate = async () => {
    if (!value.ai_prompt.trim()) {
      setAiError("Please describe the project first.");
      return;
    }
    setAiError(null);
    setGenerating(true);
    try {
      const { data } = await proposalService.generateAi(value.ai_prompt);
      onChange(aiDraftToForm(data, value));
    } catch (err: any) {
      setAiError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to generate proposal. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Dummy AI assist */}
      {showAiAssist && (
        <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]/30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#200B43] text-sm">AI Proposal Generator</h3>
              <p className="text-xs text-[#5A4079]">
                Describe the project to pre-fill the form. You can edit everything below.
              </p>
            </div>
          </div>
          <textarea
            rows={3}
            value={value.ai_prompt}
            onChange={(e) => set("ai_prompt", e.target.value)}
            disabled={generating}
            className={inputCls + " resize-none disabled:opacity-60"}
            placeholder="e.g. Website redesigning for Saksam Sol, 8-10 dynamic pages on ReactJS, deploy on Netlify, 15 days, 30,000 INR..."
          />
          {aiError && (
            <p className="text-xs text-red-600">{aiError}</p>
          )}
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
                Generate Proposal
              </>
            )}
          </Button>
        </div>
      )}

      {/* Client + status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Client Name *</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Saksam Sol"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Company Name</label>
          <input
            type="text"
            value={value.companyname}
            onChange={(e) => set("companyname", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            value={value.status}
            onChange={(e) => set("status", e.target.value as ProposalStatus)}
            className={inputCls}
          >
            <option value="Pending">Pending</option>
            <option value="Approval">Approval</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className={labelCls}>Your Requirements</label>
        <textarea
          rows={2}
          value={value.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          placeholder="Website ReDesigning for Saksam Sol"
          className={inputCls}
        />
      </div>

      {/* Service sections (markdown) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls + " mb-0"}>Service Sections</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addService}
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </div>
        <div className="space-y-3">
          {value.service.map((svc, i) => (
            <div
              key={i}
              className="rounded-lg border border-[#937CB4]/30 p-3 bg-[#F0E9FF]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) => updateService(i, { title: e.target.value })}
                  placeholder="Section title (e.g. Website Redesigning)"
                  className={inputCls}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveService(i, -1)}
                    className="p-1.5 rounded hover:bg-[#F0E9FF] text-[#5A4079] disabled:opacity-30"
                    disabled={i === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveService(i, 1)}
                    className="p-1.5 rounded hover:bg-[#F0E9FF] text-[#5A4079] disabled:opacity-30"
                    disabled={i === value.service.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <textarea
                rows={6}
                value={svc.content}
                onChange={(e) => updateService(i, { content: e.target.value })}
                placeholder={"Markdown supported. e.g.\n- An attractive UI will be designed\n- Deployment on Netlify\n  - Sub-point here"}
                className={inputCls + " font-mono text-sm"}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-[#5A4079] mt-1.5">
          💡 Section content is stored as Markdown (use <code>-</code> for bullets, indent for sub-bullets).
        </p>
      </div>

      {/* Timeline */}
      <div>
        <label className={labelCls}>Timeline and Resources</label>
        <textarea
          rows={2}
          value={value.timeline}
          onChange={(e) => set("timeline", e.target.value)}
          placeholder="According to your comfort timeline, we will complete it in 15 days duration"
          className={inputCls}
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Pricing Amount</label>
          <input
            type="number"
            value={value.pricing}
            onChange={(e) => set("pricing", e.target.value)}
            placeholder="30000"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select
            value={value.currency}
            onChange={(e) => set("currency", e.target.value as ProposalCurrency)}
            className={inputCls}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Pricing Note</label>
          <input
            type="text"
            value={value.pricing_note}
            onChange={(e) => set("pricing_note", e.target.value)}
            placeholder="+ GST"
            className={inputCls}
          />
        </div>
      </div>

      {/* To get started */}
      <div>
        <label className={labelCls}>To Get Started</label>
        <textarea
          rows={2}
          value={value.togetstarted}
          onChange={(e) => set("togetstarted", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>
  );
}

// ── AI draft → form mapping ─────────────────────────────────────────────────
// Merge the AI-generated draft into the current form. Fields the model omits
// fall back to the existing value, so a partial response never wipes the form.
// `status` is never AI-controlled, and the prompt is preserved for re-runs.
function aiDraftToForm(
  draft: ProposalAiDraft,
  current: ProposalFormValues
): ProposalFormValues {
  const service =
    Array.isArray(draft.service) && draft.service.length
      ? draft.service.map((s) => ({
          title: s?.title || "",
          content: s?.content || "",
        }))
      : current.service;

  return {
    companyname: draft.companyname ?? current.companyname,
    name: draft.name ?? current.name,
    status: current.status,
    requirements: draft.requirements ?? current.requirements,
    service,
    timeline: draft.timeline ?? current.timeline,
    pricing:
      draft.pricing != null && !Number.isNaN(draft.pricing)
        ? String(draft.pricing)
        : current.pricing,
    currency: draft.currency ?? current.currency,
    pricing_note: draft.pricing_note ?? current.pricing_note,
    togetstarted: draft.togetstarted || current.togetstarted || DEFAULT_TOGETSTARTED,
    ai_prompt: current.ai_prompt,
  };
}
