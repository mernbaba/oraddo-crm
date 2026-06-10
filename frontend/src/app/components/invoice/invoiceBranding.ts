// Static branding + helpers for the billing invoice document/preview. The
// issuer block and bank "Billing Details" are fixed company data (like the
// proposal footer), so they live here rather than on each invoice record. The
// dynamic parts (client, line items, totals, date, id) come from the API.

export const INVOICE_TITLE = "Billing Invoice";

// Company logo shown top-right on the document (same asset as the proposal).
export const INVOICE_LOGO_URL = "https://tridizi.com/assets/logo-BiQ4-jXQ.jpg";

// The issuing company block (top-left of the document).
export const INVOICE_ISSUER = {
  name: "TriDizi Digital Innovations LLP",
  addressLines: ["Khanamet, Hitech City Road", "Hyderabad, 500085"],
  phone: "8985622510",
  email: "sandeep@tridizi.com",
};

// Bank / payment details rendered under "Billing Details".
export const INVOICE_BANK = {
  company: "TRIDIZI DIGITAL INNOVATIONS LLP",
  accountHolder: "Thota Mamata Sri",
  accountNo: "41404931152",
  upiId: "7989389892@ibl",
  ifsc: "SBIN0018899",
  bankName: "SBI Bank",
};

// Accent colours used across the document (matches the sample invoice).
export const INVOICE_COLORS = {
  bar: "#3E6FD7", // top/bottom strips + table header
  highlight: "#D9E2F3", // "Total Payment" box
  heading: "#3E6FD7", // section underlines (BILL TO / Billing Details)
};

const CURRENCY_LOCALE: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  AUD: "en-AU",
  CAD: "en-CA",
};

/** Parse a stored amount (number or string like "30,000"/"₹30000") to a number. */
export function parseAmount(value: number | string | undefined | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const n = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Format a number using the locale that matches the invoice currency. */
export function formatInvoiceAmount(
  amount: number | string | undefined | null,
  currency: string = "INR"
): string {
  const value = parseAmount(amount);
  const locale = CURRENCY_LOCALE[currency] || "en-IN";
  return value.toLocaleString(locale);
}

/**
 * Compute the invoice money rows from the line-item amounts and the GST field.
 * `gst` may be a percentage ("18%") or a flat amount ("1800" / "₹1800" / "0").
 * Returns the sub-total (sum of line amounts), the resolved GST charge, and the
 * grand total (sub-total + GST).
 */
export function computeInvoiceTotals(
  amounts: Array<number | string> | undefined | null,
  gst: string | undefined | null
): { subtotal: number; gstCharges: number; total: number } {
  const subtotal = (amounts || []).reduce(
    (sum, a) => sum + parseAmount(a),
    0
  );

  const gstStr = String(gst ?? "").trim();
  let gstCharges = 0;
  if (gstStr.endsWith("%")) {
    const pct = parseFloat(gstStr) || 0;
    gstCharges = (subtotal * pct) / 100;
  } else {
    gstCharges = parseAmount(gstStr);
  }

  return { subtotal, gstCharges, total: subtotal + gstCharges };
}

/** True when the GST field represents a real charge (non-empty, non-zero). */
export function hasGst(gst: string | undefined | null): boolean {
  const s = String(gst ?? "").trim();
  if (!s) return false;
  return parseAmount(s) > 0;
}
