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
  create: (data: Partial<ApiInvoice>) => api.post<ApiInvoice>("/api/invoices", data),
  update: (id: number, data: Partial<ApiInvoice>) => api.put<ApiInvoice>(`/api/invoices/${id}`, data),
  delete: (id: number) => api.delete(`/api/invoices/${id}`),
};
