import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Modal } from "./ui/modal";
import { Briefcase, User, Clock, CheckCircle2, Plus, Sparkles, Pencil, Trash2, Phone, Mail, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { jobService, Job } from "../services/jobService";
import { candidateService, Candidate } from "../services/candidateService";

type JobFormData = {
  job_title: string;
  job_description: string;
  department: string;
  location: string;
  job_type: string;
  experience: string;
  skills: string;
  package: string;
  no_of_applications: string;
  published_date: string;
  end_date: string;
  status: string;
};

const defaultForm: JobFormData = {
  job_title: "",
  job_description: "",
  department: "",
  location: "",
  job_type: "Work from Office",
  experience: "",
  skills: "",
  package: "",
  no_of_applications: "0",
  published_date: new Date().toISOString().split("T")[0],
  end_date: "",
  status: "Active",
};

function toDateInput(val?: string) {
  if (!val) return "";
  return new Date(val).toISOString().split("T")[0];
}

export function HRJobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  const fetchJobs = (id: number) => {
    setLoading(true);
    jobService
      .getJobsByOrg(id)
      .then((res) => setJobs(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => console.error("Failed to fetch jobs", err))
      .finally(() => setLoading(false));
  };

  const fetchCandidates = () => {
    candidateService.getAll()
      .then((res) => setCandidates(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => console.error("Failed to fetch candidates", err));
  };

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("userData");
      if (!stored) { setLoading(false); return; }
      const parsed = JSON.parse(stored);
      const id = parsed?.organizationId;
      if (!id) { setLoading(false); return; }
      setOrgId(id);
      fetchJobs(id);
      fetchCandidates();
    } catch {
      setLoading(false);
    }
  }, []);

  // Stats from real data
  const totalApplicants = candidates.length;
  const activeCount = jobs.filter((j) => j.status === "Active").length;
  const inInterview = candidates.filter(
    (c) => c.techround && c.techround !== "Pending"
  ).length;
  const offersSent = candidates.filter(
    (c) => c.finalround && c.finalround !== "Pending"
  ).length;

  // Real pipeline counts from CandidateDetails
  const hiringPipeline = [
    { stage: "Applied",   count: candidates.length },
    { stage: "Screening", count: candidates.filter((c) => c.marks != null).length },
    { stage: "Interview", count: inInterview },
    { stage: "Offer",     count: offersSent },
    { stage: "Hired",     count: candidates.filter((c) => c.finalround === "Qualified").length },
  ];

  const openCreate = () => { setForm(defaultForm); setShowCreate(true); };

  const openApplicants = (job: Job) => { setViewingJob(job); setShowApplicants(true); };

  const openEdit = (job: Job) => {
    setEditJob(job);
    setForm({
      job_title:         job.job_title || "",
      job_description:   job.job_description || "",
      department:        job.department || "",
      location:          job.location || "",
      job_type:          job.job_type || "Work from Office",
      experience:        job.experience || "",
      skills:            job.skills || "",
      package:           job.package || "",
      no_of_applications: job.no_of_applications || "0",
      published_date:    toDateInput(job.published_date),
      end_date:          toDateInput(job.end_date),
      status:            job.status || "Active",
    });
    setShowEdit(true);
  };

  const handleCreate = async () => {
    if (!orgId) return;
    if (!form.job_title.trim() || !form.job_description.trim() || !form.published_date || !form.end_date) {
      setApiError("Please fill in Job Title, Description, Published Date and End Date.");
      return;
    }
    setApiError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      (Object.entries(form) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
      fd.append("organizationID", String(orgId));
      await jobService.createJob(fd);
      setShowCreate(false);
      fetchJobs(orgId);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Failed to create job.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editJob || !orgId) return;
    setApiError(null);
    setSubmitting(true);
    try {
      await jobService.updateJob(editJob.id, { ...form, no_of_applications: String(form.no_of_applications) });
      setShowEdit(false);
      fetchJobs(orgId);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Failed to update job.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (job: Job) => {
    if (!orgId || !window.confirm(`Delete "${job.job_title}"?`)) return;
    try {
      await jobService.deleteJob(job.id);
      fetchJobs(orgId);
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const statusClass = (status: string) => {
    if (status === "Active") return "bg-gradient-to-r from-[#422462] to-[#5A4079] text-white";
    if (status === "Pause")  return "bg-yellow-500 text-white";
    return "bg-gray-400 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Job Management</h2>
            <p className="text-[#5A4079]">Manage job postings and recruitment pipeline</p>
          </div>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white neon-button">
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active Openings",  value: activeCount,    sub: "Open positions",     icon: <Briefcase className="h-5 w-5 text-[#422462]" /> },
          { label: "Total Applicants", value: totalApplicants, sub: "All positions",      icon: <User className="h-5 w-5 text-[#422462]" /> },
          { label: "In Interview",     value: inInterview,    sub: "Active interviews",   icon: <Clock className="h-5 w-5 text-[#422462]" /> },
          { label: "Offers Sent",      value: offersSent,     sub: "Pending acceptance",  icon: <CheckCircle2 className="h-5 w-5 text-[#422462]" /> },
        ].map((s) => (
          <Card key={s.label} className="gradient-card gradient-card-hover border-[#937CB4]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#200B43]">{s.label}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#200B43]">{s.value}</div>
              <p className="text-xs text-[#422462]">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job List */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Job Openings</CardTitle>
          <CardDescription className="text-[#5A4079]">Current job positions and applications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-[#5A4079]">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-[#5A4079]">
              No job openings found. Click "Post New Job" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg bg-[#F0E9FF]/50 border border-[#937CB4]/20 hover:border-[#937CB4]/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#200B43]">{job.job_title}</h3>
                        <Badge className={statusClass(job.status)}>{job.status}</Badge>
                      </div>
                      <p className="text-sm text-[#5A4079]">
                        {[job.department, job.location, job.job_type].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#200B43]">{job.no_of_applications}</p>
                      <p className="text-xs text-[#5A4079]">Applicants</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#5A4079]">
                      Posted:{" "}
                      {job.published_date
                        ? new Date(job.published_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-[#937CB4]/30" onClick={() => openApplicants(job)}>
                        View Applicants
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#937CB4]/30"
                        onClick={() => openEdit(job)}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(job)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hiring Pipeline */}
      <Card className="gradient-card border-[#937CB4]/30">
        <CardHeader>
          <CardTitle className="text-[#200B43]">Hiring Pipeline</CardTitle>
          <CardDescription className="text-[#5A4079]">
            Candidate progression through recruitment stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringPipeline} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#937CB4" opacity={0.2} />
              <XAxis type="number" stroke="#5A4079" />
              <YAxis type="category" dataKey="stage" stroke="#5A4079" width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #937CB4",
                  borderRadius: "8px",
                  color: "#200B43",
                }}
              />
              <Bar dataKey="count" fill="#422462" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* View Applicants Modal */}
      <Modal isOpen={showApplicants} onClose={() => setShowApplicants(false)} title={`Applicants — ${viewingJob?.job_title || ""}`} size="lg">
        <ApplicantsPanel candidates={candidates} />
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setApiError(null); }} title="Post New Job" size="md">
        <JobForm
          form={form}
          onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
          onSubmit={handleCreate}
          onClose={() => { setShowCreate(false); setApiError(null); }}
          submitLabel="Post Job"
          submitting={submitting}
          error={apiError}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => { setShowEdit(false); setApiError(null); }} title="Edit Job" size="md">
        <JobForm
          form={form}
          onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
          onSubmit={handleUpdate}
          onClose={() => { setShowEdit(false); setApiError(null); }}
          submitLabel="Save Changes"
          submitting={submitting}
          error={apiError}
        />
      </Modal>
    </div>
  );
}

function JobForm({
  form,
  onChange,
  onSubmit,
  onClose,
  submitLabel,
  submitting,
  error,
}: {
  form: JobFormData;
  onChange: (key: keyof JobFormData, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
  submitting: boolean;
  error?: string | null;
}) {
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#422462]";
  const labelCls = "block text-sm font-medium text-[#200B43] mb-1";

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Job Title *</label>
          <input className={inputCls} value={form.job_title} onChange={e => onChange("job_title", e.target.value)} placeholder="e.g. Senior Software Engineer" />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Job Description *</label>
          <textarea className={`${inputCls} h-24 resize-none`} value={form.job_description} onChange={e => onChange("job_description", e.target.value)} placeholder="Describe the role and responsibilities..." />
        </div>

        <div>
          <label className={labelCls}>Department</label>
          <input className={inputCls} value={form.department} onChange={e => onChange("department", e.target.value)} placeholder="e.g. Engineering" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input className={inputCls} value={form.location} onChange={e => onChange("location", e.target.value)} placeholder="e.g. Remote" />
        </div>

        <div>
          <label className={labelCls}>Job Type</label>
          <select className={inputCls} value={form.job_type} onChange={e => onChange("job_type", e.target.value)}>
            <option value="Work from Office">Work from Office</option>
            <option value="Work from Home">Work from Home</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={e => onChange("status", e.target.value)}>
            <option value="Active">Active</option>
            <option value="Pause">Pause</option>
            <option value="Close">Close</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Experience</label>
          <input className={inputCls} value={form.experience} onChange={e => onChange("experience", e.target.value)} placeholder="e.g. 3-5 years" />
        </div>
        <div>
          <label className={labelCls}>Package / Salary</label>
          <input className={inputCls} value={form.package} onChange={e => onChange("package", e.target.value)} placeholder="e.g. $80,000 - $100,000" />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Skills</label>
          <input className={inputCls} value={form.skills} onChange={e => onChange("skills", e.target.value)} placeholder="e.g. React, Node.js, TypeScript" />
        </div>

        <div>
          <label className={labelCls}>No. of Applications *</label>
          <input type="number" min="0" className={inputCls} value={form.no_of_applications} onChange={e => onChange("no_of_applications", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Published Date *</label>
          <input type="date" className={inputCls} value={form.published_date} onChange={e => onChange("published_date", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>End Date *</label>
          <input type="date" className={inputCls} value={form.end_date} onChange={e => onChange("end_date", e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-[#937CB4]/20">
        <Button variant="outline" className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={submitting} className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white">
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}

function ApplicantsPanel({ candidates }: { candidates: Candidate[] }) {
  const statusColor = (s?: string | null) => {
    if (s === "Qualified")    return "bg-green-100 text-green-700";
    if (s === "DisQualified") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  if (candidates.length === 0) {
    return <p className="text-sm text-[#5A4079] py-4 text-center">No candidates found.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#5A4079]">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""} in the system</p>
      <div className="space-y-2">
        {candidates.map((c) => (
          <div key={c.id} className="p-3 rounded-lg border border-[#937CB4]/20 bg-[#F0E9FF]/30 hover:border-[#937CB4]/40 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-[#200B43] text-sm">{c.candidate_name}</span>
                  {c.job_type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#422462]/10 text-[#422462]">{c.job_type}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5A4079]">
                  {c.email_address && (
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email_address}</span>
                  )}
                  {c.phone_number && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone_number}</span>
                  )}
                  {c.college_name && (
                    <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{c.college_name}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {c.marks != null && (
                  <span className="text-xs text-[#5A4079]">Score: <strong>{c.marks}</strong></span>
                )}
                <div className="flex gap-1 flex-wrap justify-end">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(c.status)}`}>
                    {c.status ?? "Pending"}
                  </span>
                  {c.techround && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(c.techround)}`}>
                      Tech: {c.techround}
                    </span>
                  )}
                  {c.finalround && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(c.finalround)}`}>
                      Final: {c.finalround}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
