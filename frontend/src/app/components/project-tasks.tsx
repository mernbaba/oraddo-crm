import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Trash2,
  Calendar,
  X,
  Check,
  AlertCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { taskService } from "../services/taskService";

type Bucket = "pending" | "in-progress" | "completed";

type UITask = {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  project: string;
  dueDate: string;
  createdAt: string;
  priority: string; // high | medium | low
  rawStatus: string;
  status: Bucket;
  completion: number;
  category: "daily" | "regular";
  duration: string;
  raw: any;
};

const toBucket = (status: string): Bucket => {
  const v = String(status || "").toLowerCase();
  if (v === "completed" || v === "achieved") return "completed";
  if (v === "in progress") return "in-progress";
  return "pending"; // pending, overdue, or unset
};

const normPriority = (segment: string): string => {
  const v = String(segment || "").toLowerCase();
  return ["high", "medium", "low"].includes(v) ? v : "medium";
};

const normalizeTask = (t: any): UITask => {
  const bucket = toBucket(t.status);
  const proj = t.ProjectCreation || {};
  return {
    id: t.id,
    title: t.task_name || "Untitled Task",
    description: t.task_description || "",
    assignedTo: t.taskOfEmploye?.emp_name || "You",
    project: proj.project_name || proj.projectName || proj.name || "",
    dueDate: t.recurrence_task_date || "",
    createdAt: t.createdAt || "",
    priority: normPriority(t.segment),
    rawStatus: t.status || "Pending",
    status: bucket,
    completion: bucket === "completed" ? 100 : bucket === "in-progress" ? 50 : 0,
    category: String(t.recurrence_types || "").toLowerCase() === "daily" ? "daily" : "regular",
    duration: t.duration || "",
    raw: t,
  };
};

const formatDate = (v: string): string => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const statusLabel = (s: string) => {
  const v = String(s || "").toLowerCase();
  if (v === "in progress") return "In Progress";
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Pending";
};

const EMPTY_FORM = {
  task_name: "",
  task_description: "",
  priority: "medium",
  category: "regular",
  duration: "",
  due_date: "",
};

type FormState = typeof EMPTY_FORM;

