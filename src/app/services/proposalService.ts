import api from "../api";

export interface Proposal {
  id: number;
  companyname: string;
  name: string;
  status: "Pending" | "Approval" | "Declined";
  requirements?: string;
  pricing?: number;
  timeline?: string;
  comments?: string;
  service?: any[];
  timeline_table?: any[];
  resource_table?: any[];
  organizationID?: number;
  togetstarted?: string;
  currency?: "INR" | "USD" | "AUD" | "CAD";
  createdAt?: string;
  updatedAt?: string;
  // AI Generated fields for UI display
  description?: string;
  resources?: string;
  services?: string;
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
  }
};
