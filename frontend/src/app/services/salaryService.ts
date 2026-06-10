import api from "../api";

// One monthly salary slip for an employee (Salary_Management row in the backend).
// All money fields are stored as strings in the DB, so they're typed loosely here.
export interface SalaryRecord {
  id: number;
  basic?: number | string;
  gross_pay?: string;
  gross_deduction?: string;
  net_pay?: string;
  amount_in_words?: string;
  working_days?: string;
  loss_of_pay?: string;
  monthly_lop?: number;
  leaves?: number;
  leave_balance?: number;
  profetional_tax?: string;
  income_tax?: string;
  house_rent_allowance?: string;
  HRA_allowances?: string;
  travel_allowances?: string;
  medical_allowances?: string;
  food_allowances?: string;
  special_allowance?: string;
  perfomance_incentives?: string;
  insentives?: string;
  other_deductions?: string;
  pf_amount?: number;
  pf_emp_contribution?: string;
  pf_employeer_contribution?: string;
  emp_ESI_contribution?: string;
  insurance?: string;
  gratuity?: string;
  isApproved?: boolean;
  salary_date?: string;
  organizationId?: number;
  empOnboardingId?: number;
  salary_management?: any; // included employee (Emp_onboarding)
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryAdvancePayload {
  amount_request: number;
  reason: string;
  request_type?: "Salary Advance" | "Loan";
  status?: "Pending" | "Approved" | "Declined";
  date_of_request?: string;
  comments?: string;
  empOnboardingId?: number;
  organizationId?: number;
}

// Response wrapper for the org-scoped list endpoint. employesCount is the
// org's active head-count (independent of the month filter); approveCount is
// the number of approved slips within the filter.
export interface OrgSalariesResponse {
  salaries: SalaryRecord[];
  totalSalaries: number;
  totalNetPay: number | string;
  employesCount: number;
  approveCount: number;
}

export const salaryService = {
  // All monthly salary slips for the logged-in employee, oldest first.
  getByEmployee: (empId: number) => {
    return api.get<SalaryRecord[]>(`/api/salariesByEmployee/${empId}`);
  },

  // Salary slips for one organization, filtered to a single month.
  // NOTE: `month` is ZERO-based (0 = January) — the backend filters on
  // DATE_PART(month) = month + 1. Both year and month must be sent; a missing
  // month becomes NaN server-side and matches nothing.
  getByOrganization: (
    orgId: number,
    params: { year: number; month: number; search?: string; page?: number; pageSize?: number }
  ) => {
    return api.get<OrgSalariesResponse>(`/api/salariesbyorganization/${orgId}`, {
      params: { page: 0, pageSize: 200, ...params },
    });
  },

  // Server-generated Excel workbook of the month's salaries (same 0-based month).
  exportByOrganization: (orgId: number, params: { year: number; month: number }) => {
    return api.get<Blob>(`/api/export-salaries/${orgId}`, {
      params,
      responseType: "blob",
    });
  },

  // Mark one salary slip approved (paid). :id is the salary row id.
  approve: (salaryId: number, isApproved = true) => {
    return api.put(`/api/approveSalary/${salaryId}`, { isApproved });
  },

  // Submit a salary-advance / loan request.
  createAdvance: (data: SalaryAdvancePayload) => {
    return api.post(`/api/salary-advances`, data);
  },
};