export function ProjectTasks() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id?: number; fullName?: string }>({});
  const [orgId, setOrgId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<Bucket>("pending");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("userData");
    if (!raw) {
      setIsLoading(false);
      setError("You are not logged in.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setCurrentUser({ id: parsed?.id, fullName: parsed?.fullName || parsed?.emp_name });
      const oid = parsed?.organizationId ?? parsed?.organizationID;
      if (oid !== undefined && oid !== null && oid !== "") setOrgId(Number(oid));
      if (!parsed?.id) {
        setIsLoading(false);
        setError("Could not identify your account.");
      }
    } catch (e) {
      console.error("Failed to parse userData", e);
      setIsLoading(false);
      setError("Could not read your session.");
    }
  }, []);

  useEffect(() => {
    if (currentUser.id) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const fetchTasks = async () => {
    if (!currentUser.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await taskService.getMyTasks(currentUser.id);
      const rows: any[] = Array.isArray(res?.data) ? res.data : res?.data?.tasks ?? [];
      setTasks(rows.map(normalizeTask));
    } catch (e: any) {
      console.error("Failed to load tasks", e);
      setError(e?.response?.data?.error || "Could not load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "pending"), [tasks]);
  const ongoingTasks = useMemo(() => tasks.filter((t) => t.status === "in-progress"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed"), [tasks]);

  const filteredTasks =
    activeTab === "pending" ? pendingTasks : activeTab === "in-progress" ? ongoingTasks : completedTasks;

  const updateStatus = async (task: UITask, status: string) => {
    setBusyId(task.id);
    try {
      await taskService.updateTask(task.id, { status });
      await fetchTasks();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not update the task.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteTask = async (task: UITask) => {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    setBusyId(task.id);
    try {
      await taskService.deleteTask(task.id);
      await fetchTasks();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not delete the task.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async () => {
    if (!form.task_name.trim()) {
      alert("Please enter a task title.");
      return;
    }
    if (!currentUser.id) return;
    setIsSaving(true);
    try {
      await taskService.createTask({
        task_name: form.task_name.trim(),
        task_description: form.task_description,
        // The model needs a non-null segment/duration; we reuse `segment` to carry priority.
        segment: form.priority,
        duration: form.duration.trim() || "1 Day",
        status: "Pending",
        recurrence_types: form.category === "daily" ? "daily" : "onetime",
        recurrence_task_date: form.due_date || null,
        empOnboardingId: currentUser.id,
        organizationID: orgId ?? undefined,
      });
      setShowNewTaskModal(false);
      setForm(EMPTY_FORM);
      await fetchTasks();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Could not create the task.");
    } finally {
      setIsSaving(false);
    }
  };

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: Bucket) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const tabBtn = (tab: Bucket, label: string, count: number, Icon: any) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium transition-all ${
        activeTab === tab
          ? "text-[#422462] border-b-2 border-[#422462] bg-[#F0E9FF]/30"
          : "text-[#5A4079] hover:text-[#422462] hover:bg-[#F0E9FF]/20"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label} ({count})
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Project Tasks</h2>
            <p className="text-[#5A4079]">Track and manage project tasks and assignments</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY_FORM);
            setShowNewTaskModal(true);
          }}
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Tasks</CardTitle>
            <Briefcase className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{tasks.length}</div>
            <p className="text-xs text-[#5A4079]">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Pending</CardTitle>
            <AlertCircle className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{pendingTasks.length}</div>
            <p className="text-xs text-[#5A4079]">Not started</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Ongoing</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{ongoingTasks.length}</div>
            <p className="text-xs text-[#5A4079]">In progress</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Completed</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{completedTasks.length}</div>
            <p className="text-xs text-[#5A4079]">Tasks finished</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-[#937CB4]/20">
        {tabBtn("pending", "Pending Tasks", pendingTasks.length, AlertCircle)}
        {tabBtn("in-progress", "Ongoing Tasks", ongoingTasks.length, Clock)}
        {tabBtn("completed", "Completed Tasks", completedTasks.length, CheckCircle2)}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#5A4079]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading tasks…
          </div>
        ) : error ? (
          <Card className="rounded-xl border border-[#937CB4]/20 bg-white/90 p-10 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <Button variant="outline" onClick={fetchTasks}>
              Retry
            </Button>
          </Card>
        ) : filteredTasks.length === 0 ? (
          <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-12 shadow-lg text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#F0E9FF] to-white flex items-center justify-center">
                <Briefcase className="h-10 w-10 text-[#422462]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#200B43] mb-2">No Tasks Found</h3>
                <p className="text-[#5A4079]">There are no tasks in this category.</p>
              </div>
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(task.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-[#200B43] text-lg">{task.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      {task.category === "daily" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                          DAILY
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-[#5A4079] mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#5A4079] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabel(task.rawStatus)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200"
                    onClick={() => handleDeleteTask(task)}
                    disabled={busyId === task.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {task.status !== "completed" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#5A4079]">Progress</span>
                    <span className="font-medium text-[#200B43]">{task.completion}%</span>
                  </div>
                  <div className="w-full bg-[#F0E9FF] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#422462] to-[#937CB4] h-2 rounded-full transition-all"
                      style={{ width: `${task.completion}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Status:</span>
                      <span className="text-[#5A4079]">{statusLabel(task.rawStatus)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Assigned To:</span>
                      <span className="text-[#5A4079]">{task.assignedTo}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Created:</span>
                      <span className="text-[#5A4079]">{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Category:</span>
                      <span className="text-[#5A4079]">
                        {task.category === "daily" ? "Daily Task" : "Regular Task"}
                      </span>
                    </div>
                  </div>
                </div>

                {task.status === "pending" && (
                  <div className="pt-2 border-t border-[#937CB4]/20">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(task, "In Progress")}
                      disabled={busyId === task.id}
                      className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Task
                    </Button>
                  </div>
                )}

                {task.status === "in-progress" && (
                  <div className="pt-2 border-t border-[#937CB4]/20">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(task, "Completed")}
                      disabled={busyId === task.id}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  </div>
                )}

                {task.status === "completed" && (
                  <div className="pt-2 border-t border-[#937CB4]/20">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Task completed</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="p-6 border-b border-[#937CB4]/20 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#200B43]">Create New Task</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewTaskModal(false)}
                className="text-[#5A4079] hover:bg-[#F0E9FF]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Task Title</label>
                  <input
                    type="text"
                    value={form.task_name}
                    onChange={(e) => setField("task_name", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={form.task_description}
                    onChange={(e) => setField("task_description", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setField("priority", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    >
                      <option value="regular">Regular Task</option>
                      <option value="daily">Daily Task</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Duration</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="e.g. 2 days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Due Date</label>
                    <input
                      type="date"
                      value={form.due_date}
                      onChange={(e) => setField("due_date", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#5A4079]">This task will be assigned to you.</p>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTaskModal(false)}
                    className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreate}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  >
                    {isSaving ? "Saving…" : "Create Task"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
