import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  X,
  Check,
  AlertCircle,
  PlayCircle,
  Send
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  completion: number;
  category: "daily" | "regular";
};

const initialTasks: Task[] = [
  { id: "1", title: "Design user interface mockups", description: "Create wireframes and mockups for new features", assignedTo: "Sarah Williams", dueDate: "2026-02-17", priority: "high", status: "pending", completion: 0, category: "daily" },
  { id: "2", title: "Implement authentication system", description: "Build secure login and registration functionality", assignedTo: "You", dueDate: "2026-02-17", priority: "high", status: "in-progress", completion: 65, category: "daily" },
  { id: "3", title: "Code review and QA testing", description: "Review code changes and perform quality assurance", assignedTo: "You", dueDate: "2026-02-17", priority: "medium", status: "completed", completion: 100, category: "daily" },
  { id: "4", title: "Database schema optimization", description: "Optimize database queries for better performance", assignedTo: "Sarah Williams", dueDate: "2026-02-20", priority: "high", status: "in-progress", completion: 75, category: "regular" },
  { id: "5", title: "API documentation update", description: "Update API endpoints documentation", assignedTo: "Michael Torres", dueDate: "2026-02-18", priority: "high", status: "completed", completion: 100, category: "regular" },
  { id: "6", title: "Implement payment gateway", description: "Integrate payment processing system", assignedTo: "Jennifer Lee", dueDate: "2026-02-25", priority: "medium", status: "pending", completion: 0, category: "regular" },
  { id: "7", title: "Mobile responsiveness fixes", description: "Fix UI issues on mobile devices", assignedTo: "David Kim", dueDate: "2026-02-22", priority: "medium", status: "in-progress", completion: 45, category: "regular" },
  { id: "8", title: "Security audit and fixes", description: "Conduct security review and fix vulnerabilities", assignedTo: "Emma Johnson", dueDate: "2026-02-28", priority: "high", status: "pending", completion: 0, category: "regular" },
  { id: "9", title: "Daily standup report", description: "Prepare and share daily progress report", assignedTo: "You", dueDate: "2026-02-17", priority: "medium", status: "completed", completion: 100, category: "daily" },
];

export function ProjectTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<"pending" | "ongoing" | "completed">("pending");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    switch (activeTab) {
      case "pending":
        return tasks.filter(t => t.status === "pending");
      case "ongoing":
        return tasks.filter(t => t.status === "in-progress");
      case "completed":
        return tasks.filter(t => t.status === "completed");
      default:
        return tasks;
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "completed", completion: 100 }
        : task
    ));
  };

  const handleMarkInProgress = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "in-progress" }
        : task
    ));
  };

  const handleSubmitTask = (taskId: string) => {
    alert(`Task ${taskId} has been submitted successfully!`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const ongoingTasks = tasks.filter(t => t.status === "in-progress");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress": return <Clock className="h-5 w-5 text-yellow-600" />;
      case "pending": return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Project Tasks</h2>
            <p className="text-[#5A4079]">
              Track and manage project tasks and assignments
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowNewTaskModal(true)}
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Total Tasks</CardTitle>
            <Briefcase className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{tasks.length}</div>
            <p className="text-xs text-[#5A4079]">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Pending</CardTitle>
            <AlertCircle className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{pendingTasks.length}</div>
            <p className="text-xs text-[#5A4079]">Not started</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#200B43]">Ongoing</CardTitle>
            <Clock className="h-5 w-5 text-[#422462]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#200B43]">{ongoingTasks.length}</div>
            <p className="text-xs text-[#5A4079]">In progress</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#937CB4]/20">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "pending"
              ? "text-[#422462] border-b-2 border-[#422462] bg-[#F0E9FF]/30"
              : "text-[#5A4079] hover:text-[#422462] hover:bg-[#F0E9FF]/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pending Tasks ({pendingTasks.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "ongoing"
              ? "text-[#422462] border-b-2 border-[#422462] bg-[#F0E9FF]/30"
              : "text-[#5A4079] hover:text-[#422462] hover:bg-[#F0E9FF]/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ongoing Tasks ({ongoingTasks.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "completed"
              ? "text-[#422462] border-b-2 border-[#422462] bg-[#F0E9FF]/30"
              : "text-[#5A4079] hover:text-[#422462] hover:bg-[#F0E9FF]/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed Tasks ({completedTasks.length})
          </div>
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {getFilteredTasks().length === 0 ? (
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
          getFilteredTasks().map((task) => (
            <div 
              key={task.id} 
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#200B43] text-lg">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.category === "daily" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                          DAILY
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5A4079] mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#5A4079]">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  className={`${
                    task.status === "completed" 
                      ? "bg-green-100 text-green-700" 
                      : task.status === "in-progress" 
                      ? "bg-yellow-100 text-yellow-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>

              {/* Progress Bar */}
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

              {/* Detailed Task Information */}
              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Status:</span>
                      <span className="text-[#5A4079]">
                        {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Assigned By:</span>
                      <span className="text-[#5A4079]">Project Manager</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Created:</span>
                      <span className="text-[#5A4079]">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-[#200B43]">Category:</span>
                      <span className="text-[#5A4079]">{task.category === "daily" ? "Daily Task" : "Regular Task"}</span>
                    </div>
                  </div>
                </div>
                
                {task.status !== "completed" && (
                  <div className="pt-2 border-t border-[#937CB4]/20">
                    <p className="text-sm font-medium text-[#200B43] mb-2">Task Requirements:</p>
                    <ul className="text-sm text-[#5A4079] space-y-1 list-disc list-inside">
                      <li>Review all necessary documents and information</li>
                      <li>Complete all required checkpoints before deadline</li>
                      <li>Update progress status regularly</li>
                      <li>Notify team members upon completion</li>
                    </ul>
                    
                    {/* Start Task Button for Pending Tasks */}
                    {task.status === "pending" && (
                      <div className="mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkInProgress(task.id)}
                          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Task
                        </Button>
                      </div>
                    )}

                    {/* Complete Button for Ongoing Tasks */}
                    {task.status === "in-progress" && (
                      <div className="mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {task.status === "completed" && (
                  <div className="pt-2 border-t border-[#937CB4]/20">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Task completed successfully on {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    {/* Submit Button for Completed Tasks */}
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitTask(task.id)}
                      className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Task
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Task Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none resize-none"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Priority</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Category</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none">
                      <option value="regular">Regular Task</option>
                      <option value="daily">Daily Task</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Assign To</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                      placeholder="Team member name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#200B43] mb-2">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:border-[#422462] focus:ring-2 focus:ring-[#422462]/20 outline-none"
                    />
                  </div>
                </div>
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
                    type="submit"
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
