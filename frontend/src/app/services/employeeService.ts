import api from '../api';

export interface Employee {
  id: number;
  emp_name: string;
  personal_email: string;
  bussiness_email?: string;
  role: string;
  gender: string;
  date_of_birth: string;
  position: string;
}

export const employeeService = {
  // Get all employees for an organization (for birthdays/gender charts)
  getEmployeesByOrg: (orgId: number) => {
    return api.get(`/api/employeesbyorganization/${orgId}`);
  },

  // Get specific employee profile
  getEmployeeById: (id: number) => {
    return api.get(`/api/employees/${id}`);
  },

  // Update the logged-in employee's own profile (PUT /api/employees/profile/:id)
  updateProfile: (id: number, data: Partial<Employee>) => {
    return api.put(`/api/employees/profile/${id}`, data);
  },

  // Get all employees for an organization (the non-paginated variant —
  // returns the full list, not just the first page). Used by the chat
  // picker so every coworker in the org is reachable.
  getOnboardEmployees: (orgId: number) => {
    return api.get(`/api/employeesbyorganization/${orgId}`);
  }
};
