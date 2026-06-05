import api from '../api';

// Mirrors the server's Emp_Resignation_Process model (api/models/empResignationProcess.js).
export interface EmployeeResignation {
  id: number;
  emp_onboarding_id?: number;
  resignation_date?: string;
  last_working_date?: string;
  resignation_letter?: string;
  alternative_mobile_number?: string;
  personal_email_address?: string;
  resignation_reason?: string;
  resignation_type?: string;
  notice_period?: string;
  employee_comments?: string;
  exit_interview_preference?: string;
  other_documents?: string[];
  hr_comments?: string;
  hr_status?: "Approved" | "Declined" | "Pending";
  team_lead_comments?: string;
  team_lead_status?: "Approved" | "Declined" | "Pending";
  manager_status?: "Approved" | "Declined" | "Pending";
  manager_comments?: string;
  organizationID?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Fields the employee submits. Sent as multipart/form-data because the server
// controller parses the request with formidable (see employeeResignationController).
export interface ResignationSubmission {
  emp_onboarding_id: number;
  personal_email_address: string;
  resignation_reason: string;
  resignation_type?: string;
  notice_period?: string;
  last_working_date?: string;
  resignation_date?: string;
  employee_comments?: string;
  exit_interview_preference?: string;
  organizationID?: number;
  hr_status?: string;
  team_lead_status?: string;
  manager_status?: string;
  resignation_letter?: File | null;
}

export const resignationService = {
  // The employee's resignation lives on their Emp_onboarding record under
  // `emp_Resignation`. :id here is the employee (onboarding) id.
  getByEmployee: (employeeId: number) => {
    return api.get(`/api/employeeResignation/${employeeId}`);
  },

  getByOrg: (organizationId: number) => {
    return api.get(`/api/employeeResignationbyorganization/${organizationId}`);
  },

  // Submit a new resignation. Always multipart/form-data (the controller uses
  // formidable for both the with-file and without-file cases).
  create: (data: ResignationSubmission) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "resignation_letter") return; // appended below
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });
    if (data.resignation_letter) {
      form.append("resignation_letter", data.resignation_letter);
    }
    return api.post(`/api/employeeResignation`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update a resignation (e.g. approvals). :id here is the resignation id.
  update: (id: number, data: Partial<EmployeeResignation>) => {
    return api.put(`/api/employeeResignation/${id}`, data);
  },

  // Withdraw / delete a resignation. :id here is the resignation id.
  remove: (id: number) => {
    return api.delete(`/api/employeeResignation/${id}`);
  },
};
