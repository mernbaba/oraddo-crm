import api from "../api";

// Mirrors the server's HrPanel model (api/models/HrPanel.js) — one row per
// organization holding all HR policy configuration.
// NOTE: gracePeriod is an ABSOLUTE time-of-day ("09:15:00"), not a duration —
// the attendance logic marks a punch-in late when it is after this clock time.
export interface HrPanelData {
  id?: number;
  punchInTime?: string | null; // TIME "HH:MM:SS"
  punchOutTime?: string | null;
  gracePeriod?: string | null;
  leaveBuckets?: number | null;
  leaveBucket_Interns?: number | null;
  renewalMonth?: string | null; // full month name, e.g. "January"
  considerLOP?: boolean | null;
  late_punchin?: boolean | null;
  wfhDays?: number | null;
  screenTracking?: boolean | null;
  is_Employee_Editable?: boolean | null;
  team_performance?: boolean | null;
  team_metrics?: unknown;
  leaves_for_month?: number | null;
  follow_punchin_system?: boolean | null;
  organizationID?: number;
}

export const hrPanelService = {
  // :id is the ORGANIZATION id. Returns null (empty body) when the org has
  // no panel row yet — create one with `create` in that case.
  getByOrg: (orgId: number) => {
    return api.get<HrPanelData | null>(`/api/panelData/${orgId}`);
  },

  // Update by organization id. Server-side rule: when late_punchin is true,
  // gracePeriod must be "HH:MM:SS"; when false it is forced to null.
  // Returns 404 when no row exists for the org.
  update: (orgId: number, data: HrPanelData) => {
    return api.put<HrPanelData>(`/api/panelData/${orgId}`, data);
  },

  create: (data: HrPanelData) => {
    return api.post<HrPanelData>(`/api/panelData`, data);
  },
};
