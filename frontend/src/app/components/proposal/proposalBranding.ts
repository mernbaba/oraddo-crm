// Static branding used by the proposal document/preview. These assets live on
// the marketing site, so we reference them by absolute URL.
export const PROPOSAL_LOGO_URL =
  "https://tridizi.com/assets/logo-BiQ4-jXQ.jpg";

// Large, faint watermark sitting behind the document body.
export const PROPOSAL_WATERMARK_URL =
  "https://tridizi.com/assets/footerlogo-BlFuelPx.png";

// Fixed company details rendered in the document footer.
export const PROPOSAL_FOOTER = {
  registeredAddress:
    "Sree Homes, 202, Hitech City Road, Kondapur, Serilingampally (M), Hyderabad, Telangana, Pin code – 500084",
  corporateOffice:
    "T Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, anmakha, Hyderabad, Serilingampalle (M), Telangana, Pin code – 500032",
  contact: "+918019570144",
  email: "hr@tridizi.com",
  website: "www.tridizi.com",
  llp: "ACJ-5677",
  pan: "AAWFT8899G",
};

const CURRENCY_LOCALE: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  AUD: "en-AU",
  CAD: "en-CA",
};

/** Formats a number using the locale that matches the proposal currency. */
export function formatProposalAmount(
  amount: number | undefined | null,
  currency: string = "INR"
): string {
  const value = Number(amount) || 0;
  const locale = CURRENCY_LOCALE[currency] || "en-IN";
  return value.toLocaleString(locale);
}

/**
 * Builds the bold pricing sentence shown in the document. When the user has
 * supplied a custom `pricing_note` we trust it as the full line; otherwise we
 * generate a default sentence from the amount + currency, appending the note
 * (e.g. "+ GST") when it looks like a suffix.
 */
export function buildPricingLine(
  pricing: number | undefined | null,
  currency: string = "INR",
  pricingNote?: string
): string {
  const note = (pricingNote || "").trim();
  // A long custom note is treated as the complete sentence.
  if (note && note.length > 24) return note;

  const amount = formatProposalAmount(pricing, currency);
  const suffix = note ? ` ${note}` : "";
  return `Complete Platform cost will be ${amount} ${currency}${suffix}`;
}
