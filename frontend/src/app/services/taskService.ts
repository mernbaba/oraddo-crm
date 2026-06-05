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
  empOnboardingId?: number | null;
  ProjectId?: number | null;
  organizationID?: number;
  taskOfEmploye?: { emp_name?: string };
  ProjectCreation?: any;
  createdAt?: string;
  updatedAt?: string;

  // ── Sprint Kanban Board fields ───────────────────────────────────────────
  kanban_column?: string; // "todo" | "inprogress" | "review" | "done"
  priority?: string; // "High" | "Medium" | "Low"
  assignee_name?: string;
  avatar?: string;
  due_date?: string;
  story_points?: number;
  tags?: string; // comma-separated
  subtasks_completed?: number;
  subtasks_total?: number;
  comments_count?: number;
  SprintId?: number | null;
}

export const taskService = {
  // All tasks for one employee, across every status.
  getMyTasks: (employeeId: number) => {
    return api.get(`/api/all-tasks-for-employee/${employeeId}`);
  },

  // All tasks for an organization (source for the Kanban board).
  getTasksByOrg: (organizationId: number) => {
    return api.get(`/api/tasksOrganizationId/${organizationId}`);
  },

  // Create a task
  createTask: (data: Partial<Task>) => {
    return api.post(`/api/tasks`, data);
  },

  // Update a task (e.g. status changes)
  updateTask: (id: number, data: Partial<Task>) => {
    return api.put(`/api/tasks/${id}`, data);
  },

  // Partial field update WITHOUT the time-tracking side effects of updateTask
  // (taskDidTime/elapsed recomputation). Used by the Kanban board for moves,
  // edits and subtask changes.
  saveTaskFields: (id: number, data: Partial<Task>) => {
    return api.put(`/api/tlupdatetask/${id}`, data);
  },

  // Delete a task
  deleteTask: (id: number) => {
    return api.delete(`/api/tasks/${id}`);
  },
};
