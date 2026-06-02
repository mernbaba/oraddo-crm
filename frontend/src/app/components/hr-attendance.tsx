import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserCheck, Clock, XCircle, Sparkles, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { attendanceService, AttendanceStatus } from "../services/attendanceService";
import { employeeService } from "../services/employeeService";

// Format a date string into a human-readable HH:MM AM/PM time. Returns "-" for null/invalid.
const formatClock = (val: any): string => {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

// Compute hours between punch-in and punch-out (rounded to 2 dp). Returns 0 if either is missing.
const computeHours = (inVal: any, outVal: any): number => {
  if (!inVal || !outVal) return 0;
  const start = new Date(inVal).getTime();
  const end = new Date(outVal).getTime();
  if (isNaN(start) || isNaN(end)) return 0;
  return Math.max(0, Math.round(((end - start) / 3_600_000) * 100) / 100);
};

// Classify a single attendance record as "present" / "absent" / "late"
const classifyStatus = (rec: AttendanceStatus): "present" | "absent" | "late" => {
  if (!rec.punch_in_time) return "absent";
  // Treat anything punched in after 09:30 as late
  const d = new Date(rec.punch_in_time);
  if (isNaN(d.getTime())) return "present";
  return d.getHours() > 9 || (d.getHours() === 9 && d.getMinutes() > 30) ? "late" : "present";
};

export function HRAttendance() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [todayRecords, setTodayRecords] = useState<AttendanceStatus[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pull orgId from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        const id = parsed?.organizationId;
        if (id) setOrgId(typeof id === "string" ? parseInt(id, 10) : id);
      }
    } catch (err) {
      console.error("Failed to read orgId from sessionStorage", err);
    }
  }, []);

  // Fetch today's attendance + total employees once orgId is known
  useEffect(() => {
    if (orgId == null) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    Promise.allSettled([
      attendanceService.getTodaysTeamStatus(orgId),
      employeeService.getEmployeesByOrg(orgId),
    ])
      .then(([attRes, empRes]) => {
        if (!isMounted) return;
        if (attRes.status === "fulfilled") {
          setTodayRecords(Array.isArray(attRes.value.data) ? attRes.value.data : []);
        } else {
          console.warn("Today's attendance fetch failed", attRes.reason);
        }
        if (empRes.status === "fulfilled") {
          setTotalEmployees(Array.isArray(empRes.value.data) ? empRes.value.data.length : 0);
        } else {
          console.warn("Employees fetch failed", empRes.reason);
        }
        if (attRes.status === "rejected" && empRes.status === "rejected") {
          setError("Could not load attendance. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [orgId]);

  // Derive counts from today's records
  const { presentCount, absentCount, lateCount } = useMemo(() => {
    const counts = { presentCount: 0, absentCount: 0, lateCount: 0 };
    todayRecords.forEach((rec) => {
      const s = classifyStatus(rec);
      if (s === "present") counts.presentCount++;
      else if (s === "late") counts.lateCount++;
      else counts.absentCount++;
    });
    return counts;
  }, [todayRecords]);

  // Absent count = total employees minus anyone who punched in today (present + late)
  const derivedAbsent = Math.max(0, totalEmployees - (presentCount + lateCount));
  const attendanceRate =
    totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 1000) / 10 : 0;
  const absentPct =
    totalEmployees > 0 ? Math.round((derivedAbsent / totalEmployees) * 1000) / 10 : 0;
  const latePct =
    totalEmployees > 0 ? Math.round((lateCount / totalEmployees) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Attendance</h2>
          <p className="text-[#5A4079]">
            Track and manage employee attendance records
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Present Today</CardTitle>
            <UserCheck className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{presentCount}</div>
            <p className="text-xs text-[#422462]">
              {isLoading ? "Loading…" : `${attendanceRate}% attendance rate`}
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Absent</CardTitle>
            <XCircle className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{derivedAbsent}</div>
            <p className="text-xs text-[#422462]">
              {isLoading ? "Loading…" : `${absentPct}% of workforce`}
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Late Arrivals</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{lateCount}</div>
            <p className="text-xs text-[#422462]">
              {isLoading ? "Loading…" : `${latePct}% late today`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Today's Attendance</CardTitle>
          <CardDescription className="text-[#5A4079]">Real-time employee attendance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-[#5A4079]">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Loading attendance…
            </div>
          )}
          {error && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!isLoading && !error && todayRecords.length === 0 && (
            <div className="text-center py-8 text-sm text-[#5A4079]">
              No attendance records for today yet.
            </div>
          )}
          {!isLoading && !error && todayRecords.length > 0 && (
            <div className="space-y-3">
              {todayRecords.map((record) => {
                const status = classifyStatus(record);
                const hours = computeHours(record.punch_in_time, record.punch_out_time);
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-semibold">
                        {(record.emp_name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#200B43]">{record.emp_name || "Unknown"}</p>
                        <p className="text-sm text-[#5A4079]">Employee #{record.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-[#5A4079]">
                          Check In: <span className="font-medium text-[#200B43]">{formatClock(record.punch_in_time)}</span>
                        </p>
                        <p className="text-sm text-[#5A4079]">
                          Check Out: <span className="font-medium text-[#200B43]">{formatClock(record.punch_out_time)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#5A4079]">Hours</p>
                        <p className="font-bold text-[#200B43]">{hours.toFixed(2)}</p>
                      </div>
                      <Badge
                        variant={status === "present" ? "default" : status === "late" ? "secondary" : "destructive"}
                        className={status === "present" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                      >
                        {status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Attendance Trends</CardTitle>
          <CardDescription className="text-[#5A4079]">
            Monthly attendance statistics — historical data not yet exposed by the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-sm text-[#5A4079]">
            Trends chart requires a monthly aggregation endpoint, which is not yet available from
            the backend. Use the Today's Attendance table above for live data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
