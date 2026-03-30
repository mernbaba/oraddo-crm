import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Play, Pause, CheckCircle, Clock, AlertTriangle, Users, Calendar } from "lucide-react";

interface Process {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "pending";
  progress: number;
  assignedTo: string[];
  startDate: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  tasks: number;
  completedTasks: number;
}

const mockProcesses: Process[] = [
  {
    id: "1",
    name: "Employee Onboarding",
    description: "Complete onboarding process for new employees including documentation, training, and system setup",
    status: "active",
    progress: 65,
    assignedTo: ["Sarah Johnson", "Mike Chen"],
    startDate: "2026-01-05",
    dueDate: "2026-01-20",
    priority: "high",
    tasks: 12,
    completedTasks: 8
  },
  {
    id: "2",
    name: "Invoice Processing",
    description: "Automated invoice approval and payment workflow",
    status: "active",
    progress: 40,
    assignedTo: ["Emily Davis"],
    startDate: "2026-01-08",
    dueDate: "2026-01-15",
    priority: "medium",
    tasks: 8,
    completedTasks: 3
  },
  {
    id: "3",
    name: "Customer Support Ticket Resolution",
    description: "Handle and resolve customer support tickets through escalation workflow",
    status: "active",
    progress: 85,
    assignedTo: ["John Smith", "Lisa Wang", "Tom Brown"],
    startDate: "2026-01-03",
    dueDate: "2026-01-12",
    priority: "high",
    tasks: 15,
    completedTasks: 13
  },
  {
    id: "4",
    name: "Product Launch Approval",
    description: "Multi-stage approval process for new product launch",
    status: "pending",
    progress: 15,
    assignedTo: ["David Lee"],
    startDate: "2026-01-10",
    dueDate: "2026-02-01",
    priority: "high",
    tasks: 20,
    completedTasks: 3
  },
  {
    id: "5",
    name: "Quarterly Budget Review",
    description: "Review and approve department budgets for Q2",
    status: "paused",
    progress: 50,
    assignedTo: ["Rachel Green", "Mark Taylor"],
    startDate: "2025-12-28",
    dueDate: "2026-01-25",
    priority: "medium",
    tasks: 10,
    completedTasks: 5
  },
  {
    id: "6",
    name: "IT Security Audit",
    description: "Comprehensive security audit and compliance check",
    status: "completed",
    progress: 100,
    assignedTo: ["Alex Kumar", "Nina Patel"],
    startDate: "2025-12-15",
    dueDate: "2026-01-05",
    priority: "high",
    tasks: 18,
    completedTasks: 18
  },
];

const statusConfig = {
  active: { icon: Play, color: "bg-blue-500", label: "Active" },
  paused: { icon: Pause, color: "bg-yellow-500", label: "Paused" },
  completed: { icon: CheckCircle, color: "bg-green-500", label: "Completed" },
  pending: { icon: Clock, color: "bg-gray-500", label: "Pending" },
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300",
};

export function Processes() {
  const [processes] = useState<Process[]>(mockProcesses);
  const [filter, setFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProcesses = processes.filter(process => {
    if (filter === "all") return true;
    return process.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Processes</h2>
          <p className="text-muted-foreground">
            Manage and monitor your business processes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Process
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Process</DialogTitle>
              <DialogDescription>
                Define a new business process workflow
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Process Name</Label>
                <Input id="name" placeholder="Enter process name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the process" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mike">Mike Chen</SelectItem>
                      <SelectItem value="emily">Emily Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Process
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button 
          variant={filter === "active" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button 
          variant={filter === "pending" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button 
          variant={filter === "paused" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("paused")}
        >
          Paused
        </Button>
        <Button 
          variant={filter === "completed" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Process List */}
      <div className="grid gap-4">
        {filteredProcesses.map((process) => {
          const StatusIcon = statusConfig[process.status].icon;
          
          return (
            <Card key={process.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{process.name}</CardTitle>
                      <Badge variant="outline" className={priorityColors[process.priority]}>
                        {process.priority}
                      </Badge>
                    </div>
                    <CardDescription>{process.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusConfig[process.status].color}`} />
                    <span className="text-sm text-muted-foreground">
                      {statusConfig[process.status].label}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{process.completedTasks}/{process.tasks} tasks</span>
                    </div>
                    <Progress value={process.progress} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Assigned</p>
                        <p className="font-medium">{process.assignedTo.length} members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">{new Date(process.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Due</p>
                        <p className="font-medium">{new Date(process.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {process.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Pause className="mr-2 h-3 w-3" />
                        Pause
                      </Button>
                    )}
                    {process.status === "paused" && (
                      <Button variant="outline" size="sm">
                        <Play className="mr-2 h-3 w-3" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
