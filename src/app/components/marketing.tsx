import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, Eye, MousePointerClick, Mail, Share2, Plus, BarChart2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const trafficData = [
  { date: "Jan 1", organic: 4200, paid: 1800, social: 2400, direct: 1500 },
  { date: "Jan 2", organic: 4500, paid: 2100, social: 2600, direct: 1600 },
  { date: "Jan 3", organic: 4100, paid: 1900, social: 2200, direct: 1400 },
  { date: "Jan 4", organic: 4800, paid: 2300, social: 2800, direct: 1700 },
  { date: "Jan 5", organic: 5200, paid: 2500, social: 3100, direct: 1800 },
  { date: "Jan 6", organic: 5000, paid: 2200, social: 2900, direct: 1650 },
  { date: "Jan 7", organic: 5500, paid: 2700, social: 3300, direct: 1900 },
];

const campaignData = [
  { name: "Email Q1 Campaign", status: "active", impressions: 125000, clicks: 8750, conversions: 342, budget: "$5,000", roi: "285%" },
  { name: "Social Media Ads", status: "active", impressions: 285000, clicks: 12450, conversions: 598, budget: "$8,500", roi: "312%" },
  { name: "Content Marketing", status: "active", impressions: 95000, clicks: 6200, conversions: 285, budget: "$3,200", roi: "245%" },
  { name: "PPC Campaign", status: "paused", impressions: 158000, clicks: 9800, conversions: 425, budget: "$6,800", roi: "298%" },
  { name: "Influencer Partnership", status: "active", impressions: 420000, clicks: 18900, conversions: 856, budget: "$12,000", roi: "378%" },
];

const channelData = [
  { name: "Organic Search", value: 35, color: "#10b981" },
  { name: "Paid Ads", value: 25, color: "#3b82f6" },
  { name: "Social Media", value: 22, color: "#8b5cf6" },
  { name: "Email", value: 12, color: "#f59e0b" },
  { name: "Direct", value: 6, color: "#ef4444" },
];

const contentPerformance = [
  { type: "Blog Posts", published: 24, views: 45600, engagement: 4.2 },
  { type: "Videos", published: 8, views: 89200, engagement: 7.8 },
  { type: "Infographics", published: 12, views: 32400, engagement: 5.6 },
  { type: "Case Studies", published: 6, views: 18900, engagement: 8.2 },
  { type: "Webinars", published: 4, views: 12500, engagement: 9.1 },
];

export function Marketing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
          <p className="text-muted-foreground">
            Campaign management, analytics, and content performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.08M</div>
            <p className="text-xs text-muted-foreground">
              +24% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,506</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">304%</div>
            <p className="text-xs text-muted-foreground">
              +28% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaignData.map((campaign, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>Budget: {campaign.budget} • ROI: {campaign.roi}</CardDescription>
                  </div>
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                    <p className="text-xl font-bold">{campaign.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="text-xl font-bold">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-xl font-bold">{campaign.conversions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CTR</p>
                    <p className="text-xl font-bold">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">Edit Campaign</Button>
                  {campaign.status === "paused" && (
                    <Button size="sm" variant="outline">Resume</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Daily traffic by source over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="organic" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="paid" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="direct" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Traffic share by marketing channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance by Type</CardTitle>
              <CardDescription>Engagement metrics across content formats</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={contentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="views" fill="#3b82f6" name="Views" />
                  <Bar yAxisId="right" dataKey="engagement" fill="#10b981" name="Engagement Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Webinars</div>
                <p className="text-xs text-muted-foreground mt-1">
                  9.1 engagement score
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Most Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Videos</div>
                <p className="text-xs text-muted-foreground mt-1">
                  89,200 total views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Most Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Blog Posts</div>
                <p className="text-xs text-muted-foreground mt-1">
                  24 posts this month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
