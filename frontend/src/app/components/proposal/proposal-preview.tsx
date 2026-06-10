import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { proposalService, Proposal } from "../../services/proposalService";
import { ProposalDocument } from "./proposal-document";

/**
 * Standalone, full-page proposal preview opened in a new tab. Shows the
 * rendered document and a Download button that uses the browser's print
 * dialog (Save as PDF) so the download matches the on-screen layout exactly.
 */
export function ProposalPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await proposalService.getById(Number(id));
        if (active) setProposal(res.data);
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load proposal");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (proposal) {
      document.title = `Proposal — ${proposal.name || proposal.companyname || id}`;
    }
  }, [proposal, id]);

  return (
    <div className="min-h-screen bg-[#525659] print:bg-white">
      <style>{PRINT_STYLES}</style>

      {/* Toolbar (hidden when printing) */}
      <div className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-black/20 bg-[#323639] px-4 py-3 text-white">
        <button
          onClick={() => {
            // When opened in a new tab (e.g. from the Edit modal Preview),
            // window.close() works. When navigated to directly within the SPA,
            // the browser refuses to close the tab, so fall back to the list.
            window.close();
            navigate("/app/business-development/proposal");
          }}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Close
        </button>
        <span className="truncate px-2 text-sm font-medium text-gray-200">
          {proposal
            ? `Proposal Quotation for ${proposal.name || proposal.companyname}`
            : "Loading…"}
        </span>
        <button
          onClick={() => window.print()}
          disabled={!proposal}
          className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#422462] to-[#5A4079] px-4 py-1.5 text-sm font-medium text-white shadow hover:from-[#5A4079] hover:to-[#422462] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Document area */}
      <div className="flex justify-center px-4 py-8 print:p-0">
        {loading && (
          <div className="flex items-center gap-2 py-20 text-gray-200">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading proposal…
          </div>
        )}
        {error && !loading && (
          <div className="py-20 text-center text-red-300">{error}</div>
        )}
        {proposal && !loading && (
          <div className="proposal-page shadow-2xl print:shadow-none">
            <ProposalDocument proposal={proposal} logoUrl={proposal.organization?.companyLogo} />
          </div>
        )}
      </div>
    </div>
  );
}

// A4-sized page + markdown list styling + print rules, scoped to this page.
const PRINT_STYLES = `
  .proposal-page {
    width: 794px;
    background: #fff;
  }
  .proposal-doc {
    min-height: 1123px;
    padding: 56px 64px 40px;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .prose-proposal ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin: 0;
  }
  .prose-proposal ul ul {
    list-style: circle;
    padding-left: 1.5rem;
  }
  .prose-proposal li { margin: 2px 0; }
  .prose-proposal p { margin: 4px 0; }
  .prose-proposal a { color: #422462; text-decoration: underline; }
  .prose-proposal strong { font-weight: 700; }

  @media print {
    @page { size: A4; margin: 0; }
    html, body { background: #fff !important; }
    /* Isolate the document — hide everything else (toolbar, global app
       chrome like the fixed Logout button) so only the page prints. */
    body * { visibility: hidden !important; }
    .proposal-page, .proposal-page * { visibility: visible !important; }
    .no-print { display: none !important; }
    .proposal-page {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      box-shadow: none !important;
    }
    .proposal-doc { min-height: 100vh; padding: 48px 56px 32px; }
  }
`;
