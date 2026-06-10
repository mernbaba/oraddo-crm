import { ApiInvoice } from "../../services/revenueService";
import {
  INVOICE_TITLE,
  INVOICE_LOGO_URL,
  INVOICE_ISSUER,
  INVOICE_BANK,
  INVOICE_COLORS,
  computeInvoiceTotals,
  formatInvoiceAmount,
  parseAmount,
} from "./invoiceBranding";

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  AUD: "A$",
  CAD: "C$",
};

/** "₹ 30,000 INR" — symbol + locale-formatted amount + currency code. */
function money(amount: number | string, currency: string): string {
  const symbol = CURRENCY_SYMBOL[currency] || "";
  return `${symbol} ${formatInvoiceAmount(amount, currency)} ${currency}`.trim();
}

/** yyyy/mm/dd — matches the sample invoice date format. */
function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}/${mm}/${dd}`;
}

/**
 * The visual billing invoice — matches the printed layout (issuer block + logo,
 * Bill To / Billing Details columns, Module/Base/Amount table, and the stacked
 * totals). Used by both the standalone preview page and the print output.
 *
 * `logoUrl` is the organization's uploaded logo; it falls back to the static
 * brand logo when the org hasn't uploaded one.
 */
export function InvoiceDocument({
  invoice,
  logoUrl,
}: {
  invoice: ApiInvoice;
  logoUrl?: string | null;
}) {
  const currency = invoice.currency || "INR";

  const services = Array.isArray(invoice.services) ? invoice.services : [];
  const bases = Array.isArray(invoice.base) ? invoice.base : [];
  const amounts = Array.isArray(invoice.amount) ? invoice.amount : [];
  const rowCount = Math.max(services.length, bases.length, amounts.length);
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    module: services[i] || "—",
    base: bases[i] || "—",
    amount: amounts[i],
  }));

  const { subtotal, gstCharges } = computeInvoiceTotals(amounts, invoice.GST);
  const totalPrice = parseAmount(invoice.totalPrize) || subtotal;
  const totalPayment = parseAmount(invoice.Total) || subtotal + gstCharges;
  // The middle row label mirrors the sample ("Advance Payment"); fall back to a
  // generic "Sub Total" when no payment basis was entered.
  const middleLabel =
    bases.find((b) => b && b.trim()) || "Sub Total";

  const issuerName = invoice.companyName || INVOICE_ISSUER.name;

  return (
    <div className="invoice-doc relative mx-auto flex min-h-full flex-col bg-white text-[#1a1a1a]">
      {/* Top accent strip */}
      <div className="h-2.5 w-full" style={{ backgroundColor: INVOICE_COLORS.bar }} />

      <div className="flex flex-1 flex-col px-14 py-10">
        {/* Title + logo */}
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-semibold text-gray-500">{INVOICE_TITLE}</h1>
          <img
            src={logoUrl || INVOICE_LOGO_URL}
            alt={issuerName}
            className="h-14 w-auto object-contain"
            onError={(e) => {
              // If the org logo URL is broken, fall back to the brand logo.
              const img = e.currentTarget;
              if (img.src !== INVOICE_LOGO_URL) img.src = INVOICE_LOGO_URL;
            }}
          />
        </div>

        {/* Issuer block + date / invoice number */}
        <div className="mt-6 flex items-start justify-between gap-10">
          <div className="text-[15px] leading-relaxed text-[#1a1a1a]">
            <p className="font-bold">{issuerName}</p>
            {INVOICE_ISSUER.addressLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <p>{INVOICE_ISSUER.phone}</p>
            <p>{INVOICE_ISSUER.email}</p>
          </div>

          <div className="w-[230px] shrink-0 space-y-5 pt-1">
            <div>
              <p className="text-center text-sm font-bold">
                {formatDate(invoice.Date)}
              </p>
              <div className="mt-1 border-b border-gray-300" />
            </div>
            <div>
              <p className="text-center text-sm font-bold tracking-wide">
                {invoice.invoiceId || "—"}
              </p>
              <div className="mt-1 border-b border-gray-300" />
            </div>
          </div>
        </div>

        {/* Bill To + Billing Details */}
        <div className="mt-8 grid grid-cols-2 gap-10">
          <div>
            <h3
              className="border-b pb-1 text-xs font-bold uppercase tracking-wide"
              style={{ color: INVOICE_COLORS.heading, borderColor: INVOICE_COLORS.heading }}
            >
              Bill To
            </h3>
            <p className="mt-3 text-[15px] font-medium">{invoice.clientName || "—"}</p>
            {invoice.billTo && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#333]">
                {invoice.billTo}
              </p>
            )}
          </div>

          <div>
            <h3
              className="border-b pb-1 text-xs font-bold uppercase tracking-wide"
              style={{ color: INVOICE_COLORS.heading, borderColor: INVOICE_COLORS.heading }}
            >
              Billing Details
            </h3>
            <div className="mt-3 text-sm leading-relaxed text-[#333]">
              <p>{INVOICE_BANK.company}</p>
              <p>Account Holder Name: {INVOICE_BANK.accountHolder}</p>
              <p>Account No: {INVOICE_BANK.accountNo}</p>
              <p className="mt-2">UPI ID: {INVOICE_BANK.upiId}</p>
              <p>IFSC: {INVOICE_BANK.ifsc}</p>
              <p>Bank Name: {INVOICE_BANK.bankName}</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <table className="mt-10 w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: INVOICE_COLORS.bar }} className="text-white">
              <th className="px-4 py-3 text-center font-semibold">Module</th>
              <th className="px-4 py-3 text-center font-semibold">Base</th>
              <th className="px-4 py-3 text-center font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr className="border-b border-gray-200 bg-gray-50">
                <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                  No line items
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-200 bg-gray-50">
                <td className="px-4 py-3 text-center">{row.module}</td>
                <td className="px-4 py-3 text-center">{row.base}</td>
                <td className="px-4 py-3 text-center">
                  {row.amount != null ? money(row.amount, currency) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-10 space-y-6">
          <TotalRow label="Total Price:" value={money(totalPrice, currency)} />
          <TotalRow label={middleLabel} value={money(subtotal, currency)} />
          {gstCharges > 0 && (
            <TotalRow
              label={`GST${invoice.GST ? ` (${invoice.GST})` : ""}`}
              value={money(gstCharges, currency)}
            />
          )}
          <TotalRow
            label="Total Payment"
            value={money(totalPayment, currency)}
            highlight
          />
        </div>

        {invoice.comments && (
          <p className="mt-8 text-xs leading-relaxed text-gray-500">
            {invoice.comments}
          </p>
        )}
      </div>

      {/* Bottom accent strip */}
      <div
        className="mt-auto h-2.5 w-full"
        style={{ backgroundColor: INVOICE_COLORS.bar }}
      />
    </div>
  );
}

function TotalRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-8">
      <span className="text-[15px] text-[#1a1a1a]">{label}</span>
      {highlight ? (
        <span
          className="min-w-[230px] px-4 py-2 text-right text-base font-bold"
          style={{ backgroundColor: INVOICE_COLORS.highlight }}
        >
          {value}
        </span>
      ) : (
        <span className="min-w-[230px] border-b border-gray-300 pb-1 text-right text-base font-semibold">
          {value}
        </span>
      )}
    </div>
  );
}
