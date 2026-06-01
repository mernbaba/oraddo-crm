import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, FileText, Plus, Sparkles } from "lucide-react";

const leaveRequests = [
  { id: "1", employee: "Sarah Williams", type: "Vacation", from: "2026-01-20", to: "2026-01-25", days: 5, status: "pending", reason: "Family vacation" },
  { id: "2", employee: "Michael Torres", type: "Sick Leave", from: "2026-01-12", to: "2026-01-13", days: 2, status: "approved", reason: "Medical appointment" },
  { id: "3", employee: "Jennifer Lee", type: "Personal", from: "2026-02-01", to: "2026-02-03", days: 3, status: "pending", reason: "Personal matters" },
  { id: "4", employee: "David Kim", type: "Vacation", from: "2026-01-28", to: "2026-02-02", days: 6, status: "approved", reason: "Holiday trip" },
];

const employeeDocuments = [
  { id: "1", name: "Employment Contract.pdf", type: "Contract", date: "2024-03-15", size: "245 KB" },
  { id: "2", name: "Tax Form W-2.pdf", type: "Tax", date: "2026-01-05", size: "128 KB" },
  { id: "3", name: "Benefits Enrollment.pdf", type: "Benefits", date: "2025-12-10", size: "312 KB" },
  { id: "4", name: "Performance Review Q4.pdf", type: "Review", date: "2025-12-28", size: "189 KB" },
];

export function HRSelfService() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Employee Self Service</h2>
          <p className="text-[#5A4079]">
            Manage leave requests and employee documents
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#422462]" />
              Leave Requests
            </CardTitle>
            <CardDescription className="text-[#5A4079]">Employee leave applications and approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.map((leave) => (
                <div key={leave.id} className="p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-[#200B43]">{leave.employee}</p>
                      <p className="text-sm text-[#5A4079]">{leave.type} • {leave.days} days</p>
                    </div>
                    <Badge 
                      variant={leave.status === "approved" ? "default" : "secondary"}
                      className={leave.status === "approved" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                    >
                      {leave.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-[#5A4079]">From:</span> <span className="font-medium text-[#200B43]">{new Date(leave.from).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[#5A4079]">To:</span> <span className="font-medium text-[#200B43]">{new Date(leave.to).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#5A4079]">{leave.reason}</p>
                  {leave.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">Approve</Button>
                      <Button size="sm" variant="outline" className="border-[#937CB4]/30">Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-[#200B43] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#422462]" />
              Employee Documents
            </CardTitle>
            <CardDescription className="text-[#5A4079]">Access and manage employee documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employeeDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#200B43]">{doc.name}</p>
                      <p className="text-sm text-[#5A4079]">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#5A4079]">{new Date(doc.date).toLocaleDateString()}</p>
                    <Button size="sm" variant="ghost" className="text-[#422462] hover:bg-[#F0E9FF]/70">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
