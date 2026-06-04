import api from '../api';

// Mirrors the server's LeadCreation model (api/models/leadCreation.js).
// All fields are optional because the table is sparsely populated.
export interface Lead {
  id: number;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  contact_number?: string;
  company_website?: string;
  industry?: string;
  location?: string;
  City?: string;
  state?: string;
  country?: string;
  no_ofEmployees?: string;
  employee_count?: string;
  revenue?: string;
  level?: string;
  Comments?: string;
  createdBy?: string;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Shape returned by GET /api/leadCreationByOrganization/:id
export interface LeadListResponse {
  data: Lead[];
  totalRows: number;
  totalLeads: number;
  currentPage: number;
  totalPages: number;
}

export const leadService = {
  // Get leads for an organization (paginated; pass a large limit to get all).
  getLeadsByOrg: (
    orgId: number,
    params?: { page?: number; limit?: number; search?: string }
  ) => {
    return api.get(`/api/leadCreationByOrganization/${orgId}`, { params });
  },

  // Get inbound leads
  getInboundLeads: (orgId: number) => {
    return api.get(`/api/InboundLeadcreationbyorganization/${orgId}`);
  },

  // Get single lead details
  getLeadById: (id: number) => {
    return api.get(`/api/leadCreations/${id}`);
  },

  // Create a new lead
  createLead: (data: Partial<Lead>) => {
    return api.post(`/api/leadCreations`, data);
  },

  // Update an existing lead
  updateLead: (id: number, data: Partial<Lead>) => {
    return api.put(`/api/leadCreations/${id}`, data);
  },

  // Delete a lead
  deleteLead: (id: number) => {
    return api.delete(`/api/leadCreations/${id}`);
  },
};
