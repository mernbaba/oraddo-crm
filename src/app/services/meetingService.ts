import api from '../api';

export interface Meeting {
  id: number;
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  hangoutLink?: string;
  status: string;
}

export const meetingService = {
  // Get all meetings for an organization
  getMeetingsByOrg: (orgId: number) => {
    return api.get(`/api/meetingsbyorganizationId/${orgId}`);
  },

  // Get single meeting details
  getMeetingById: (id: number) => {
    return api.get(`/api/meetings/${id}`);
  }
};
