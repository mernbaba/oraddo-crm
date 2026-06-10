import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Proposal } from "../../services/proposalService";
import {
  PROPOSAL_LOGO_URL,
  PROPOSAL_WATERMARK_URL,
  PROPOSAL_FOOTER,
  buildPricingLine,
} from "./proposalBranding";

/**
 * The visual proposal document — matches the printed PDF layout (logo top-left,
 * faint watermark behind the body, markdown service sections, fixed company
 * footer). Used by both the standalone preview page and the print output.
 */
export function ProposalDocument({
  proposal,
  logoUrl,
}: {
  proposal: Proposal;
  /** Organization's uploaded logo; falls back to the static brand logo. */
  logoUrl?: string | null;
}) {
  const services = Array.isArray(proposal.service) ? proposal.service : [];
  const pricingLine = buildPricingLine(
    proposal.pricing,
    proposal.currency,
    proposal.pricing_note
  );

  return (
    <div className="proposal-doc relative mx-auto bg-white text-[#1a1a1a]">
      {/* Faint centered watermark behind the content */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${PROPOSAL_WATERMARK_URL})`,
          backgroundSize: "70%",
          opacity: 0.06,
        }}
      />

      <div className="relative z-10 flex min-h-full flex-col">
        {/* Logo */}
        <img
          src={logoUrl || PROPOSAL_LOGO_URL}
          alt={proposal.companyname || "Logo"}
          className="mb-8 h-16 w-auto object-contain"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== PROPOSAL_LOGO_URL) img.src = PROPOSAL_LOGO_URL;
          }}
        />

        {/* Title */}
        <h1 className="mb-8 text-center text-2xl font-bold">
          Proposal Quotation for {proposal.name || proposal.companyname || "—"}
        </h1>

        {/* Requirements */}
        {proposal.requirements && (
          <section className="mb-6">
            <p className="mb-2 font-bold">Your Requirements:</p>
            <p className="whitespace-pre-line pl-8 text-[15px] leading-relaxed">
              {proposal.requirements}
            </p>
          </section>
        )}

        {/* Service sections */}
        {services.map((svc, i) => (
          <section key={i} className="mb-6">
            {svc.title && <p className="mb-2 font-bold">{svc.title}</p>}
            {svc.content && (
              <div className="prose-proposal pl-2 text-[15px] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {svc.content}
                </ReactMarkdown>
              </div>
            )}
          </section>
        ))}

        {/* Timeline and Resources */}
        {proposal.timeline && (
          <section className="mb-6">
            <p className="mb-2 font-bold">Timeline and Resources:</p>
            <p className="whitespace-pre-line pl-8 text-[15px] leading-relaxed">
              {proposal.timeline}
            </p>
          </section>
        )}

        {/* Pricing */}
        <section className="mb-6">
          <p className="mb-3 font-bold">Pricing:</p>
          <p className="text-center text-[15px] font-bold">{pricingLine}</p>
        </section>

        {/* To get started */}
        {proposal.togetstarted && (
          <section className="mb-6">
            <p className="whitespace-pre-line text-[15px] leading-relaxed">
              {proposal.togetstarted}
            </p>
          </section>
        )}

        {/* Footer pinned to the bottom of the page */}
        <footer className="mt-auto border-t border-gray-200 pt-3 text-[10px] leading-snug text-gray-500">
          <p>Registered Address: {PROPOSAL_FOOTER.registeredAddress}</p>
          <p>
            Corporate Office: {PROPOSAL_FOOTER.corporateOffice} | Contact:{" "}
            {PROPOSAL_FOOTER.contact} | Email: {PROPOSAL_FOOTER.email} |
            Website: {PROPOSAL_FOOTER.website} | LLP: {PROPOSAL_FOOTER.llp} |
            PAN: {PROPOSAL_FOOTER.pan}
          </p>
        </footer>
      </div>
    </div>
  );
}
