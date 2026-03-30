import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Calendar, User, Flag, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Task {
  id: string;
  title: string;
  description: string;
  processName: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "review" | "done";
  dueDate: string;
  comments: number;
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete background check documentation",
    description: "Verify and submit background check forms for new hire",
    processName: "Employee Onboarding",
    assignee: "Sarah Johnson",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-01-12",
    comments: 3,
    completed: false
  },
  {
    id: "2",
    title: "Review invoice #INV-2401",
    description: "Review and approve vendor invoice for office supplies",
    processName: "Invoice Processing",
    assignee: "Emily Davis",
    priority: "medium",
    status: "review",
    dueDate: "2026-01-11",
    comments: 1,
    completed: false
  },
  {
    id: "3",
    title: "Resolve customer ticket #4523",
    description: "Address customer complaint about delayed shipment",
    processName: "Customer Support Ticket Resolution",
    assignee: "John Smith",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-01-10",
    comments: 5,
    completed: false
  },
  {
    id: "4",
    title: "Setup workstation and equipment",
    description: "Prepare desk, computer, and necessary equipment for new employee",
    processName: "Employee Onboarding",
    assignee: "Mike Chen",
    priority: "medium",
    status: "done",
    dueDate: "2026-01-08",
    comments: 0,
    completed: true
  },
  {
    id: "5",
    title: "Schedule orientation meeting",
    description: "Book conference room and send calendar invites for orientation",
    processName: "Employee Onboarding",
    assignee: "Sarah Johnson",
    priority: "medium",
    status: "todo",
    dueDate: "2026-01-15",
    comments: 0,
    completed: false
  },
  {
    id: "6",
    title: "Process payment for INV-2398",
    description: "Submit payment for approved invoice",
    processName: "Invoice Processing",
    assignee: "Emily Davis",
    priority: "low",
    status: "todo",
    dueDate: "2026-01-18",
    comments: 2,
    completed: false
  },
  {
    id: "7",
    title: "Marketing approval for product launch",
    description: "Get final marketing material approval from CMO",
    processName: "Product Launch Approval",
    assignee: "David Lee",
    priority: "high",
    status: "review",
    dueDate: "2026-01-14",
    comments: 8,
    completed: false
  },
  {
    id: "8",
    title: "Update customer on ticket resolution",
    description: "Send follow-up email confirming issue resolution",
    processName: "Customer Support Ticket Resolution",
    assignee: "Lisa Wang",
    priority: "medium",
    status: "done",
    dueDate: "2026-01-09",
    comments: 1,
    completed: true
  },
];

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300",
};

const statusColors = {
  "todo": "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "review": "bg-purple-100 text-purple-800",
  "done": "bg-green-100 text-green-800",
};

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? "done" : "in-progress" }
        : task
    ));
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const initials = task.assignee.split(' ').map(n => n[0]).join('');
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleTaskComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <CardTitle className={`text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{task.processName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{task.assignee}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>

              {task.comments > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task.comments}</span>
                </div>
              )}
            </div>

            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage and track individual tasks across all processes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to a process workflow
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" placeholder="Enter task title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea id="taskDescription" placeholder="Describe the task" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="process">Process</Label>
                <Select>
                  <SelectTrigger id="process">
                    <SelectValue placeholder="Select process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Employee Onboarding</SelectItem>
                    <SelectItem value="invoice">Invoice Processing</SelectItem>
                    <SelectItem value="support">Customer Support Ticket Resolution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskPriority">Priority</Label>
                  <Select>
                    <SelectTrigger id="taskPriority">
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
                  <Label htmlFor="taskAssignee">Assign To</Label>
                  <Select>
                    <SelectTrigger id="taskAssignee">
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
              <div className="grid gap-2">
                <Label htmlFor="taskDueDate">Due Date</Label>
                <Input id="taskDueDate" type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="todo" className="space-y-3">
          {getTasksByStatus("todo").map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3">
          {getTasksByStatus("in-progress").map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="review" className="space-y-3">
          {getTasksByStatus("review").map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="done" className="space-y-3">
          {getTasksByStatus("done").map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
