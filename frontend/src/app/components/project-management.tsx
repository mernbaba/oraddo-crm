import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { FolderKanban, Calendar, Users, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";

type ProjectRow = {
  id: string;
  name: string;
  status: "in-progress" | "completed" | "planning" | "on-hold";
  progress: number;
  team: string[];
  startDate: string;
  endDate: string;
  budget: string;
  tasksCompleted: number;
  tasksTotal: number;
  priority: "high" | "medium" | "low";
};

const fallbackProjects: ProjectRow[] = [
  {
    id: "1",
    name: "Customer Portal Redesign",
    status: "in-progress",
    progress: 68,
    team: ["Sarah J.", "Mike C.", "Lisa W."],
    startDate: "2025-12-15",
    endDate: "2026-02-28",
    budget: "$125,000",
    tasksCompleted: 34,
    tasksTotal: 50,
    priority: "high"
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "in-progress",
    progress: 42,
    team: ["John S.", "Emily D.", "Tom B.", "Nina P."],
    startDate: "2026-01-02",
    endDate: "2026-04-15",
    budget: "$220,000",
    tasksCompleted: 21,
    tasksTotal: 50,
    priority: "high"
  },
  {
    id: "3",
    name: "Marketing Automation System",
    status: "planning",
    progress: 15,
    team: ["David L.", "Rachel G."],
    startDate: "2026-01-20",
    endDate: "2026-03-30",
    budget: "$85,000",
    tasksCompleted: 6,
    tasksTotal: 40,
    priority: "medium"
  },
  {
    id: "4",
    name: "Data Migration Project",
    status: "completed",
    progress: 100,
    team: ["Alex K.", "Mark T.", "Jennifer L."],
    startDate: "2025-11-01",
    endDate: "2026-01-05",
    budget: "$95,000",
    tasksCompleted: 38,
    tasksTotal: 38,
    priority: "high"
  },
  {
    id: "5",
    name: "Security Compliance Audit",
    status: "on-hold",
    progress: 35,
    team: ["Mike C.", "Nina P."],
    startDate: "2025-12-10",
    endDate: "2026-02-20",
    budget: "$65,000",
    tasksCompleted: 14,
    tasksTotal: 40,
    priority: "medium"
  },
];

const projectTimelineData = [
  { month: "Nov", planned: 2, actual: 2, completed: 1 },
  { month: "Dec", planned: 3, actual: 3, completed: 1 },
  { month: "Jan", planned: 5, actual: 5, completed: 1 },
  { month: "Feb", planned: 4, actual: 4, completed: 0 },
  { month: "Mar", planned: 3, actual: 0, completed: 0 },
  { month: "Apr", planned: 2, actual: 0, completed: 0 },
];

const resourceAllocation = [
  { department: "Engineering", allocated: 18, available: 5 },
  { department: "Design", allocated: 8, available: 2 },
  { department: "Marketing", allocated: 6, available: 4 },
  { department: "QA", allocated: 5, available: 3 },
];

const milestones = [
  { id: "1", project: "Customer Portal Redesign", milestone: "UI/UX Design Complete", dueDate: "2026-01-15", status: "completed" },
  { id: "2", project: "Mobile App Development", milestone: "Alpha Release", dueDate: "2026-02-01", status: "at-risk" },
  { id: "3", project: "Marketing Automation System", milestone: "Requirements Finalized", dueDate: "2026-01-25", status: "on-track" },
  { id: "4", project: "Customer Portal Redesign", milestone: "Backend Integration", dueDate: "2026-02-10", status: "on-track" },
];

export function ProjectManagement() {
  const [projects, setProjects] = useState<ProjectRow[]>(fallbackProjects);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      const orgId = parsedUser?.organizationId;
      if (!orgId) return;

      projectService.getProjectsByOrg(orgId)
        .then((response) => {
          const rows = response?.data || [];
          if (!Array.isArray(rows) || rows.length === 0) return;

          const mappedProjects = rows.map((item: any, index: number) => {
            const tasks = Array.isArray(item.task_projectData) ? item.task_projectData.length : Number(item.task_total || item.task_count || 0);
            const completed = Number(item.tasksCompleted || item.completedTasks || 0);
            const progress = Number.isFinite(Number(item.progress))
              ? Number(item.progress)
              : tasks > 0
                ? Math.min(100, Math.round((completed / tasks) * 100))
                : item.isComplete
                  ? 100
                  : 35;

            return {
              id: String(item.id ?? index + 1),
              name: item.title || item.project_name || item.projectTitle || "Project",
              status: item.isComplete ? "completed" : item.isHold ? "on-hold" : progress >= 80 ? "completed" : progress >= 40 ? "in-progress" : "planning",
              progress,
              team: Array.isArray(item.team_Assigned) ? item.team_Assigned : item.team_lead?.emp_name ? [item.team_lead.emp_name] : [],
              startDate: item.from_date || item.startDate || item.createdAt || new Date().toISOString(),
              endDate: item.to_date || item.endDate || item.createdAt || new Date().toISOString(),
              budget: item.budget ? `₹${item.budget}` : "$0",
              tasksCompleted: completed,
              tasksTotal: tasks || Math.max(completed, 1),
              priority: progress >= 80 ? "high" : progress >= 40 ? "medium" : "low",
            } satisfies ProjectRow;
          });

          setProjects(mappedProjects);
        })
        .catch((error) => {
          console.error("Failed to load organization projects", error);
        });
    } catch (error) {
      console.error("Failed to parse userData for projects", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">
            Track projects, tasks, milestones, and resource allocation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
 
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              37 of 48 team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Project Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78 days</div>
            <p className="text-xs text-muted-foreground">
              -12 days improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projects.map((project) => {
            const statusColors = {
              "in-progress": "bg-blue-100 text-blue-800",
              "planning": "bg-yellow-100 text-yellow-800",
              "completed": "bg-green-100 text-green-800",
              "on-hold": "bg-gray-100 text-gray-800",
            };

            const priorityColors = {
              high: "bg-red-100 text-red-800 border-red-300",
              medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
              low: "bg-green-100 text-green-800 border-green-300",
            };

            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle>{project.name}</CardTitle>
                        <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
                          {project.priority}
                        </Badge>
                      </div>
                      <CardDescription>
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-bold">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tasks</p>
                        <p className="font-bold">{project.tasksCompleted}/{project.tasksTotal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-bold">{project.team.length} members</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {project.team.map((member, idx) => {
                          const initials = member.split(' ').map(n => n[0]).join('');
                          return (
                            <Avatar key={idx} className="border-2 border-white h-8 w-8">
                              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">Update Status</Button>
                      <Button size="sm" variant="outline">View Tasks</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {milestones.map((milestone) => {
            const statusConfig = {
              "completed": { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
              "on-track": { color: "bg-blue-100 text-blue-800", icon: Clock },
              "at-risk": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
            };

            const config = statusConfig[milestone.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{milestone.milestone}</CardTitle>
                      <CardDescription>{milestone.project}</CardDescription>
                    </div>
                    <Badge className={config.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {milestone.status.replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(milestone.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Project</Button>
                      {milestone.status !== "completed" && (
                        <Button size="sm">Mark Complete</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Team allocation across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resourceAllocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
                  <Bar dataKey="available" fill="#10b981" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {resourceAllocation.map((dept, index) => {
              const total = dept.allocated + dept.available;
              const utilizationPercent = Math.round((dept.allocated / total) * 100);

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{dept.department}</CardTitle>
                      <Badge variant={utilizationPercent > 85 ? "destructive" : utilizationPercent > 70 ? "default" : "secondary"}>
                        {utilizationPercent}% Utilized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold">{total}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allocated</p>
                        <p className="text-xl font-bold">{dept.allocated}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="text-xl font-bold">{dept.available}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Planned vs actual project execution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned" />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                  <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={2} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
