import api from '../api';

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  status: 'active' | 'closed';
  posted_date: string;
  applications_count?: number;
}

export const jobService = {
  // Get all jobs for an organization
  getJobsByOrg: (orgId: number) => {
    return api.get(`/api/jobsByOrganizationId/${orgId}`);
  },

  // Get job by ID
  getJobById: (id: number) => {
    return api.get(`/api/jobs/${id}`);
  }
};
