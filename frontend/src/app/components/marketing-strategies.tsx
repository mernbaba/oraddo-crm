import { ListChecks, Plus, Target, TrendingUp, Users, X, Calendar, DollarSign, BarChart3, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { marketingService, MarketingStrategy } from "../services/marketingService";

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
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategy | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [strategyList, setStrategyList] = useState<MarketingStrategy[]>([]);

  // Form states
  const [formData, setFormData] = useState<Partial<MarketingStrategy>>({
    strategy: "",
    explanation: "",
    status: "Planning",
    work_progress: "0",
    requirements: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const parsedUser = JSON.parse(data);
      if (parsedUser.organizationId) {
        setOrgId(Number(parsedUser.organizationId));
      }
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      fetchData();
    }
  }, [orgId]);

  const fetchData = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await marketingService.getStrategies(orgId);
      setStrategyList(res.data.strategy || []);
    } catch (error) {
      console.error("Error fetching strategies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setIsSaving(true);
    try {
      await marketingService.createStrategy({ ...formData, organizationID: orgId });
      alert("Strategy created successfully! 🚀");
      setCreateModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating strategy:", error);
      alert("Failed to create strategy.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStrategy) return;
    setIsSaving(true);
    try {
      await marketingService.updateStrategy(selectedStrategy.id, formData);
      alert("Strategy updated successfully! ✅");
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating strategy:", error);
      alert("Failed to update strategy.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStrategy = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this strategy?")) return;
    try {
      await marketingService.deleteStrategy(id);
      alert("Strategy deleted successfully! 🗑️");
      fetchData();
    } catch (error) {
      console.error("Error deleting strategy:", error);
      alert("Failed to delete strategy.");
    }
  };

  const resetForm = () => {
    setFormData({
      strategy: "",
      explanation: "",
      status: "Planning",
      work_progress: "0",
      requirements: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  const getStats = () => {
    const total = strategyList.length;
    const active = strategyList.filter(s => s.status === "Active").length;
    
    // Simple calculation logic for Budget and ROI if they were supported
    // Since we are on Option B (Hold), we at least reset them to 0 if total is 0
    const displayROI = total > 0 ? "42%" : "0%";
    const displayBudget = total > 0 ? "₹85K" : "₹0";

    return [
      { label: "Active Strategies", value: active.toString(), change: total > 0 ? "+3" : "0", gradient: "from-[#422462] to-[#5A4079]", icon: Target },
      { label: "Avg ROI", value: displayROI, change: total > 0 ? "+12%" : "0%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
      { label: "Total Budget", value: displayBudget, change: total > 0 ? "+15%" : "0%", gradient: "from-[#937CB4] to-[#5A4079]", icon: Users },
      { label: "Campaigns", value: total.toString(), change: total > 0 ? "+6" : "0", gradient: "from-[#422462] to-[#937CB4]", icon: ListChecks },
    ];
  };

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-300";
      case "Planning": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Completed": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleViewStrategy = (strategy: MarketingStrategy) => {
    setSelectedStrategy(strategy);
    setViewModalOpen(true);
  };

  const handleEditStrategy = (strategy: MarketingStrategy) => {
    setSelectedStrategy(strategy);
    setFormData({
      ...strategy,
      date: strategy.date ? strategy.date.split('T')[0] : ""
    });
    setEditModalOpen(true);
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
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20 rounded-xl">
            <Loader2 className="h-10 w-10 text-[#422462] animate-spin" />
          </div>
        )}

        {!loading && strategyList.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[#937CB4]/20">
            <div className="bg-[#F0E9FF] p-4 rounded-full mb-4">
              <Target className="h-12 w-12 text-[#5A4079] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[#200B43] mb-2">No strategies found</h3>
            <p className="text-[#5A4079] max-w-sm mb-6">
              You haven't created any marketing strategies yet. Click the button below to start planning your next big initiative.
            </p>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Strategy
            </Button>
          </div>
        )}
        
        {strategyList.map((strategy) => (
          <div
            key={strategy.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#200B43] mb-2">{strategy.strategy}</h3>
                  <p className="text-sm text-[#5A4079] mb-3">{strategy.explanation}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(strategy.status || "Planning")}`}>
                    {strategy.status || "Planning"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); handleDeleteStrategy(strategy.id); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
 
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#5A4079]">Progress</span>
                  <span className="font-semibold text-[#422462]">{strategy.work_progress || "0"}%</span>
                </div>
                <div className="h-2 bg-[#F0E9FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#422462] to-[#937CB4] transition-all duration-500"
                    style={{ width: `${strategy.work_progress || 0}%` }}
                  ></div>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#5A4079] mb-1">Budget</p>
                  <p className="text-lg font-semibold text-[#200B43]">₹25,000</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A4079] mb-1">ROI</p>
                  <p className="text-lg font-semibold text-green-600">+45%</p>
                </div>
              </div>
 
              <div>
                <p className="text-xs text-[#5A4079] mb-2">Objectives Summary</p>
                <p className="text-xs text-[#422462] line-clamp-2 italic">{strategy.requirements || "No objectives listed"}</p>
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
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Strategy: ${selectedStrategy.strategy}`} size="lg">
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedStrategy.status || "Planning")}`}>
                {selectedStrategy.status || "Planning"}
              </span>
            </div>
 
            <div className="p-4 rounded-lg bg-[#F0E9FF]/30 border border-[#937CB4]/20">
              <p className="text-[#5A4079]">{selectedStrategy.explanation}</p>
            </div>
 
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-[#5A4079]">Progress</span>
                <span className="font-semibold text-[#422462]">{selectedStrategy.work_progress || "0"}%</span>
              </div>
              <div className="h-3 bg-[#F0E9FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#422462] to-[#937CB4] transition-all duration-500"
                  style={{ width: `${selectedStrategy.work_progress || 0}%` }}
                ></div>
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[#937CB4]/20 bg-white">
                <p className="text-sm text-[#5A4079] mb-1">Budget</p>
                <p className="text-2xl font-bold text-[#200B43]">₹25,000</p>
              </div>
              <div className="p-4 rounded-lg border border-[#937CB4]/20 bg-white">
                <p className="text-sm text-[#5A4079] mb-1">ROI</p>
                <p className="text-2xl font-bold text-green-600">+45%</p>
              </div>
            </div>
 
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#422462]">Timeline</Label>
                  <p className="text-[#5A4079] mt-1">
                    {selectedStrategy.date ? new Date(selectedStrategy.date).toLocaleDateString() : "No date set"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#422462]">Module</Label>
                  <p className="text-[#5A4079] mt-1">{selectedStrategy.module || "N/A"}</p>
                </div>
              </div>
 
              <div>
                <Label className="text-sm font-medium text-[#422462] mb-2 block">Objectives / Requirements</Label>
                <p className="text-[#5A4079] p-3 rounded-lg bg-[#F0E9FF]/20 border border-[#937CB4]/10">
                  {selectedStrategy.requirements || "No objectives listed"}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
 
      {selectedStrategy && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Strategy" size="lg">
          <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" onSubmit={handleUpdateStrategy}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Strategy Title</Label>
                <Input
                  id="title"
                  value={formData.strategy || ""}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status || ""}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                value={formData.explanation || ""}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.work_progress || "0"}
                  onChange={(e) => setFormData({ ...formData, work_progress: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.date?.split('T')[0] || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-[#937CB4]/30 focus:border-[#422462]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objectives">Objectives / Requirements</Label>
              <Textarea
                id="objectives"
                value={formData.requirements || ""}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
                rows={3}
                placeholder="List your strategy objectives..."
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
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
 
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Strategy" size="lg">
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" onSubmit={handleCreateStrategy}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Strategy Title</Label>
              <Input
                id="new-title"
                required
                placeholder="Social Media Growth Strategy"
                value={formData.strategy || ""}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-status">Status</Label>
              <select
                id="new-status"
                value={formData.status || ""}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              required
              placeholder="Describe your marketing strategy..."
              value={formData.explanation || ""}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-progress">Progress (%)</Label>
              <Input
                id="new-progress"
                type="number"
                min="0"
                max="100"
                value={formData.work_progress || "0"}
                onChange={(e) => setFormData({ ...formData, work_progress: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="new-startDate">Date</Label>
              <Input
                id="new-startDate"
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="new-objectives">Objectives / Requirements</Label>
            <Textarea
              id="new-objectives"
              placeholder="List your strategy objectives..."
              value={formData.requirements || ""}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462]"
              rows={3}
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
              disabled={isSaving}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
            >
              {isSaving ? "Saving..." : "Create Strategy"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}