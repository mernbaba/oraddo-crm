import api from '../api';

// Mirrors the server's Sprints model (api/models/projectSprints.js).
export interface Sprint {
  id: number;
  title: string;
  description?: string;
  duration_from?: string;
  duration_to?: string;
  status?: string; // "Pending" | "On Going" | "Next Sprint"
  kanban_status?: string; // "active" | "planned" | "completed"
  capacity?: number;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const sprintService = {
  // All sprints, optionally scoped to an organization.
  getSprints: (organizationId?: number) => {
    return api.get(`/api/sprints`, {
      params: organizationId ? { organizationID: organizationId } : {},
    });
  },

  // Create a sprint
  createSprint: (data: Partial<Sprint>) => {
    return api.post(`/api/sprints`, data);
  },

  // Update a sprint
  updateSprint: (id: number, data: Partial<Sprint>) => {
    return api.put(`/api/sprints/${id}`, data);
  },

  // Delete a sprint
  deleteSprint: (id: number) => {
    return api.delete(`/api/sprints/${id}`);
  },
};
