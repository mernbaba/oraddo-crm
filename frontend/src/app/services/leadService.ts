import api from '../api';

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
  source?: string;
}

export const leadService = {
  // Get all leads for an organization
  getLeadsByOrg: (orgId: number) => {
    return api.get(`/api/leadCreationByOrganization/${orgId}`);
  },

  // Get inbound leads
  getInboundLeads: (orgId: number) => {
    return api.get(`/api/InboundLeadcreationbyorganization/${orgId}`);
  },

  // Get single lead details
  getLeadById: (id: number) => {
    return api.get(`/api/leadCreations/${id}`);
  },

  // Update lead status
  updateLeadStatus: (id: number, status: string) => {
    return api.put(`/api/leadCreations/${id}`, { status });
  }
};
