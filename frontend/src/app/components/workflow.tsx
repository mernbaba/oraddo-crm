import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckCircle2, Circle, ArrowRight, Clock, AlertCircle } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  status: "completed" | "active" | "pending" | "blocked";
  assignee?: string;
  duration?: string;
  description: string;
}

interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Employee Onboarding",
    steps: [
      {
        id: "1-1",
        name: "Submit Documentation",
        status: "completed",
        assignee: "Sarah Johnson",
        duration: "2 days",
        description: "Collect and verify all required employee documents"
      },
      {
        id: "1-2",
        name: "Background Check",
        status: "completed",
        assignee: "HR Department",
        duration: "5 days",
        description: "Complete background verification process"
      },
      {
        id: "1-3",
        name: "Equipment Setup",
        status: "active",
        assignee: "Mike Chen",
        duration: "1 day",
        description: "Prepare workstation and assign equipment"
      },
      {
        id: "1-4",
        name: "System Access",
        status: "pending",
        assignee: "IT Department",
        duration: "1 day",
        description: "Create accounts and grant system access"
      },
      {
        id: "1-5",
        name: "Orientation & Training",
        status: "pending",
        assignee: "Sarah Johnson",
        duration: "3 days",
        description: "Conduct orientation and initial training"
      },
      {
        id: "1-6",
        name: "Review & Completion",
        status: "pending",
        duration: "1 day",
        description: "Final review and onboarding completion"
      }
    ]
  },
  {
    id: "2",
    name: "Invoice Processing",
    steps: [
      {
        id: "2-1",
        name: "Invoice Submission",
        status: "completed",
        assignee: "Vendor",
        duration: "1 day",
        description: "Vendor submits invoice through portal"
      },
      {
        id: "2-2",
        name: "Initial Review",
        status: "completed",
        assignee: "Emily Davis",
        duration: "2 days",
        description: "Verify invoice details and documentation"
      },
      {
        id: "2-3",
        name: "Manager Approval",
        status: "active",
        assignee: "Department Manager",
        duration: "2 days",
        description: "Manager reviews and approves invoice"
      },
      {
        id: "2-4",
        name: "Finance Review",
        status: "pending",
        assignee: "Finance Team",
        duration: "1 day",
        description: "Finance department final review"
      },
      {
        id: "2-5",
        name: "Payment Processing",
        status: "pending",
        assignee: "Accounts Payable",
        duration: "3 days",
        description: "Process payment to vendor"
      }
    ]
  },
  {
    id: "3",
    name: "Product Launch Approval",
    steps: [
      {
        id: "3-1",
        name: "Product Proposal",
        status: "completed",
        assignee: "Product Team",
        duration: "5 days",
        description: "Create and submit product proposal"
      },
      {
        id: "3-2",
        name: "Market Research",
        status: "completed",
        assignee: "Research Team",
        duration: "7 days",
        description: "Conduct market analysis and research"
      },
      {
        id: "3-3",
        name: "Budget Approval",
        status: "blocked",
        assignee: "Finance Director",
        duration: "3 days",
        description: "Review and approve budget allocation"
      },
      {
        id: "3-4",
        name: "Marketing Strategy",
        status: "pending",
        assignee: "Marketing Team",
        duration: "5 days",
        description: "Develop marketing and launch strategy"
      },
      {
        id: "3-5",
        name: "Legal Review",
        status: "pending",
        assignee: "Legal Team",
        duration: "4 days",
        description: "Legal compliance review"
      },
      {
        id: "3-6",
        name: "Executive Approval",
        status: "pending",
        assignee: "Executive Team",
        duration: "2 days",
        description: "Final executive approval"
      },
      {
        id: "3-7",
        name: "Launch",
        status: "pending",
        assignee: "Product Team",
        duration: "1 day",
        description: "Execute product launch"
      }
    ]
  }
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50 border-green-200",
    dotColor: "bg-green-600"
  },
  active: {
    icon: Circle,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    dotColor: "bg-blue-600"
  },
  pending: {
    icon: Clock,
    color: "text-gray-400 bg-gray-50 border-gray-200",
    dotColor: "bg-gray-300"
  },
  blocked: {
    icon: AlertCircle,
    color: "text-red-600 bg-red-50 border-red-200",
    dotColor: "bg-red-600"
  }
};

export function Workflow() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("1");
  const currentWorkflow = mockWorkflows.find(w => w.id === selectedWorkflow) || mockWorkflows[0];

  const completedSteps = currentWorkflow.steps.filter(s => s.status === "completed").length;
  const totalSteps = currentWorkflow.steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflow</h2>
          <p className="text-muted-foreground">
            Visualize and manage process workflows
          </p>
        </div>
        <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a workflow" />
          </SelectTrigger>
          <SelectContent>
            {mockWorkflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentWorkflow.name}</CardTitle>
              <CardDescription>
                {completedSteps} of {totalSteps} steps completed ({progress}%)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {progress}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentWorkflow.steps.map((step, index) => {
              const StatusIcon = statusConfig[step.status].icon;
              const isLastStep = index === currentWorkflow.steps.length - 1;

              return (
                <div key={step.id} className="relative">
                  <div className={`border rounded-lg p-4 ${statusConfig[step.status].color}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{step.name}</h4>
                            <p className="text-sm mt-1 opacity-80">{step.description}</p>
                          </div>
                          {step.duration && (
                            <Badge variant="secondary" className="ml-4">
                              {step.duration}
                            </Badge>
                          )}
                        </div>
                        
                        {step.assignee && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="opacity-70">Assigned to:</span>
                            <span className="font-medium">{step.assignee}</span>
                          </div>
                        )}

                        {step.status === "active" && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="default">
                              Complete Step
                            </Button>
                            <Button size="sm" variant="outline">
                              Add Note
                            </Button>
                          </div>
                        )}

                        {step.status === "blocked" && (
                          <div className="mt-3 p-3 bg-white rounded border border-red-200">
                            <p className="text-sm font-medium text-red-800">
                              ⚠️ Blocked: Awaiting budget approval from Finance Director
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isLastStep && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWorkflow.steps.reduce((acc, step) => {
                const days = parseInt(step.duration?.split(' ')[0] || '0');
                return acc + days;
              }, 0)} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated completion time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWorkflow.steps.find(s => s.status === "active")?.name || "None"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWorkflow.steps.some(s => s.status === "blocked") ? "Blocked" : 
               currentWorkflow.steps.every(s => s.status === "completed") ? "Completed" :
               "In Progress"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall workflow status
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
