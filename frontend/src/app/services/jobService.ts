import api from '../api';

export interface Job {
  id: number;
  job_title: string;
  job_description: string;
  department?: string;
  location?: string;
  job_type?: string;
  experience?: string;
  skills?: string;
  package?: string;
  no_of_applications: string;
  published_date: string;
  end_date: string;
  status: 'Active' | 'Close' | 'Pause';
  image_URL?: string;
  organizationID?: number;
}

export const jobService = {
  getJobsByOrg: (orgId: number) => {
    return api.get(`/api/jobsByOrganizationId/${orgId}`);
  },

  getJobById: (id: number) => {
    return api.get(`/api/jobs/${id}`);
  },

  createJob: (data: FormData) => {
    return api.post('/api/jobs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateJob: (id: number, data: Partial<Job>) => {
    return api.put(`/api/jobs/${id}`, data);
  },

  deleteJob: (id: number) => {
    return api.delete(`/api/jobs/${id}`);
  },
};
