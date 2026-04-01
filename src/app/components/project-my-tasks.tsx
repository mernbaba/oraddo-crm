import { CheckSquare, Plus, Calendar, Clock, AlertCircle, Sparkles, Filter, Search } from "lucide-react";
import { Button } from "./ui/button";

export function ProjectMyTasks() {
  const myTasks = [
    {
      id: 1,
      title: "Complete user authentication module",
      project: "E-Commerce Platform",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-01-12",
      progress: 65,
      timeSpent: "12h 30m",
      estimatedTime: "18h",
    },
    {
      id: 2,
      title: "Review pull requests for API endpoints",
      project: "Mobile App",
      priority: "Medium",
      status: "To Do",
      dueDate: "2024-01-14",
      progress: 0,
      timeSpent: "0h",
      estimatedTime: "4h",
    },
    {
      id: 3,
      title: "Update dashboard analytics charts",
      project: "Analytics Dashboard",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-01-11",
      progress: 80,
      timeSpent: "6h 45m",
      estimatedTime: "8h",
    },
    {
      id: 4,
      title: "Write unit tests for payment module",
      project: "E-Commerce Platform",
      priority: "Medium",
      status: "To Do",
      dueDate: "2024-01-15",
      progress: 20,
      timeSpent: "2h",
      estimatedTime: "10h",
    },
    {
      id: 5,
      title: "Deploy staging environment",
      project: "CRM System",
      priority: "Low",
      status: "Completed",
      dueDate: "2024-01-08",
      progress: 100,
      timeSpent: "3h 15m",
      estimatedTime: "3h",
    },
    {
      id: 6,
      title: "Database schema optimization",
      project: "Analytics Dashboard",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-01-13",
      progress: 45,
      timeSpent: "8h 20m",
      estimatedTime: "16h",
    },
  ];

  const stats = [
    { label: "Total Tasks", value: "24", change: "+3", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "In Progress", value: "8", change: "+2", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Completed", value: "12", change: "+5", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Overdue", value: "2", change: "-1", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 border-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-300";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-300";
      case "To Do": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <CheckSquare className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">My Tasks</h2>
            <p className="text-[#5A4079]">Manage your assigned tasks and workload</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
 
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
 
      <div className="space-y-4">
        {myTasks.map((task) => (
          <div
            key={task.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[#200B43]">{task.title}</h3>
                    {isOverdue(task.dueDate) && task.status !== "Completed" && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-[#5A4079] mb-3">{task.project}</p>
 
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
 
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#5A4079]">Progress</span>
                  <span className="font-semibold text-[#422462]">{task.progress}%</span>
                </div>
                <div className="h-2 bg-[#F0E9FF] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      task.progress === 100
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-[#422462] to-[#937CB4]'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
 
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#937CB4]/20">
                <div>
                  <div className="flex items-center gap-1 text-xs text-[#5A4079] mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due Date</span>
                  </div>
                  <p className={`text-sm font-medium ${isOverdue(task.dueDate) && task.status !== "Completed" ? 'text-red-600' : 'text-[#200B43]'}`}>
                    {task.dueDate}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-[#5A4079] mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Time Spent</span>
                  </div>
                  <p className="text-sm font-medium text-[#200B43]">{task.timeSpent}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-[#5A4079] mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Estimated</span>
                  </div>
                  <p className="text-sm font-medium text-[#200B43]">{task.estimatedTime}</p>
                </div>
              </div>
 
              <div className="flex items-center gap-2">
                {task.status !== "Completed" && (
                  <Button size="sm" className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]">
                    Update Progress
                  </Button>
                )}
                <Button size="sm" variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
                  View Details
                </Button>
                {task.status === "Completed" && (
                  <div className="flex-1 flex justify-end">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
