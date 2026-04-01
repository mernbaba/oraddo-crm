import { ListChecks, Plus, Target, TrendingUp, Users, X, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Strategy {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  budget: string;
  roi: string;
  channels: string[];
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  objectives?: string;
  kpis?: string[];
}

export function MarketingStrategies() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [editFormData, setEditFormData] = useState<Strategy | null>(null);

  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 1,
      title: "Social Media Growth Strategy",
      description: "Increase engagement and followers across all platforms",
      status: "Active",
      progress: 75,
      budget: "₹25,000",
      roi: "+45%",
      channels: ["Facebook", "Instagram", "LinkedIn"],
      targetAudience: "Young professionals aged 25-40",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      objectives: "Grow follower base by 50%, increase engagement rate to 5%, generate 1000 leads",
      kpis: ["Follower Growth", "Engagement Rate", "Lead Generation", "Brand Awareness"],
    },
    {
      id: 2,
      title: "Content Marketing Excellence",
      description: "Create high-value content to drive organic traffic",
      status: "Active",
      progress: 60,
      budget: "₹18,000",
      roi: "+38%",
      channels: ["Blog", "YouTube", "Podcast"],
      targetAudience: "Business owners and decision makers",
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      objectives: "Publish 50 blog posts, create 24 videos, increase organic traffic by 200%",
      kpis: ["Content Output", "Organic Traffic", "Time on Page", "Conversion Rate"],
    },
    {
      id: 3,
      title: "Email Campaign Optimization",
      description: "Improve open rates and conversion through A/B testing",
      status: "Planning",
      progress: 30,
      budget: "₹12,000",
      roi: "+28%",
      channels: ["Email", "Newsletter"],
      targetAudience: "Existing customers and subscribers",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      objectives: "Achieve 25% open rate, 5% click-through rate, 2% conversion rate",
      kpis: ["Open Rate", "Click Rate", "Conversion Rate", "Unsubscribe Rate"],
    },
    {
      id: 4,
      title: "SEO Domination Plan",
      description: "Rank top 3 for primary keywords in 6 months",
      status: "Active",
      progress: 85,
      budget: "₹30,000",
      roi: "+52%",
      channels: ["Website", "Blog"],
      targetAudience: "Organic search users looking for our services",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      objectives: "Rank top 3 for 20 primary keywords, increase organic traffic by 300%",
      kpis: ["Keyword Rankings", "Organic Traffic", "Domain Authority", "Backlinks"],
    },
  ]);

  const stats = [
    { label: "Active Strategies", value: "8", change: "+3", gradient: "from-[#422462] to-[#5A4079]", icon: Target },
    { label: "Avg ROI", value: "42%", change: "+12%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
    { label: "Total Budget", value: "₹85K", change: "+15%", gradient: "from-[#937CB4] to-[#5A4079]", icon: Users },
    { label: "Campaigns", value: "24", change: "+6", gradient: "from-[#422462] to-[#937CB4]", icon: ListChecks },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-300";
      case "Planning": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Completed": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleViewStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setViewModalOpen(true);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setEditFormData({ ...strategy });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setStrategies(strategies.map(s => s.id === editFormData.id ? editFormData : s));
      setEditModalOpen(false);
      setEditFormData(null);
      setSelectedStrategy(null);
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <ListChecks className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Marketing Strategies</h2>
            <p className="text-[#5A4079]">Plan and execute marketing initiatives</p>
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Strategy
        </Button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative z-10">
                <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Icon className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#200B43] mb-2">{strategy.title}</h3>
                  <p className="text-sm text-[#5A4079] mb-3">{strategy.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(strategy.status)}`}>
                  {strategy.status}
                </span>
              </div>
 
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#5A4079]">Progress</span>
                  <span className="font-semibold text-[#422462]">{strategy.progress}%</span>
                </div>
                <div className="h-2 bg-[#F0E9FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#422462] to-[#937CB4] transition-all duration-500"
                    style={{ width: `${strategy.progress}%` }}
                  ></div>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#5A4079] mb-1">Budget</p>
                  <p className="text-lg font-semibold text-[#200B43]">{strategy.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A4079] mb-1">ROI</p>
                  <p className="text-lg font-semibold text-green-600">{strategy.roi}</p>
                </div>
              </div>
 
              <div>
                <p className="text-xs text-[#5A4079] mb-2">Channels</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.channels.map((channel, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 text-[#422462] border border-[#937CB4]/30"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
 
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#937CB4]/20">
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                  onClick={() => handleViewStrategy(strategy)}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
                  onClick={() => handleEditStrategy(strategy)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {selectedStrategy && (
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Strategy: ${selectedStrategy.title}`} size="lg">
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedStrategy.status)}`}>
                {selectedStrategy.status}
              </span>
            </div>
 
            <div className="p-4 rounded-lg bg-[#F0E9FF]/30 border border-[#937CB4]/20">
              <p className="text-[#5A4079]">{selectedStrategy.description}</p>
            </div>
 
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-[#5A4079]">Progress</span>
                <span className="font-semibold text-[#422462]">{selectedStrategy.progress}%</span>
              </div>
              <div className="h-3 bg-[#F0E9FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#422462] to-[#937CB4] transition-all duration-500"
                  style={{ width: `${selectedStrategy.progress}%` }}
                ></div>
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[#937CB4]/20 bg-white">
                <p className="text-sm text-[#5A4079] mb-1">Budget</p>
                <p className="text-2xl font-bold text-[#200B43]">{selectedStrategy.budget}</p>
              </div>
              <div className="p-4 rounded-lg border border-[#937CB4]/20 bg-white">
                <p className="text-sm text-[#5A4079] mb-1">ROI</p>
                <p className="text-2xl font-bold text-green-600">{selectedStrategy.roi}</p>
              </div>
            </div>
 
            <div>
              <Label className="text-sm font-medium text-[#422462] mb-2 block">Marketing Channels</Label>
              <div className="flex flex-wrap gap-2">
                {selectedStrategy.channels.map((channel, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 text-[#422462] border border-[#937CB4]/30"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
 
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#422462]">Target Audience</Label>
                  <p className="text-[#5A4079] mt-1">{selectedStrategy.targetAudience}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#422462]">Timeline</Label>
                  <p className="text-[#5A4079] mt-1">
                    {selectedStrategy.startDate} to {selectedStrategy.endDate}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#422462] mb-2 block">Objectives</Label>
                <p className="text-[#5A4079] p-3 rounded-lg bg-[#F0E9FF]/20 border border-[#937CB4]/10">
                  {selectedStrategy.objectives}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#422462] mb-2 block">Key Performance Indicators</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStrategy.kpis?.map((kpi, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-sm bg-white border border-[#937CB4]/20 text-[#422462]"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
 
      {selectedStrategy && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Strategy" size="lg">
          <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Strategy Title</Label>
                <Input
                  id="title"
                  value={editFormData?.title || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, title: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editFormData?.status || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, status: e.target.value })}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-md focus:border-[#422462] focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData?.description || ""}
                onChange={(e) => setEditFormData({ ...editFormData!, description: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  value={editFormData?.budget || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, budget: e.target.value })}
                  placeholder="₹25,000"
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="roi">ROI</Label>
                <Input
                  id="roi"
                  value={editFormData?.roi || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, roi: e.target.value })}
                  placeholder="+45%"
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData?.progress || 0}
                  onChange={(e) => setEditFormData({ ...editFormData!, progress: parseInt(e.target.value) || 0 })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editFormData?.startDate || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, startDate: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editFormData?.endDate || ""}
                  onChange={(e) => setEditFormData({ ...editFormData!, endDate: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={editFormData?.targetAudience || ""}
                onChange={(e) => setEditFormData({ ...editFormData!, targetAudience: e.target.value })}
                placeholder="Young professionals aged 25-40"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>

            <div>
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                value={editFormData?.objectives || ""}
                onChange={(e) => setEditFormData({ ...editFormData!, objectives: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
                rows={3}
                placeholder="List your strategy objectives..."
              />
            </div>

            <div>
              <Label htmlFor="channels">Marketing Channels (comma-separated)</Label>
              <Input
                id="channels"
                value={editFormData?.channels.join(", ") || ""}
                onChange={(e) => setEditFormData({ ...editFormData!, channels: e.target.value.split(",").map(c => c.trim()) })}
                placeholder="Facebook, Instagram, LinkedIn"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>

            <div>
              <Label htmlFor="kpis">KPIs (comma-separated)</Label>
              <Input
                id="kpis"
                value={editFormData?.kpis?.join(", ") || ""}
                onChange={(e) => setEditFormData({ ...editFormData!, kpis: e.target.value.split(",").map(k => k.trim()) })}
                placeholder="Follower Growth, Engagement Rate, Lead Generation"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleSaveEdit}
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
 
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Strategy" size="lg">
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Strategy Title</Label>
              <Input
                id="new-title"
                placeholder="Social Media Growth Strategy"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-status">Status</Label>
              <select
                id="new-status"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-md focus:border-[#422462] focus:outline-none"
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="new-description">Description</Label>
            <Textarea
              id="new-description"
              placeholder="Describe your marketing strategy..."
              className="border-[#937CB4]/30 focus:border-[#422462]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-budget">Budget</Label>
              <Input
                id="new-budget"
                placeholder="₹25,000"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-roi">ROI</Label>
              <Input
                id="new-roi"
                placeholder="+45%"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-progress">Progress (%)</Label>
              <Input
                id="new-progress"
                type="number"
                min="0"
                max="100"
                defaultValue="0"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-startDate">Start Date</Label>
              <Input
                id="new-startDate"
                type="date"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-endDate">End Date</Label>
              <Input
                id="new-endDate"
                type="date"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="new-targetAudience">Target Audience</Label>
            <Input
              id="new-targetAudience"
              placeholder="Young professionals aged 25-40"
              className="border-[#937CB4]/30 focus:border-[#422462]"
            />
          </div>

          <div>
            <Label htmlFor="new-objectives">Objectives</Label>
            <Textarea
              id="new-objectives"
              placeholder="List your strategy objectives..."
              className="border-[#937CB4]/30 focus:border-[#422462]"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="new-channels">Marketing Channels (comma-separated)</Label>
            <Input
              id="new-channels"
              placeholder="Facebook, Instagram, LinkedIn"
              className="border-[#937CB4]/30 focus:border-[#422462]"
            />
          </div>

          <div>
            <Label htmlFor="new-kpis">KPIs (comma-separated)</Label>
            <Input
              id="new-kpis"
              placeholder="Follower Growth, Engagement Rate, Lead Generation"
              className="border-[#937CB4]/30 focus:border-[#422462]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCreateModalOpen(false)}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
            >
              Create Strategy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}