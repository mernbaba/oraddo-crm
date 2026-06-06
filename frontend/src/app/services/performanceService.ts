import api from "../api";

// One performance-review record for an employee (team_perfomance row in the backend).
// The rating fields are stored as strings; they may hold a numeric score ("85") or a
// label ("Good"), so consumers should parse defensively.
export interface PerformanceRecord {
  id: number;
  department?: string;
  position?: string;
  date?: string;
  availability?: string;
  behaviour?: string;
  work_perfomance?: string;
  team_performance1?: string;
  team_performance2?: string;
  comments?: string;
  organizationId?: number;
  empOnboardingId?: number;
  teamPerformance?: any; // included employee (Emp_onboarding)
  createdAt?: string;
  updatedAt?: string;
}

export const performanceService = {
  // All performance-review records for the logged-in employee, newest first.
  getByEmployee: (empId: number) => {
    return api.get<PerformanceRecord[]>(`/api/performancesByEmployee/${empId}`);
  },
};
