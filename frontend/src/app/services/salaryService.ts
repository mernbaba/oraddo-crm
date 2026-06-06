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

export const salaryService = {
  // All monthly salary slips for the logged-in employee, oldest first.
  getByEmployee: (empId: number) => {
    return api.get<SalaryRecord[]>(`/api/salariesByEmployee/${empId}`);
  },

  // Submit a salary-advance / loan request.
  createAdvance: (data: SalaryAdvancePayload) => {
    return api.post(`/api/salary-advances`, data);
  },
};
