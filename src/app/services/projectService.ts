import api from '../api';

export interface Project {
  id: number;
  projectName: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  description?: string;
  deadline?: string;
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

  // Get completed projects
  getCompletedProjects: (orgId: number) => {
    return api.get(`/api/getCompletedProjects/${orgId}`);
  }
};
