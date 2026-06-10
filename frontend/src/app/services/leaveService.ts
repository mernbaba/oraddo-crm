import api from "../api";

// One leave request (LeavesCreation row). The employee (Emp_onboarding) is
// nested at `LeaveCreation`; status enum is Pending/Approved/Declined —
// the UI displays "Declined" as "Rejected".
export interface LeaveRequest {
  id: number;
  leave_type: string;
  reason: string;
  number_of_days: number;
  from_date: string;
  to_date: string;
  status: "Pending" | "Approved" | "Declined";
  LOP?: number | null;
  monthly_leave_balance?: number | null;
  lop_days?: string[];
  organizationId?: number;
  empOnboardingId: number;
  createdAt?: string;
  updatedAt?: string;
  LeaveCreation?: {
    id: number;
    emp_name?: string;
    department?: string;
    position?: string;
    leave_balance?: number;
    leave_bucket?: number;
    wfh_no_ofdays?: number;
    wfh_bucket?: number;
  };
}

export const leaveService = {
  // All leave requests for an organization, Pending first. `Emp_id` excludes
  // one employee's own requests (meant for employee-admins); 0 excludes
  // nobody — passing undefined would crash the Sequelize Op.ne filter.
  getForManagement: (orgId: number, params?: { page?: number; pageSize?: number; empId?: number }) => {
    return api.get<LeaveRequest[]>(`/api/getLeavesforManagement/${orgId}`, {
      params: {
        page: params?.page ?? 0,
        pageSize: params?.pageSize ?? 500,
        Emp_id: params?.empId ?? 0,
      },
    });
  },

  // Approve / decline a request. Approval deducts leave balance and records
  // LOP days server-side, so empOnboardingId, number_of_days and leave_type
  // must accompany the status.
  updateStatus: (
    leaveId: number,
    data: {
      status: "Approved" | "Declined";
      empOnboardingId: number;
      number_of_days: number;
      leave_type: string;
    }
  ) => {
    return api.put(`/api/leaves/${leaveId}`, data);
  },
};
