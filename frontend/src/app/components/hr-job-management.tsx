import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Briefcase, User, Clock, CheckCircle2, Plus, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const jobOpenings = [
  { id: "1", title: "Senior Software Engineer", department: "Engineering", location: "Remote", type: "Full-time", applicants: 45, status: "active", posted: "2025-12-15" },
  { id: "2", title: "Marketing Manager", department: "Marketing", location: "New York", type: "Full-time", applicants: 28, status: "active", posted: "2025-12-20" },
  { id: "3", title: "Product Designer", department: "Design", location: "San Francisco", type: "Full-time", applicants: 32, status: "active", posted: "2026-01-05" },
  { id: "4", title: "Data Analyst", department: "Analytics", location: "Remote", type: "Contract", applicants: 19, status: "closed", posted: "2025-11-28" },
  { id: "5", title: "Customer Success Manager", department: "Sales", location: "Austin", type: "Full-time", applicants: 22, status: "active", posted: "2026-01-02" },
];

const hiringPipeline = [
  { stage: "Applied", count: 146 },
  { stage: "Screening", count: 78 },
  { stage: "Interview", count: 34 },
  { stage: "Offer", count: 12 },
  { stage: "Hired", count: 8 },
];

export function HRJobManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Job Management</h2>
            <p className="text-[#5A4079]">
              Manage job postings and recruitment pipeline
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Active Openings</CardTitle>
            <Briefcase className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{jobOpenings.filter(j => j.status === "active").length}</div>
            <p className="text-xs text-[#422462]">Open positions</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Applicants</CardTitle>
            <User className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{jobOpenings.reduce((sum, j) => sum + j.applicants, 0)}</div>
            <p className="text-xs text-[#422462]">All positions</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">In Interview</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">34</div>
            <p className="text-xs text-[#422462]">Active interviews</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover border-[#937CB4]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Offers Sent</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">12</div>
            <p className="text-xs text-[#422462]">Pending acceptance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Job Openings</CardTitle>
          <CardDescription className="text-[#5A4079]">Current job positions and applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobOpenings.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#200B43]">{job.title}</h3>
                      <Badge 
                        variant={job.status === "active" ? "default" : "secondary"}
                        className={job.status === "active" ? "bg-gradient-to-r from-[#422462] to-[#5A4079]" : ""}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#5A4079]">{job.department} • {job.location} • {job.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#200B43]">{job.applicants}</p>
                    <p className="text-xs text-[#5A4079]">Applicants</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#5A4079]">Posted: {new Date(job.posted).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-[#937CB4]/30">View Applicants</Button>
                    <Button size="sm" variant="outline" className="border-[#937CB4]/30">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Hiring Pipeline</CardTitle>
          <CardDescription className="text-[#5A4079]">Candidate progression through recruitment stages</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringPipeline} layout="vertical">
              <CartesianGrid key="hiring-grid" strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
              <XAxis key="hiring-xaxis" type="number" stroke="#5A4079" />
              <YAxis key="hiring-yaxis" type="category" dataKey="stage" stroke="#5A4079" />
              <Tooltip 
                key="hiring-tooltip"
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #937CB4',
                  borderRadius: '8px',
                  color: '#200B43',
                  boxShadow: '0 4px 12px rgba(147, 124, 180, 0.15)'
                }}
              />
              <Bar key="hiring-bar" dataKey="count" fill="#422462" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}