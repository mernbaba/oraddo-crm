import { LayoutGrid, Plus, User, Calendar, Tag, Sparkles, TrendingUp, Target, Zap, Clock, Users, CheckCircle2, AlertCircle, MoreVertical, Flame, Award, Activity, X, Edit2, Trash2, MessageSquare, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Task {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  assignee: string;
  avatar: string;
  dueDate: string;
  tags: string[];
  storyPoints: number;
  subtasks: { completed: number; total: number };
  comments: number;
  columnId: string;
  description?: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays: number;
  progress: number;
  velocity: number;
  capacity: number;
  completed: number;
  total: number;
  status: string;
}

export function ProjectKanban() {
  const [selectedSprint, setSelectedSprint] = useState("sprint-3");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
 
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: "sprint-3",
      name: "Sprint 3 - Q1 2026",
      startDate: "Feb 1, 2026",
      endDate: "Feb 14, 2026",
      daysRemaining: 12,
      totalDays: 14,
      progress: 42,
      velocity: 38,
      capacity: 50,
      completed: 12,
      total: 28,
      status: "active"
    },
    {
      id: "sprint-2",
      name: "Sprint 2 - Q1 2026",
      startDate: "Jan 15, 2026",
      endDate: "Jan 31, 2026",
      daysRemaining: 0,
      totalDays: 17,
      progress: 100,
      velocity: 45,
      capacity: 45,
      completed: 45,
      total: 45,
      status: "completed"
    },
    {
      id: "sprint-1",
      name: "Sprint 1 - Q1 2026",
      startDate: "Jan 1, 2026",
      endDate: "Jan 14, 2026",
      daysRemaining: 0,
      totalDays: 14,
      progress: 100,
      velocity: 42,
      capacity: 45,
      completed: 42,
      total: 42,
      status: "completed"
    },
  ]);
 
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: "Design new landing page", 
      priority: "High", 
      assignee: "Sarah J.", 
      avatar: "SJ",
      dueDate: "Feb 15", 
      tags: ["Design", "UI/UX"],
      storyPoints: 8,
      subtasks: { completed: 0, total: 5 },
      comments: 3,
      columnId: "todo",
      description: "Create a modern landing page with hero section and features"
    },
    { 
      id: 2, 
      title: "API integration", 
      priority: "Medium", 
      assignee: "Mike C.", 
      avatar: "MC",
      dueDate: "Feb 18", 
      tags: ["Backend"],
      storyPoints: 5,
      subtasks: { completed: 0, total: 3 },
      comments: 2,
      columnId: "todo",
      description: "Integrate third-party payment API"
    },
    { 
      id: 3, 
      title: "Database optimization", 
      priority: "Low", 
      assignee: "David P.", 
      avatar: "DP",
      dueDate: "Feb 22", 
      tags: ["Database"],
      storyPoints: 3,
      subtasks: { completed: 0, total: 2 },
      comments: 1,
      columnId: "todo",
      description: "Optimize database queries for better performance"
    },
    { 
      id: 4, 
      title: "User authentication flow", 
      priority: "High", 
      assignee: "John D.", 
      avatar: "JD",
      dueDate: "Feb 12", 
      tags: ["Security", "Frontend"],
      storyPoints: 13,
      subtasks: { completed: 3, total: 6 },
      comments: 8,
      columnId: "inprogress",
      description: "Implement secure user login and registration"
    },
    { 
      id: 5, 
      title: "Payment gateway setup", 
      priority: "High", 
      assignee: "Emily R.", 
      avatar: "ER",
      dueDate: "Feb 14", 
      tags: ["Payment"],
      storyPoints: 8,
      subtasks: { completed: 2, total: 4 },
      comments: 5,
      columnId: "inprogress",
      description: "Configure Stripe payment gateway"
    },
    { 
      id: 6, 
      title: "Dashboard analytics", 
      priority: "Medium", 
      assignee: "Sarah J.", 
      avatar: "SJ",
      dueDate: "Feb 11", 
      tags: ["Analytics"],
      storyPoints: 5,
      subtasks: { completed: 4, total: 4 },
      comments: 12,
      columnId: "review",
      description: "Build analytics dashboard with charts"
    },
    { 
      id: 7, 
      title: "Email templates", 
      priority: "Low", 
      assignee: "Mike C.", 
      avatar: "MC",
      dueDate: "Feb 13", 
      tags: ["Marketing"],
      storyPoints: 3,
      subtasks: { completed: 2, total: 2 },
      comments: 4,
      columnId: "review",
      description: "Design responsive email templates"
    },
    { 
      id: 8, 
      title: "Project setup", 
      priority: "High", 
      assignee: "John D.", 
      avatar: "JD",
      dueDate: "Feb 05", 
      tags: ["Setup"],
      storyPoints: 5,
      subtasks: { completed: 4, total: 4 },
      comments: 6,
      columnId: "done",
      description: "Initial project configuration and setup"
    },
    { 
      id: 9, 
      title: "Initial wireframes", 
      priority: "Medium", 
      assignee: "Emily R.", 
      avatar: "ER",
      dueDate: "Feb 08", 
      tags: ["Design"],
      storyPoints: 8,
      subtasks: { completed: 5, total: 5 },
      comments: 10,
      columnId: "done",
      description: "Create initial wireframes for all pages"
    },
  ]);
 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    assignee: "",
    avatar: "",
    dueDate: "",
    tags: "",
    storyPoints: 5,
    columnId: "todo"
  });
 
  const [sprintFormData, setSprintFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    capacity: 50,
    status: "planned" as "active" | "planned" | "completed"
  });

  const currentSprint = sprints.find(s => s.id === selectedSprint) || sprints[0];

  const columns = [
    { id: "todo", title: "To Do", color: "#937CB4", gradient: "from-[#937CB4]/20 to-[#937CB4]/5" },
    { id: "inprogress", title: "In Progress", color: "#5A4079", gradient: "from-[#5A4079]/20 to-[#5A4079]/5" },
    { id: "review", title: "In Review", color: "#422462", gradient: "from-[#422462]/20 to-[#422462]/5" },
    { id: "done", title: "Done", color: "#10b981", gradient: "from-emerald-500/20 to-emerald-500/5" }
  ];
 
  const getFilteredTasks = (columnId: string) => {
    return tasks.filter(task => {
      const matchesColumn = task.columnId === columnId;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      return matchesColumn && matchesSearch && matchesPriority;
    });
  };
 
  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assignee: formData.assignee || "Unassigned",
      avatar: formData.avatar || "UN",
      dueDate: formData.dueDate || "TBD",
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      storyPoints: formData.storyPoints,
      subtasks: { completed: 0, total: 0 },
      comments: 0,
      columnId: formData.columnId
    };

    setTasks([...tasks, newTask]);
    resetForm();
    setShowTaskModal(false);
  };
 
  const handleUpdateTask = () => {
    if (!editingTask || !formData.title.trim()) return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? {
            ...task,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            assignee: formData.assignee,
            avatar: formData.avatar,
            dueDate: formData.dueDate,
            tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
            storyPoints: formData.storyPoints,
            columnId: formData.columnId
          }
        : task
    ));

    resetForm();
    setEditingTask(null);
    setShowTaskModal(false);
  };

 
  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      setShowTaskDetailModal(false);
    }
  };
 
  const handleMoveTask = (taskId: number, newColumnId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    ));
  };
 
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      assignee: task.assignee,
      avatar: task.avatar,
      dueDate: task.dueDate,
      tags: task.tags.join(", "),
      storyPoints: task.storyPoints,
      columnId: task.columnId
    });
    setShowTaskModal(true);
  };
 
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };
 
  const handleUpdateSubtasks = (taskId: number, completed: number, total: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, subtasks: { completed, total } } : task
    ));
  };
 
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      assignee: "",
      avatar: "",
      dueDate: "",
      tags: "",
      storyPoints: 5,
      columnId: "todo"
    });
  };
 
  const resetSprintForm = () => {
    setSprintFormData({
      name: "",
      startDate: "",
      endDate: "",
      capacity: 50,
      status: "planned"
    });
  };
 
  const handleAddSprint = () => {
    if (!sprintFormData.name.trim() || !sprintFormData.startDate || !sprintFormData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name: sprintFormData.name,
      startDate: sprintFormData.startDate,
      endDate: sprintFormData.endDate,
      daysRemaining: sprintFormData.status === "active" ? 14 : 0,
      totalDays: 14,
      progress: 0,
      velocity: 0,
      capacity: sprintFormData.capacity,
      completed: 0,
      total: 0,
      status: sprintFormData.status
    };

    setSprints([newSprint, ...sprints]);
    if (sprintFormData.status === "active") {
      setSelectedSprint(newSprint.id);
    }
    resetSprintForm();
    setShowSprintModal(false);
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "High": 
        return { 
          bg: "bg-red-50", 
          text: "text-red-700", 
          border: "border-red-300",
          icon: <Flame className="h-3 w-3" />
        };
      case "Medium": 
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-700", 
          border: "border-amber-300",
          icon: <AlertCircle className="h-3 w-3" />
        };
      case "Low": 
        return { 
          bg: "bg-emerald-50", 
          text: "text-emerald-700", 
          border: "border-emerald-300",
          icon: <CheckCircle2 className="h-3 w-3" />
        };
      default: 
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-700", 
          border: "border-gray-300",
          icon: null
        };
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] to-[#422462] blur-2xl opacity-40 animate-pulse"></div>
            <LayoutGrid className="h-10 w-10 text-[#422462] relative z-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
              Sprint Kanban Board
            </h2>
            <p className="text-[#5A4079] text-sm">
              Agile workflow management and sprint tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
            onClick={() => setShowSprintModal(true)}
          >
            <Zap className="h-4 w-4 mr-2" />
            New Sprint
          </Button>
          <Button 
            className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43] shadow-lg"
            onClick={() => {
              resetForm();
              setEditingTask(null);
              setShowTaskModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
 
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-[#937CB4]/30"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48 border-[#937CB4]/30">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium Priority</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/5 via-transparent to-[#422462]/5 pointer-events-none"></div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
 
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#422462]" />
                <span className="text-sm font-medium text-[#422462]">Active Sprint:</span>
              </div>
              <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <div className="flex items-center gap-2">
                        {sprint.status === "active" && (
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        )}
                        {sprint.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-200">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div className="text-xs">
                  <p className="text-blue-600 font-medium">{currentSprint.startDate} - {currentSprint.endDate}</p>
                </div>
              </div>
              
              {currentSprint.status === "active" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-white border border-amber-200">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <div className="text-xs">
                    <p className="text-amber-600 font-medium">{currentSprint.daysRemaining} days remaining</p>
                  </div>
                </div>
              )}
            </div>
          </div>
 
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5A4079] font-medium">Sprint Progress</span>
              <span className="text-[#422462] font-bold">{tasks.filter(t => t.columnId === "done").length} / {tasks.length} tasks</span>
            </div>
            <div className="relative h-3 bg-[#F0E9FF] rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#422462] to-[#937CB4] rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.columnId === "done").length / tasks.length * 100) : 0}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#5A4079]">
              <span>{tasks.length > 0 ? ((tasks.filter(t => t.columnId === "done").length / tasks.length * 100).toFixed(0)) : 0}% Complete</span>
              <span>Target: {currentSprint.capacity} story points</span>
            </div>
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-white to-[#F0E9FF]/20 p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-[#5A4079] font-medium mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-[#200B43]">{tasks.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center shadow-lg">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-[#5A4079]">Across all columns</p>
        </div>
 
        <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-700">{tasks.filter(t => t.columnId === "done").length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-emerald-600">{tasks.length > 0 ? ((tasks.filter(t => t.columnId === "done").length / tasks.length * 100).toFixed(0)) : 0}% of sprint goal</p>
        </div>
 
        <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-purple-600 font-medium mb-1">Velocity</p>
              <p className="text-2xl font-bold text-purple-700">
                {tasks.filter(t => t.columnId === "done").reduce((sum, t) => sum + t.storyPoints, 0)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-purple-600">Story points delivered</p>
        </div>
 
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Capacity</p>
              <p className="text-2xl font-bold text-blue-700">
                {tasks.reduce((sum, t) => sum + t.storyPoints, 0)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-600">Total story points</p>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getFilteredTasks(column.id);
          const columnCount = tasks.filter(t => t.columnId === column.id).length;
          
          return (
            <div
              key={column.id}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-white shadow-lg"
            >
 
              <div className={`p-4 border-b border-[#937CB4]/20 bg-gradient-to-br ${column.gradient}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full shadow-lg"
                      style={{ backgroundColor: column.color }}
                    ></div>
                    <h3 className="font-bold text-[#200B43]">{column.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white shadow-sm" style={{ color: column.color }}>
                    {columnCount}
                  </span>
                </div>
 
                <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${columnCount > 0 ? 100 : 0}%`,
                      backgroundColor: column.color 
                    }}
                  ></div>
                </div>
              </div>
 
              <div className="p-3 space-y-3 min-h-[500px] max-h-[600px] overflow-y-auto">
                {columnTasks.map((task) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const subtaskProgress = task.subtasks.total > 0 ? (task.subtasks.completed / task.subtasks.total) * 100 : 0;
                  
                  return (
                    <div
                      key={task.id}
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-white to-[#F0E9FF]/30 border border-[#937CB4]/20 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewTask(task)}
                    >
 
                      <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4]/0 to-[#422462]/0 group-hover:from-[#937CB4]/5 group-hover:to-[#422462]/5 rounded-xl transition-all duration-200 pointer-events-none"></div>
                      
                      <div className="relative z-10">
 
                        <div className="flex items-start justify-between mb-3">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${priorityConfig.border} ${priorityConfig.bg} ${priorityConfig.text}`}>
                            {priorityConfig.icon}
                            {task.priority}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                            >
                              <Edit2 className="h-3 w-3 text-[#422462]" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
 
                        <h4 className="font-semibold text-[#200B43] mb-3 leading-snug group-hover:text-[#422462] transition-colors">
                          {task.title}
                        </h4>
 
                        {task.subtasks.total > 0 && (
                          <div className="mb-3 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#5A4079]">Subtasks</span>
                              <span className="text-[#422462] font-medium">
                                {task.subtasks.completed}/{task.subtasks.total}
                              </span>
                            </div>
                            <div className="h-1.5 bg-[#F0E9FF] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${subtaskProgress}%`,
                                  backgroundColor: column.color
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
 
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {task.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-[#F0E9FF] to-white text-[#422462] border border-[#937CB4]/30"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-[#F0E9FF] to-white text-[#422462] border border-[#937CB4]/30">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
 
                        <div className="flex items-center justify-between pt-3 border-t border-[#937CB4]/10">
                          <div className="flex items-center gap-3">
                            {/* Assignee Avatar */}
                            <div className="flex items-center gap-1.5">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center text-white text-xs font-bold shadow-md">
                                {task.avatar}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
 
                            <div className="flex items-center gap-1 text-xs text-[#5A4079]">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span className="font-medium">{task.comments}</span>
                            </div>
 
                            <div className="px-2 py-1 rounded-md bg-gradient-to-r from-[#422462] to-[#5A4079] text-white text-xs font-bold shadow-sm">
                              {task.storyPoints}
                            </div>
                          </div>
                        </div>
 
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#5A4079]">
                          <Clock className="h-3 w-3" />
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-[#5A4079] text-sm">
                    No tasks found
                  </div>
                )}
 
                <button 
                  className="w-full p-4 rounded-xl border-2 border-dashed border-[#937CB4]/30 text-[#5A4079] hover:bg-gradient-to-br hover:from-[#F0E9FF]/50 hover:to-white hover:border-[#937CB4]/50 transition-all duration-200 flex items-center justify-center gap-2 group"
                  onClick={() => {
                    resetForm();
                    setFormData(prev => ({ ...prev, columnId: column.id }));
                    setEditingTask(null);
                    setShowTaskModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
 
      {showTaskModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="sticky top-0 bg-gradient-to-r from-[#200B43] to-[#422462] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{editingTask ? "Edit Task" : "Create New Task"}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Task Title *</label>
                <Input 
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Description</label>
                <Textarea 
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border-[#937CB4]/30 min-h-[100px]"
                />
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Priority</label>
                  <Select value={formData.priority} onValueChange={(value: "High" | "Medium" | "Low") => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="border-[#937CB4]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Status</label>
                  <Select value={formData.columnId} onValueChange={(value) => setFormData({...formData, columnId: value})}>
                    <SelectTrigger className="border-[#937CB4]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Assignee</label>
                  <Input 
                    placeholder="e.g., John D."
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    className="border-[#937CB4]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Avatar (Initials)</label>
                  <Input 
                    placeholder="e.g., JD"
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value.toUpperCase()})}
                    maxLength={2}
                    className="border-[#937CB4]/30"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Due Date</label>
                  <Input 
                    placeholder="e.g., Feb 15"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="border-[#937CB4]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Story Points</label>
                  <Input 
                    type="number"
                    min="1"
                    max="100"
                    value={formData.storyPoints}
                    onChange={(e) => setFormData({...formData, storyPoints: parseInt(e.target.value) || 1})}
                    className="border-[#937CB4]/30"
                  />
                </div>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Tags (comma-separated)</label>
                <Input 
                  placeholder="e.g., Design, UI/UX, Frontend"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  className="border-[#937CB4]/30"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43]"
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {showTaskDetailModal && selectedTask && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="sticky top-0 bg-gradient-to-r from-[#200B43] to-[#422462] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{selectedTask.title}</h3>
                  {getPriorityConfig(selectedTask.priority).icon}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowTaskDetailModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
 
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <p className="text-xs text-[#5A4079] mb-1">Priority</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedTask.priority}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <p className="text-xs text-[#5A4079] mb-1">Story Points</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedTask.storyPoints}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <p className="text-xs text-[#5A4079] mb-1">Due Date</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedTask.dueDate}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <p className="text-xs text-[#5A4079] mb-1">Comments</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedTask.comments}</p>
                </div>
              </div>
 
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-2">Description</h4>
                <p className="text-sm text-[#5A4079] bg-[#F0E9FF]/30 p-4 rounded-xl border border-[#937CB4]/20">
                  {selectedTask.description || "No description provided"}
                </p>
              </div>
 
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-2">Assignee</h4>
                <div className="flex items-center gap-3 p-3 bg-[#F0E9FF]/30 rounded-xl border border-[#937CB4]/20">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center text-white font-bold">
                    {selectedTask.avatar}
                  </div>
                  <span className="text-sm font-medium text-[#200B43]">{selectedTask.assignee}</span>
                </div>
              </div>
 
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#F0E9FF] to-white text-[#422462] border border-[#937CB4]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
 
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#422462]">Subtasks</h4>
                  <span className="text-xs text-[#5A4079]">
                    {selectedTask.subtasks.completed} / {selectedTask.subtasks.total} completed
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-[#F0E9FF] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#422462] to-[#937CB4] transition-all duration-300"
                      style={{ width: `${selectedTask.subtasks.total > 0 ? (selectedTask.subtasks.completed / selectedTask.subtasks.total * 100) : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#937CB4]/30"
                      onClick={() => {
                        const newCompleted = Math.max(0, selectedTask.subtasks.completed - 1);
                        handleUpdateSubtasks(selectedTask.id, newCompleted, selectedTask.subtasks.total);
                        setSelectedTask({...selectedTask, subtasks: {...selectedTask.subtasks, completed: newCompleted}});
                      }}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      max={selectedTask.subtasks.total}
                      value={selectedTask.subtasks.total}
                      onChange={(e) => {
                        const newTotal = parseInt(e.target.value) || 0;
                        handleUpdateSubtasks(selectedTask.id, Math.min(selectedTask.subtasks.completed, newTotal), newTotal);
                        setSelectedTask({...selectedTask, subtasks: {...selectedTask.subtasks, total: newTotal}});
                      }}
                      className="w-20 text-center border-[#937CB4]/30"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#937CB4]/30"
                      onClick={() => {
                        const newCompleted = Math.min(selectedTask.subtasks.total, selectedTask.subtasks.completed + 1);
                        handleUpdateSubtasks(selectedTask.id, newCompleted, selectedTask.subtasks.total);
                        setSelectedTask({...selectedTask, subtasks: {...selectedTask.subtasks, completed: newCompleted}});
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
 
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-2">Move Task</h4>
                <div className="flex gap-2">
                  {columns.map(col => (
                    <Button
                      key={col.id}
                      size="sm"
                      variant={selectedTask.columnId === col.id ? "default" : "outline"}
                      className={selectedTask.columnId === col.id 
                        ? "bg-gradient-to-r from-[#422462] to-[#937CB4] text-white flex-1" 
                        : "border-[#937CB4]/30 flex-1"
                      }
                      onClick={() => {
                        handleMoveTask(selectedTask.id, col.id);
                        setSelectedTask({...selectedTask, columnId: col.id});
                      }}
                    >
                      {col.title}
                    </Button>
                  ))}
                </div>
              </div>
 
              <div className="flex justify-between gap-3 pt-4 border-t border-[#937CB4]/20">
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    className="border-[#937CB4]/30"
                    onClick={() => {
                      handleEditTask(selectedTask);
                      setShowTaskDetailModal(false);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43]"
                    onClick={() => setShowTaskDetailModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {showSprintModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="sticky top-0 bg-gradient-to-r from-[#200B43] to-[#422462] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Create New Sprint</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setShowSprintModal(false);
                    resetSprintForm();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Sprint Name *</label>
                <Input 
                  placeholder="Enter sprint name"
                  value={sprintFormData.name}
                  onChange={(e) => setSprintFormData({...sprintFormData, name: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Start Date *</label>
                <Input 
                  type="date"
                  value={sprintFormData.startDate}
                  onChange={(e) => setSprintFormData({...sprintFormData, startDate: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">End Date *</label>
                <Input 
                  type="date"
                  value={sprintFormData.endDate}
                  onChange={(e) => setSprintFormData({...sprintFormData, endDate: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Capacity (Story Points)</label>
                <Input 
                  type="number"
                  min="1"
                  max="100"
                  value={sprintFormData.capacity}
                  onChange={(e) => setSprintFormData({...sprintFormData, capacity: parseInt(e.target.value) || 1})}
                  className="border-[#937CB4]/30"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Status</label>
                <Select value={sprintFormData.status} onValueChange={(value) => setSprintFormData({...sprintFormData, status: value})}>
                  <SelectTrigger className="border-[#937CB4]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowSprintModal(false);
                    resetSprintForm();
                  }}
                  className="border-[#937CB4]/30"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43]"
                  onClick={handleAddSprint}
                >
                  Create Sprint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}