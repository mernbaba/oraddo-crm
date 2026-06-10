import api from "../api";

export type ProposalStatus = "Pending" | "Approval" | "Declined";
export type ProposalCurrency = "INR" | "USD" | "AUD" | "CAD";

/** A single section of the proposal body. `content` is markdown. */
export interface ProposalServiceItem {
  title: string;
  content: string;
}

export interface Proposal {
  id: number;
  companyname: string;
  name: string;
  status: ProposalStatus;
  /** "Your Requirements" paragraph. */
  requirements?: string;
  /** Numeric total — drives stats/billing. */
  pricing?: number;
  /** Pricing display line / GST note (e.g. "+ GST"). */
  pricing_note?: string;
  /** "Timeline and Resources" paragraph. */
  timeline?: string;
  comments?: string;
  /** Proposal body sections: [{ title, content(markdown) }]. */
  service?: ProposalServiceItem[];
  /** Closing "To get started" paragraph. */
  togetstarted?: string;
  currency?: ProposalCurrency;
  organizationID?: number;
  /** Raw prompt used to (dummy) generate this proposal. */
  ai_prompt?: string;
  timeline_table?: any[];
  resource_table?: any[];
  /** Issuing organization's branding, attached by the getById endpoint. */
  organization?: OrganizationBrand | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Subset of the Organization record used for document branding. */
export interface OrganizationBrand {
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
}

export interface ProposalTableResponse {
  praposals: Proposal[];
  billingCount: number;
}

export interface ProposalStatsResponse {
  praposals: Proposal[];
  totalProposal: number;
}

export const proposalService = {
  // Get all proposals for an organization (used for stats)
  getByOrg: (orgId: number) => {
    return api.get<ProposalStatsResponse>(`/api/praposalOrganizationId/${orgId}`);
  },

  // Get paginated table data
  getTableData: (orgId: number, params: { page?: number; pageSize?: number; search?: string; year?: number; month?: string }) => {
    return api.get<ProposalTableResponse>(`/api/proposalsformanagementtableData/${orgId}`, { params });
  },

  // Get single proposal
  getById: (id: number) => {
    return api.get<Proposal>(`/api/praposals/${id}`);
  },

  // Create new proposal
  create: (data: Partial<Proposal>) => {
    return api.post<Proposal>("/api/praposals", data);
  },

  // Update proposal
  update: (id: number, data: Partial<Proposal>) => {
    return api.put<Proposal>(`/api/praposals/${id}`, data);
  },

  // Delete proposal
  delete: (id: number) => {
    return api.delete(`/api/praposals/${id}`);
  },

  // Get billing/conversion stats for dashboard
  getConversionStats: (orgId: number, isPrevious6Months: boolean = false) => {
    return api.get(`/api/praposalsformanagement/${orgId}`, { params: { isPrevious6Months } });
  },

  // Get available services for dropdowns
  getAvailableServicesByOrg: (orgId: number) => {
    return api.get(`/api/praposalServiceByOrgId/${orgId}`);
  },

  // Generate a proposal draft from a free-form prompt using AI
  generateAi: (prompt: string) => {
    return api.post<ProposalAiDraft>("/api/praposals/ai/generate", { prompt });
  }
};

/** Shape returned by the AI proposal generator (all fields best-effort). */
export interface ProposalAiDraft {
  companyname?: string;
  name?: string;
  requirements?: string;
  service?: ProposalServiceItem[];
  timeline?: string;
  pricing?: number;
  currency?: ProposalCurrency;
  pricing_note?: string;
  togetstarted?: string;
}
