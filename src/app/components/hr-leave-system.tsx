import { useState } from "react";
import { Calendar, Clock, Check, X, AlertCircle, User, Briefcase, FileText, Eye, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Input } from "./ui/input";

export function HROrgLeaveManagement() {
  const [viewDetailsModal, setViewDetailsModal] = useState<number | null>(null);
  const [viewBucketModal, setViewBucketModal] = useState<number | null>(null);

  const leaveRequests = [
    {
      id: 1,
      employeeName: "Alice Johnson",
      employeeId: "EMP-001",
      department: "Engineering",
      leaveType: "Sick Leave",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
      totalDays: 3,
      reason: "Suffering from viral fever and doctor advised rest for 3 days.",
      appliedDate: "2024-02-18",
      status: "Pending",
      managerName: "David Chen",
      bucket: {
        sickLeave: { total: 12, used: 5, remaining: 7 },
        casualLeave: { total: 10, used: 3, remaining: 7 },
        earnedLeave: { total: 15, used: 8, remaining: 7 },
        maternityLeave: { total: 180, used: 0, remaining: 180 },
        paternityLeave: { total: 15, used: 0, remaining: 15 },
      }
    },
    {
      id: 2,
      employeeName: "Bob Smith",
      employeeId: "EMP-002",
      department: "Marketing",
      leaveType: "Casual Leave",
      startDate: "2024-02-25",
      endDate: "2024-02-27",
      totalDays: 3,
      reason: "Family function - Sister's wedding ceremony.",
      appliedDate: "2024-02-17",
      status: "Approved",
      managerName: "Sarah Wilson",
      bucket: {
        sickLeave: { total: 12, used: 2, remaining: 10 },
        casualLeave: { total: 10, used: 6, remaining: 4 },
        earnedLeave: { total: 15, used: 10, remaining: 5 },
        maternityLeave: { total: 0, used: 0, remaining: 0 },
        paternityLeave: { total: 15, used: 0, remaining: 15 },
      }
    },
    {
      id: 3,
      employeeName: "Carol Williams",
      employeeId: "EMP-003",
      department: "HR",
      leaveType: "Earned Leave",
      startDate: "2024-03-01",
      endDate: "2024-03-10",
      totalDays: 10,
      reason: "Vacation trip to Europe with family.",
      appliedDate: "2024-02-15",
      status: "Pending",
      managerName: "Michael Brown",
      bucket: {
        sickLeave: { total: 12, used: 4, remaining: 8 },
        casualLeave: { total: 10, used: 5, remaining: 5 },
        earnedLeave: { total: 15, used: 5, remaining: 10 },
        maternityLeave: { total: 180, used: 0, remaining: 180 },
        paternityLeave: { total: 15, used: 0, remaining: 15 },
      }
    },
    {
      id: 4,
      employeeName: "David Lee",
      employeeId: "EMP-004",
      department: "Finance",
      leaveType: "Sick Leave",
      startDate: "2024-02-19",
      endDate: "2024-02-19",
      totalDays: 1,
      reason: "Medical checkup and tests scheduled.",
      appliedDate: "2024-02-18",
      status: "Rejected",
      managerName: "Jennifer Taylor",
      rejectionReason: "Insufficient sick leave balance. Please apply for casual leave instead.",
      bucket: {
        sickLeave: { total: 12, used: 12, remaining: 0 },
        casualLeave: { total: 10, used: 2, remaining: 8 },
        earnedLeave: { total: 15, used: 7, remaining: 8 },
        maternityLeave: { total: 0, used: 0, remaining: 0 },
        paternityLeave: { total: 15, used: 5, remaining: 10 },
      }
    },
    {
      id: 5,
      employeeName: "Emma Wilson",
      employeeId: "EMP-005",
      department: "Engineering",
      leaveType: "Paternity Leave",
      startDate: "2024-03-15",
      endDate: "2024-03-29",
      totalDays: 15,
      reason: "Birth of child - paternity leave.",
      appliedDate: "2024-02-16",
      status: "Approved",
      managerName: "David Chen",
      bucket: {
        sickLeave: { total: 12, used: 3, remaining: 9 },
        casualLeave: { total: 10, used: 4, remaining: 6 },
        earnedLeave: { total: 15, used: 6, remaining: 9 },
        maternityLeave: { total: 0, used: 0, remaining: 0 },
        paternityLeave: { total: 15, used: 0, remaining: 15 },
      }
    },
  ];

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
                {leaveRequests.filter(r => r.status === "Rejected").length}
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
            className="pl-10 border-[#937CB4]/30 focus:border-[#422462]"
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
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
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors">
                    <td className="py-3 px-4 align-middle">
                      <div>
                        <p className="text-sm font-medium text-[#200B43] truncate">{request.employeeName}</p>
                        <p className="text-xs text-[#5A4079]">{request.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle">
                      <span className="line-clamp-2">{request.leaveType}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{request.startDate}</td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{request.endDate}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#200B43] align-middle">{request.totalDays}</td>
                    <td className="py-3 px-4 text-sm text-[#5A4079] align-middle whitespace-nowrap">{request.appliedDate}</td>
                    <td className="py-3 px-4 align-middle">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        request.status === "Approved" 
                          ? "bg-green-100 text-green-800" 
                          : request.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {request.status}
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
                              className="text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                              title="Approve Leave"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                              title="Reject Leave"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 
      {viewDetailsModal !== null && (() => {
        const request = leaveRequests.find(r => r.id === viewDetailsModal);
        if (!request) return null;
        
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
                  {request.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#200B43]">{request.employeeName}</h3>
                  <p className="text-sm text-[#5A4079]">{request.employeeId} • {request.department}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  request.status === "Approved" 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                    : request.status === "Rejected"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                }`}>
                  {request.status}
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
                      <p className="text-lg font-bold text-[#200B43]">{request.leaveType}</p>
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
                      <p className="text-lg font-bold text-[#200B43]">{request.totalDays} days</p>
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
                      <p className="text-sm font-bold text-[#200B43]">{request.startDate}</p>
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
                      <p className="text-sm font-bold text-[#200B43]">{request.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Reporting Manager</p>
                      <p className="text-sm font-bold text-[#200B43]">{request.managerName}</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#422462]" />
                    <div>
                      <p className="text-xs text-[#5A4079] font-medium">Applied On</p>
                      <p className="text-sm font-bold text-[#200B43]">{request.appliedDate}</p>
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
                  <p className="text-sm text-[#200B43] leading-relaxed bg-[#F0E9FF]/30 p-4 rounded-lg">
                    {request.reason}
                  </p>
                </div>
              </div>
 
              {request.status === "Rejected" && request.rejectionReason && (
                <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-5 shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 text-lg">Rejection Reason</h4>
                      <p className="text-xs text-red-600">Reason provided by manager</p>
                    </div>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm text-red-800 leading-relaxed bg-white/50 p-4 rounded-lg">
                      {request.rejectionReason}
                    </p>
                  </div>
                </div>
              )}
 
              {request.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Leave Request
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
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
        
        const bucketData = [
          { name: "Sick Leave", ...request.bucket.sickLeave, color: "from-red-500 to-red-600" },
          { name: "Casual Leave", ...request.bucket.casualLeave, color: "from-blue-500 to-blue-600" },
          { name: "Earned Leave", ...request.bucket.earnedLeave, color: "from-green-500 to-green-600" },
          { name: "Maternity Leave", ...request.bucket.maternityLeave, color: "from-pink-500 to-pink-600" },
          { name: "Paternity Leave", ...request.bucket.paternityLeave, color: "from-purple-500 to-purple-600" },
        ];
        
        return (
          <Modal 
            isOpen={true} 
            onClose={() => setViewBucketModal(null)} 
            title="Leave Bucket Details" 
            size="lg"
          >
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#937CB4]/20">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {request.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#200B43]">{request.employeeName}</h3>
                  <p className="text-sm text-[#5A4079]">{request.employeeId} • {request.department}</p>
                </div>
              </div>
 
              <div className="space-y-4">
                {bucketData.map((bucket, index) => (
                  bucket.total > 0 && (
                    <div key={index} className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white p-5 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${bucket.color} flex items-center justify-center shadow-sm`}>
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#200B43]">{bucket.name}</h4>
                            <p className="text-xs text-[#5A4079]">Annual allocation</p>
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
                            style={{ width: `${(bucket.used / bucket.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-[#5A4079]">
                          <span>Used: <strong className="text-[#200B43]">{bucket.used}</strong> days</span>
                          <span>Total: <strong className="text-[#200B43]">{bucket.total}</strong> days</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
 
              <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-gradient-to-br from-[#F0E9FF] to-white p-5 shadow-md">
                <h4 className="font-semibold text-[#200B43] mb-3">Leave Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#200B43]">
                      {Object.values(request.bucket).reduce((sum, b) => sum + b.total, 0)}
                    </p>
                    <p className="text-xs text-[#5A4079]">Total Allocated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {Object.values(request.bucket).reduce((sum, b) => sum + b.used, 0)}
                    </p>
                    <p className="text-xs text-[#5A4079]">Total Used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Object.values(request.bucket).reduce((sum, b) => sum + b.remaining, 0)}
                    </p>
                    <p className="text-xs text-[#5A4079]">Total Remaining</p>
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
