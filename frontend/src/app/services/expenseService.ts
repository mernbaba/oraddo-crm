import api from '../api';

// Mirrors the server's employee_expenses model (api/models/employeeExpenses.js).
export interface EmployeeExpense {
  id: number;
  notes?: string;
  amount: number;
  expenseTitle?: string;
  date?: string;
  receipt?: string;
  status?: "Pending" | "Approved" | "Declined";
  organizationID?: number;
  employeeid?: number;
  employee?: { id?: number; emp_name?: string };
  expensesdocuments?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const expenseService = {
  // Org-scoped, paginated. Returns { employeeExpenses, totalCount }.
  getByOrg: (
    organizationId: number,
    params?: { page?: number; pageSize?: number; search?: string }
  ) => {
    return api.get(`/api/employeeExpensesOrganizationId/${organizationId}`, { params });
  },

  // All expenses for a single employee. Returns { employeeExpense, totalCount }.
  getByEmployee: (
    employeeId: number,
    params?: { page?: number; pageSize?: number; search?: string }
  ) => {
    return api.get(`/api/employee-expenses/${employeeId}`, { params });
  },

  create: (data: Partial<EmployeeExpense>) => {
    return api.post(`/api/employee-expenses`, data);
  },

  // Update (e.g. status: "Approved" | "Declined").
  update: (id: number, data: Partial<EmployeeExpense>) => {
    return api.put(`/api/employee-expenses/${id}`, data);
  },

  remove: (id: number) => {
    return api.delete(`/api/employee-expenses/${id}`);
  },
};
