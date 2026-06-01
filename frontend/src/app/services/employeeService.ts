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

  // Get onboarded employees organization wise
  getOnboardEmployees: (orgId: number) => {
    return api.get(`/api/organization-Employee/${orgId}`);
  }
};
