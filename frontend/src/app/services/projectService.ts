import api from '../api';

export interface Project {
  id: number;
  projectName: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  description?: string;
  deadline?: string;
}

// Payload for creating/updating a ProjectBoard record.
export interface ProjectBoardInput {
  title?: string;
  task_description?: string;
  segment_duration?: string;
  from_date?: string | null;
  to_date?: string | null;
  isComplete?: boolean;
  team_lead?: number;
  organizationID?: number;
  client?: string;
  budget?: string;
  rating?: number;
  deliverables?: number;
  team_size?: number;
}

export const projectService = {
  // Get all project boards for an organization
  getProjectsByOrg: (orgId: number) => {
    return api.get(`/api/projectBoardByOrganization/${orgId}`);
  },

  // Get only in-progress projects for dashboard count
  getInProgressProjects: (orgId: number) => {
    return api.get(`/api/getInprogressProjects/${orgId}`);
  },

  // Get project title by id
  getProjectTitle: (id: number) => {
    return api.get(`/api/getProjectTitle/${id}`);
  },

  // Get completed projects (returns { projectBoard, totalCount })
  getCompletedProjects: (orgId: number, params?: { page?: number; pageSize?: number; search?: string }) => {
    return api.get(`/api/getCompletedProjects/${orgId}`, { params });
  },

  // Create a project board
  createProject: (data: ProjectBoardInput) => {
    return api.post(`/api/projectBoard`, data);
  },

  // Update a project board
  updateProject: (id: number, data: ProjectBoardInput) => {
    return api.put(`/api/projectBoard/${id}`, data);
  },

  // Delete a project board
  deleteProject: (id: number) => {
    return api.delete(`/api/projectBoard/${id}`);
  },
};
