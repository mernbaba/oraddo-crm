import api from '../api';

// Mirrors the server's Tasks model (api/models/taskCreation.js).
export interface Task {
  id: number;
  task_name?: string;
  task_description?: string;
  duration?: string;
  segment?: string;
  status?: string; // "Pending" | "In Progress" | "Completed" | "Overdue" | "Achieved"
  recurrence_types?: string; // "onetime" | "daily" | "weekly" | "monthly"
  recurrence_task_date?: string | null;
  reward_points?: number;
  empOnboardingId?: number;
  ProjectId?: number;
  organizationID?: number;
  taskOfEmploye?: { emp_name?: string };
  ProjectCreation?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const taskService = {
  // All tasks for one employee, across every status.
  getMyTasks: (employeeId: number) => {
    return api.get(`/api/all-tasks-for-employee/${employeeId}`);
  },

  // Create a task
  createTask: (data: Partial<Task>) => {
    return api.post(`/api/tasks`, data);
  },

  // Update a task (e.g. status changes)
  updateTask: (id: number, data: Partial<Task>) => {
    return api.put(`/api/tasks/${id}`, data);
  },

  // Delete a task
  deleteTask: (id: number) => {
    return api.delete(`/api/tasks/${id}`);
  },
};
