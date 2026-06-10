import api from "../api";

// Real PostgreSQL model: RevenueCreation
export interface ApiRevenue {
  id: number;
  paymentDetails: string;
  debit: number;
  credit: number;
  date: string;
  total_calculation: number;
  total_credit: number;
  total_debit: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Real PostgreSQL model: InvoiceManagement
// amount is ARRAY(FLOAT), status ENUM("Pending","Approved","Decline")
export interface ApiInvoice {
  id: number;
  billTo: string;
  Date: string;
  invoiceId: string;
  base: string[];
  amount: number[];     // array of line-item amounts
  currency?: string;
  comments?: string;
  status: "Pending" | "Approved" | "Decline";
  GST: string;
  Total: string;        // stored as STRING
  totalPrize: string;
  companyName: string;
  clientName: string;
  organizationID?: number;
  services?: string[];
  invoiceType?: string;
  /** Issuing organization's branding, attached by the getById endpoint. */
  organization?: {
    id?: number;
    companyName?: string;
    companyLogo?: string | null;
    companyAddress?: string;
    phoneNumber?: string;
    email?: string;
    companyWebsite?: string;
    accountNumber?: string;
    bankName?: string;
    IFSC_Code?: string;
    GSTIN?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const revenueService = {
  getAll: () => api.get<ApiRevenue[]>("/api/revenues"),
  getByOrg: (orgId: number, year?: number) =>
    api.get<ApiRevenue[]>(`/api/revenuesbyorganization/${orgId}`, { params: { year } }),
};

export const invoiceService = {
  getAll: () => api.get<ApiInvoice[]>("/api/invoices"),
  getByOrg: (orgId: number) => api.get<ApiInvoice[]>(`/api/invoiceByOrgId/${orgId}`),
  getByOrgForFinance: (orgId: number, year?: number) =>
    api.get<{invoices: ApiInvoice[], totalInvoice: number}>(`/api/invoiceByorgIdForFinance/${orgId}`, { params: { year } }),
  getTableData: (orgId: number, params: { page?: number; pageSize?: number; month?: string; year?: number }) =>
    api.get<{invoices: ApiInvoice[], totalInvoice: number}>(`/api/invoiceByorgId/${orgId}`, { params }),
  getById: (id: number) => api.get<ApiInvoice>(`/api/invoices/${id}`),
  create: (data: Partial<ApiInvoice>) => api.post<ApiInvoice>("/api/invoices", data),
  update: (id: number, data: Partial<ApiInvoice>) => api.put<ApiInvoice>(`/api/invoices/${id}`, data),
  delete: (id: number) => api.delete(`/api/invoices/${id}`),
  // Generate an invoice draft from a free-form prompt using AI.
  generateAi: (prompt: string) =>
    api.post<InvoiceAiDraft>("/api/invoices/ai/generate", { prompt }),
};

export type InvoiceCurrency = "INR" | "USD" | "AUD" | "CAD";

/** A single billed line of the invoice (Module / Base / Amount columns). */
export interface InvoiceAiLineItem {
  module?: string;
  base?: string;
  amount?: number;
}

/** Shape returned by the AI invoice generator (all fields best-effort). */
export interface InvoiceAiDraft {
  clientName?: string;
  billTo?: string;
  items?: InvoiceAiLineItem[];
  totalPrize?: number;
  gst?: string;
  currency?: InvoiceCurrency;
  invoiceType?: string;
  comments?: string;
}
