import { useState, useEffect } from "react";
import { Calendar, Clock, Check, X, AlertCircle, Briefcase, FileText, Eye, Search, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { leaveService, LeaveRequest } from "../services/leaveService";

const fmtDate = (value?: string | null) => (value ? String(value).slice(0, 10) : "—");

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

// The DB enum says "Declined"; the UI vocabulary is "Rejected".
const displayStatus = (status: LeaveRequest["status"]) =>
  status === "Declined" ? "Rejected" : status;

export function HROrgLeaveManagement() {
  const [viewDetailsModal, setViewDetailsModal] = useState<number | null>(null);
  const [viewBucketModal, setViewBucketModal] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [orgId, setOrgId] = useState<number | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // ── Read org context from the logged-in session ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setError("No organization is linked to your account. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const u = JSON.parse(raw);
      const org = u?.organizationId != null ? Number(u.organizationId) : null;
      setOrgId(org);
      if (org == null) {
        setError("No organization is linked to your account. Please log in again.");
        setLoading(false);
      }
    } catch {
      setError("Could not read your session. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orgId == null) return;
    loadLeaves(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const loadLeaves = async (org: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveService.getForManagement(org);
      setLeaveRequests(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load leave requests", e);
      setError("Failed to load leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (request: LeaveRequest, status: "Approved" | "Declined") => {
    if (orgId == null) return;
    const name = request.LeaveCreation?.emp_name || `employee #${request.empOnboardingId}`;
    const verb = status === "Approved" ? "Approve" : "Reject";
    if (!confirm(`${verb} ${request.number_of_days}-day ${request.leave_type} for ${name}?`)) return;
    setProcessingId(request.id);
    try {
      await leaveService.updateStatus(request.id, {
        status,
        empOnboardingId: request.empOnboardingId,
        number_of_days: request.number_of_days,
        leave_type: request.leave_type,
      });
      setViewDetailsModal(null);
      await loadLeaves(orgId);
    } catch (e: any) {
      console.error("Failed to update leave request", e);
      alert(e?.response?.data?.error || "Failed to update the leave request.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const q = searchQuery.toLowerCase();
    const name = request.LeaveCreation?.emp_name || "";
    const code = `emp-${String(request.empOnboardingId).padStart(3, "0")}`;
    const matchesSearch =
      name.toLowerCase().includes(q) ||
      code.includes(q) ||
      (request.leave_type || "").toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "all" || displayStatus(request.status).toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Leave Management</h2>
            <p className="text-[#5A4079]">Review and manage employee leave requests</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
          {orgId != null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadLeaves(orgId)}
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Total Requests</p>
              <p className="text-2xl font-bold text-[#200B43]">{leaveRequests.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-[#422462]/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Pending</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {leaveRequests.filter(r => r.status === "Pending").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Approved</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {leaveRequests.filter(r => r.status === "Approved").length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600/30" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5A4079]">Rejected</p>
              <p className="text-2xl font-bold text-[#200B43]">
                {leaveRequests.filter(r => r.status === "Declined").length}
              </p>
            </div>
            <X className="h-8 w-8 text-red-600/30" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
          <Input
            placeholder="Search by employee name, ID, or leave type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#200B43] mb-4">Leave Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-[#937CB4]/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[15%]">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[12%]">Leave Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[11%]">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[11%]">End Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[8%]">Days</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[11%]">Applied On</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[10%]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#200B43] w-[22%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#422462] mx-auto" />
                      <p className="text-xs text-[#5A4079] mt-2">Loading leave requests...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <Calendar className="h-8 w-8 text-[#937CB4]/50 mx-auto" />
                      <p className="text-sm text-[#5A4079] mt-2">
                        {leaveRequests.length === 0
                          ? "No leave requests have been submitted yet."
                          : "No requests match the current filters."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors">
                      <td className="py-3 px-4 align-middle">
                        <div>
                          <p className="text-sm font-medium text-[#200B43] truncate">
                            {request.LeaveCreation?.emp_name || `Employee #${request.empOnboardingId}`}
                          </p>
                          <p className="text-xs text-[#5A4079]">{`EMP-${String(request.empOnboardingId).padStart(3, "0")}`}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5A4079] align-middle">
                        <span className="line-clamp-2">{request.leave_type}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{fmtDate(request.from_date)}</td>
                      <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{fmtDate(request.to_date)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-[#200B43] align-middle">{request.number_of_days}</td>
                      <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{fmtDate(request.createdAt)}</td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {displayStatus(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewDetailsModal(request.id)}
                            className="text-[#422462] hover:bg-[#F0E9FF] h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewBucketModal(request.id)}
                            className="text-[#422462] hover:bg-[#F0E9FF] h-8 w-8 p-0"
                            title="View Leave Bucket"
                          >
                            <Briefcase className="h-4 w-4" />
                          </Button>
                          {request.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={processingId === request.id}
                                onClick={() => handleDecision(request, "Approved")}
                                className="text-green-600 hover:bg-green-50 hover:text-green-600 h-8 w-8 p-0"
                                title="Approve Leave"
                              >
                                {processingId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={processingId === request.id}
                                onClick={() => handleDecision(request, "Declined")}
                                className="text-red-600 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
                                title="Reject Leave"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewDetailsModal !== null && (() => {
        const request = leaveRequests.find(r => r.id === viewDetailsModal);
        if (!request) return null;
        const name = request.LeaveCreation?.emp_name || `Employee #${request.empOnboardingId}`;

        return (
          <Modal
            isOpen={true}
            onClose={() => setViewDetailsModal(null)}
            title="Leave Request Details"
            size="lg"
          >
            <div className="space-y-6">

              <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {initialsOf(name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#200B43]">{name}</h3>
                  <p className="text-sm text-[#5A4079]">
                    {`EMP-${String(request.empOnboardingId).padStart(3, "0")}`}
                    {request.LeaveCreation?.department ? ` • ${request.LeaveCreation.department}` : ""}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  request.status === "Approved"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : request.status === "Declined"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                }`}>
                  {displayStatus(request.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Leave Type</p>
                      <p className="text-lg font-bold text-[#200B43]">{request.leave_type}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-[#422462]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Total Days</p>
                      <p className="text-lg font-bold text-[#200B43]">{request.number_of_days} days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF] p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Start Date</p>
                      <p className="text-sm font-bold text-[#200B43]">{fmtDate(request.from_date)}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-white to-[#F0E9FF] p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#5A4079] to-[#937CB4] flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">End Date</p>
                      <p className="text-sm font-bold text-[#200B43]">{fmtDate(request.to_date)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Applied On</p>
                      <p className="text-sm font-bold text-[#200B43]">{fmtDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Current Leave Balance</p>
                      <p className="text-sm font-bold text-[#200B43]">
                        {request.LeaveCreation?.leave_balance ?? "—"} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-5 shadow-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-sm">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#200B43] text-lg">Leave Reason</h4>
                    <p className="text-xs text-[#5A4079]">Reason provided by employee</p>
                  </div>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-[#200B43] leading-relaxed bg-[#F0E9FF]/30 p-4 rounded-lg whitespace-pre-wrap">
                    {request.reason || "No reason provided."}
                  </p>
                </div>
              </div>

              {request.status === "Approved" && (request.lop_days?.length ?? 0) > 0 && (
                <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-5 shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 text-lg">Loss of Pay</h4>
                      <p className="text-xs text-red-600">Days beyond the available leave balance</p>
                    </div>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm text-red-800 leading-relaxed bg-white/50 p-4 rounded-lg">
                      {request.lop_days!.length} unpaid day{request.lop_days!.length > 1 ? "s" : ""}:{" "}
                      {request.lop_days!.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {request.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
                  <Button
                    disabled={processingId === request.id}
                    onClick={() => handleDecision(request, "Approved")}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
                  >
                    {processingId === request.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve Leave Request
                  </Button>
                  <Button
                    variant="outline"
                    disabled={processingId === request.id}
                    onClick={() => handleDecision(request, "Declined")}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Leave Request
                  </Button>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setViewDetailsModal(null)}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {viewBucketModal !== null && (() => {
        const request = leaveRequests.find(r => r.id === viewBucketModal);
        if (!request) return null;
        const emp = request.LeaveCreation;
        const name = emp?.emp_name || `Employee #${request.empOnboardingId}`;

        // The backend tracks one combined leave bucket plus a WFH bucket per
        // employee (not per leave type): *_bucket = allocation, balance = left.
        const leaveTotal = emp?.leave_bucket ?? 0;
        const leaveRemaining = emp?.leave_balance ?? 0;
        const wfhTotal = emp?.wfh_bucket ?? 0;
        const wfhRemaining = emp?.wfh_no_ofdays ?? 0;
        const bucketData = [
          {
            name: "Leave Bucket",
            total: leaveTotal,
            remaining: leaveRemaining,
            used: Math.max(0, leaveTotal - leaveRemaining),
            color: "from-green-500 to-green-600",
          },
          {
            name: "Work From Home",
            total: wfhTotal,
            remaining: wfhRemaining,
            used: Math.max(0, wfhTotal - wfhRemaining),
            color: "from-blue-500 to-blue-600",
          },
        ];

        return (
          <Modal
            isOpen={true}
            onClose={() => setViewBucketModal(null)}
            title="Leave Bucket Details"
            size="lg"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {initialsOf(name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#200B43]">{name}</h3>
                  <p className="text-sm text-[#5A4079]">
                    {`EMP-${String(request.empOnboardingId).padStart(3, "0")}`}
                    {emp?.department ? ` • ${emp.department}` : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {bucketData.map((bucket, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-5 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${bucket.color} flex items-center justify-center shadow-sm`}>
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#200B43]">{bucket.name}</h4>
                          <p className="text-xs text-[#5A4079]">Allocation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#200B43]">{bucket.remaining}</p>
                        <p className="text-xs text-[#5A4079]">days remaining</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full bg-gradient-to-r ${bucket.color}`}
                          style={{ width: bucket.total > 0 ? `${Math.min(100, (bucket.used / bucket.total) * 100)}%` : "0%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-[#5A4079]">
                        <span>Used: <strong className="text-[#200B43]">{bucket.used}</strong> days</span>
                        <span>Total: <strong className="text-[#200B43]">{bucket.total}</strong> days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-5 shadow-md">
                <h4 className="font-semibold text-[#200B43] mb-3">This Request</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#200B43]">{request.number_of_days}</p>
                    <p className="text-xs text-[#5A4079]">Days Requested</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{request.lop_days?.length ?? request.LOP ?? 0}</p>
                    <p className="text-xs text-[#5A4079]">LOP Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{leaveRemaining}</p>
                    <p className="text-xs text-[#5A4079]">Balance Left</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setViewBucketModal(null)}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
