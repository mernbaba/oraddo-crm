import api from '../api';

export interface AttendanceStatus {
  id: number;
  emp_name: string;
  status: string;
  punch_in_time: string;
  punch_out_time: string | null;
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

  // Get weekly stats for charts
  getWeeklyStats: (empId: number) => {
    return api.get(`/api/attendance-weekly/${empId}`);
  }
};
