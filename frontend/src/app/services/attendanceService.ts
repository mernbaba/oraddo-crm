import api from '../api';

export interface AttendanceStatus {
  id: number;
  emp_name: string;
  status: string;
  punch_in_time: string;
  punch_out_time: string | null;
}

// One Attendance row (api/models/attendence.js). `empAttendence` (sic) is the
// employee id; the included employee lives at `EmployeeDetails`.
export interface AttendanceRecord {
  id: number;
  punch_in: string | null;
  punch_out: string | null;
  duration?: string | null;
  status?: "Full Day" | "Half Day" | "Absent" | "Present" | "Pending" | null;
  isLate?: boolean;
  location?: string | null;
  organizationId?: number;
  empAttendence: number;
  EmployeeDetails?: { emp_name: string };
}

export interface OrgAttendanceResponse {
  usersData: AttendanceRecord[];
  totalAttendance: number;
}

// An approved leave row (LeavesCreation) from /leavesbyorganizationid.
export interface OrgLeaveRecord {
  id: number;
  from_date: string;
  to_date: string;
  status?: string;
  leave_type?: string;
  reason?: string;
  lop_days?: string[];
  empOnboardingId: number;
  LeaveCreation?: { id: number; emp_name: string };
}

// The org-scoped attendance/leave endpoints all filter by numeric `year` plus
// a SHORT month NAME ("Jan".."Dec") and require both — a missing month parses
// to NaN/0 server-side and matches nothing.
export interface MonthParams {
  year: number;
  month: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const attendanceService = {
  // Punch In action
  punchIn: (data: { employeeId: number; organizationId: number }) => {
    return api.post('/api/punch-in', data);
  },

  // Punch Out action
  punchOut: (data: { employeeId: number; organizationId: number }) => {
    return api.post('/api/punch-out', data);
  },

  // Get today's team status for the dashboard
  getTodaysTeamStatus: (orgId: number) => {
    return api.get(`/api/getTodaysAttendencesbyOrganization/${orgId}`);
  },

  // Get full attendance history for an organization
  getOrganizationAttendance: (orgId: number) => {
    return api.get(`/api/attendencebyorganizaton/${orgId}`);
  },

  // One month of on-time punches (the endpoint hard-filters isLate=false).
  getMonthlyByOrg: (orgId: number, params: MonthParams) => {
    return api.get<OrgAttendanceResponse>(`/api/attendencebyorganizaton/${orgId}`, {
      params: { page: 0, pageSize: 5000, ...params },
    });
  },

  // One month of LATE punches (isLate=true) — the complement of the above;
  // fetch both to reconstruct the full calendar.
  getLateMonthlyByOrg: (orgId: number, params: MonthParams) => {
    return api.get<OrgAttendanceResponse>(`/api/latepunchinbyorganization/${orgId}`, {
      params: { page: 0, pageSize: 5000, ...params },
    });
  },

  // Approved leaves for the month (filters on from_date's month, excludes WFH).
  getApprovedLeavesByOrg: (orgId: number, params: MonthParams) => {
    return api.get<{ leaves: OrgLeaveRecord[]; totalLeaves: number }>(
      `/api/leavesbyorganizationid/${orgId}`,
      { params: { page: 0, pageSize: 1000, ...params } }
    );
  },

  // Server-generated Excel summary (present/half/leave counts per employee).
  exportByOrg: (orgId: number, params: { year: number; month: string }) => {
    return api.get<Blob>(`/api/exportAttendence/${orgId}`, {
      params,
      responseType: "blob",
    });
  },

  // Get weekly stats for charts
  getWeeklyStats: (empId: number) => {
    return api.get(`/api/attendance-weekly/${empId}`);
  }
};
