import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, DollarSign, Target, Users, Calendar, BarChart3, Plus } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const pipelineData = [
  { stage: "Prospecting", deals: 28, value: 420000 },
  { stage: "Qualification", deals: 18, value: 360000 },
  { stage: "Proposal", deals: 12, value: 540000 },
  { stage: "Negotiation", deals: 8, value: 680000 },
  { stage: "Closed Won", deals: 15, value: 1200000 },
];

const revenueData = [
  { month: "Jan", actual: 145000, target: 150000 },
  { month: "Feb", actual: 158000, target: 150000 },
  { month: "Mar", actual: 142000, target: 160000 },
  { month: "Apr", actual: 175000, target: 170000 },
  { month: "May", actual: 168000, target: 175000 },
  { month: "Jun", actual: 195000, target: 180000 },
];

const activeDeals = [
  { id: "1", company: "TechCorp Industries", value: "₹125,000", stage: "Negotiation", probability: 75, contact: "John Smith", closeDate: "2026-01-25" },
  { id: "2", company: "Global Solutions Ltd", value: "₹89,000", stage: "Proposal", probability: 60, contact: "Sarah Johnson", closeDate: "2026-02-10" },
  { id: "3", company: "Innovation Partners", value: "₹210,000", stage: "Qualification", probability: 45, contact: "Mike Chen", closeDate: "2026-02-28" },
  { id: "4", company: "Enterprise Systems", value: "₹156,000", stage: "Negotiation", probability: 80, contact: "Emily Davis", closeDate: "2026-01-30" },
  { id: "5", company: "Digital Ventures", value: "₹98,000", stage: "Proposal", probability: 55, contact: "Tom Brown", closeDate: "2026-02-15" },
];

export function BusinessDevelopment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Development</h2>
          <p className="text-muted-foreground">
            Manage sales pipeline, partnerships, and revenue growth
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3.2M</div>
            <p className="text-xs text-muted-foreground">
              +18% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81</div>
            <p className="text-xs text-muted-foreground">
              12 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.3%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹39.5K</div>
            <p className="text-xs text-muted-foreground">
              +₹2.3K from average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Active Deals</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline by Stage</CardTitle>
                <CardDescription>Deal count and value across pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="deals" fill="#3b82f6" name="Number of Deals" />
                    <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Health</CardTitle>
                <CardDescription>Key metrics and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Prospecting → Qualification</span>
                      <span className="font-medium">64%</span>
                    </div>
                    <Progress value={64} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Qualification → Proposal</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Proposal → Negotiation</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Negotiation → Closed Won</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Conversion Rate</span>
                      <span className="text-2xl font-bold text-green-600">67.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="grid gap-4">
            {activeDeals.map((deal) => (
              <Card key={deal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{deal.company}</CardTitle>
                      <CardDescription>Contact: {deal.contact}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {deal.value}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Stage</p>
                        <p className="font-medium">{deal.stage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Probability</p>
                        <p className="font-medium">{deal.probability}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Close Date</p>
                        <p className="font-medium">{new Date(deal.closeDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Deal Progress</span>
                        <span className="font-medium">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Update Status</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Schedule Follow-up</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
              <CardDescription>Monthly revenue performance against targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Target Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}