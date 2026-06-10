import api from '../api';

// Mirrors the server's Emp_onboarding model (api/models/Emp_onboarding.js).
// Only commonly-used fields are typed; rows carry many more columns.
export interface Employee {
  id: number;
  emp_name: string;
  personal_email: string;
  bussiness_email?: string;
  userName?: string;
  role: string;
  gender: string;
  date_of_birth: string;
  date_of_joining?: string;
  position: string;
  department?: string;
  contact_number?: string;
  alternative_number?: string;
  employee_type?: "Internship" | "Permanent";
  salary?: number;
  stipend?: number;
  leave_balance?: number;
  leave_bucket?: number;
  wfh_bucket?: number;
  isDelete?: boolean;
  isTeamLead?: boolean;
  image_URL?: string;
  city?: string;
  current_address?: string;
  permanent_address?: string;
  bank_name?: string;
  bank_account?: string;
  IFSC_code?: string;
  UAN_Number?: string;
  pancard?: string;
  adharnumber?: string;
  education_qualification?: string;
  Religion?: string;
  father_or_husband_name?: string;
  father_or_husband_number?: string;
  mother_name?: string;
  mother_number?: string;
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
  },

  // Create an employee. Must be multipart/form-data — the controller parses
  // the request with formidable (parseRequestFiles), so JSON bodies arrive
  // empty (the global bodyParser drains the stream first). Include
  // `orgnaizationId` (sic) and an optional `image_URL` file.
  create: (data: FormData) => {
    return api.post(`/api/employees`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update an employee. Same formidable caveat as create — send FormData.
  // Omit `password` unless changing it; empty strings get written verbatim.
  update: (id: number, data: FormData) => {
    return api.put(`/api/employees/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Soft delete / restore. JSON body (plain bodyParser route). Restore is
  // subject to the org's plan employee limit.
  changeStatus: (id: number, isDelete: boolean, orgnaizationId: number) => {
    return api.put(`/api/changeStatus/${id}`, { isDelete, orgnaizationId });
  },

  // Bulk import from a CSV/XLSX file (multer route). Column headers must
  // match Emp_onboarding field names (emp_name, personal_email, password...).
  bulkUpload: (file: File, orgnaizationId: number) => {
    const form = new FormData();
    form.append("file", file);
    form.append("orgnaizationId", String(orgnaizationId));
    return api.post(`/api/bulk-upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Server-generated Excel workbook of all employees in the organization.
  exportByOrg: (orgId: number) => {
    return api.get<Blob>(`/api/export-employees/${orgId}`, { responseType: "blob" });
  },
};
