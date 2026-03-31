import { CheckCircle, Calendar, Users, TrendingUp, Sparkles, Award, Plus, X, Search, Filter, Download, Eye, Edit2, Trash2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface Project {
  id: number;
  name: string;
  client: string;
  completedDate: string;
  duration: string;
  budget: string;
  teamSize: number;
  rating: number;
  deliverables: number;
  description?: string;
  status: string;
}

export function ProjectCompleted() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "E-Commerce Platform Redesign",
      client: "Tech Corp",
      completedDate: "2024-01-05",
      duration: "3 months",
      budget: "$125,000",
      teamSize: 8,
      rating: 5,
      deliverables: 24,
      status: "Completed",
      description: "Complete redesign of e-commerce platform with modern UI/UX"
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "Digital Solutions",
      completedDate: "2023-12-28",
      duration: "4 months",
      budget: "$98,500",
      teamSize: 6,
      rating: 4.5,
      deliverables: 18,
      status: "Completed",
      description: "Cross-platform mobile application with advanced features"
    },
    {
      id: 3,
      name: "Cloud Infrastructure Migration",
      client: "Future Systems",
      completedDate: "2023-12-15",
      duration: "2 months",
      budget: "$156,000",
      teamSize: 10,
      rating: 5,
      deliverables: 32,
      status: "Completed",
      description: "Migration of legacy systems to cloud infrastructure"
    },
    {
      id: 4,
      name: "Data Analytics Dashboard",
      client: "Global Enterprises",
      completedDate: "2023-12-10",
      duration: "2.5 months",
      budget: "$87,200",
      teamSize: 5,
      rating: 4,
      deliverables: 15,
      status: "Completed",
      description: "Business intelligence dashboard with real-time analytics"
    },
    {
      id: 5,
      name: "CRM System Implementation",
      client: "Smart Industries",
      completedDate: "2023-11-30",
      duration: "5 months",
      budget: "$203,000",
      teamSize: 12,
      rating: 5,
      deliverables: 28,
      status: "Completed",
      description: "Enterprise CRM system with custom integrations"
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    completedDate: "",
    duration: "",
    budget: "",
    teamSize: 1,
    rating: 5,
    deliverables: 0,
    description: "",
    status: "Completed"
  });

  // Calculate stats
  const totalRevenue = projects.reduce((sum, p) => {
    const budget = parseFloat(p.budget.replace(/[$,]/g, ''));
    return sum + budget;
  }, 0);

  const avgRating = projects.length > 0 
    ? (projects.reduce((sum, p) => sum + p.rating, 0) / projects.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Total Completed", value: projects.length.toString(), change: "+24", gradient: "from-[#422462] to-[#5A4079]", icon: CheckCircle },
    { label: "Total Revenue", value: `$${(totalRevenue / 1000000).toFixed(1)}M`, change: "+32%", gradient: "from-[#5A4079] to-[#937CB4]", icon: TrendingUp },
    { label: "Avg Rating", value: avgRating, change: "+0.3", gradient: "from-[#937CB4] to-[#5A4079]", icon: Award },
    { label: "This Quarter", value: "42", change: "+18%", gradient: "from-[#422462] to-[#937CB4]", icon: Calendar },
  ];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || Math.floor(project.rating) === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      client: "",
      completedDate: "",
      duration: "",
      budget: "",
      teamSize: 1,
      rating: 5,
      deliverables: 0,
      description: "",
      status: "Completed"
    });
  };

  // Add project
  const handleAddProject = () => {
    if (!formData.name.trim() || !formData.client.trim()) {
      alert("Please fill in required fields");
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: formData.name,
      client: formData.client,
      completedDate: formData.completedDate || new Date().toISOString().split('T')[0],
      duration: formData.duration,
      budget: formData.budget,
      teamSize: formData.teamSize,
      rating: formData.rating,
      deliverables: formData.deliverables,
      description: formData.description,
      status: formData.status
    };

    setProjects([newProject, ...projects]);
    resetForm();
    setShowAddModal(false);
  };

  // Update project
  const handleUpdateProject = () => {
    if (!editingProject || !formData.name.trim() || !formData.client.trim()) {
      alert("Please fill in required fields");
      return;
    }

    setProjects(projects.map(project =>
      project.id === editingProject.id
        ? {
            ...project,
            name: formData.name,
            client: formData.client,
            completedDate: formData.completedDate,
            duration: formData.duration,
            budget: formData.budget,
            teamSize: formData.teamSize,
            rating: formData.rating,
            deliverables: formData.deliverables,
            description: formData.description,
            status: formData.status
          }
        : project
    ));

    resetForm();
    setEditingProject(null);
    setShowAddModal(false);
  };

  // Delete project
  const handleDeleteProject = (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(project => project.id !== projectId));
      setShowDetailModal(false);
    }
  };

  // Open edit modal
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client: project.client,
      completedDate: project.completedDate,
      duration: project.duration,
      budget: project.budget,
      teamSize: project.teamSize,
      rating: project.rating,
      deliverables: project.deliverables,
      description: project.description || "",
      status: project.status
    });
    setShowAddModal(true);
  };

  // Open detail modal
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  // Export report
  const handleExportReport = () => {
    const csvContent = [
      ["Project Name", "Client", "Completed Date", "Duration", "Budget", "Team Size", "Rating", "Deliverables"],
      ...projects.map(p => [p.name, p.client, p.completedDate, p.duration, p.budget, p.teamSize, p.rating, p.deliverables])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "completed-projects-report.csv";
    a.click();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="text-xs text-[#5A4079] ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <CheckCircle className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Completed Projects</h2>
            <p className="text-[#5A4079]">Successfully delivered projects archive</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
            onClick={() => {
              resetForm();
              setEditingProject(null);
              setShowAddModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <Input 
            placeholder="Search projects or clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[#937CB4]/30"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-48 border-[#937CB4]/30">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
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

      {/* Completed Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-xl rounded-xl border border-[#937CB4]/20">
            <CheckCircle className="h-12 w-12 text-[#937CB4] mx-auto mb-3" />
            <p className="text-[#5A4079]">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#200B43]">{project.name}</h3>
                        <p className="text-sm text-[#5A4079]">{project.client}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(project.rating)}
                    <p className="text-xs text-[#5A4079] mt-1">Client Rating</p>
                  </div>
                </div>

                {/* Project Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[#5A4079] mb-1">Completed</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#422462]" />
                      <p className="text-sm font-semibold text-[#200B43]">{project.completedDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079] mb-1">Duration</p>
                    <p className="text-sm font-semibold text-[#200B43]">{project.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079] mb-1">Budget</p>
                    <p className="text-sm font-semibold text-[#422462]">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079] mb-1">Team Size</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-[#422462]" />
                      <p className="text-sm font-semibold text-[#200B43]">{project.teamSize}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#5A4079] mb-1">Deliverables</p>
                    <p className="text-sm font-semibold text-[#200B43]">{project.deliverables}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#937CB4]/20">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                    onClick={() => handleViewProject(project)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit2 className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                  <div className="flex-1"></div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="sticky top-0 bg-gradient-to-r from-[#200B43] to-[#422462] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {editingProject ? "Edit Project" : "Add Completed Project"}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Project Name *</label>
                <Input 
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Client Name *</label>
                <Input 
                  placeholder="Enter client name"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="border-[#937CB4]/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#422462] mb-2">Description</label>
                <Textarea 
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border-[#937CB4]/30 min-h-[100px]"
                />
              </div>

              {/* Row 1: Completed Date & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Completed Date</label>
                  <Input 
                    type="date"
                    value={formData.completedDate}
                    onChange={(e) => setFormData({...formData, completedDate: e.target.value})}
                    className="border-[#937CB4]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Duration</label>
                  <Input 
                    placeholder="e.g., 3 months"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="border-[#937CB4]/30"
                  />
                </div>
              </div>

              {/* Row 2: Budget & Team Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Budget</label>
                  <Input 
                    placeholder="e.g., $125,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="border-[#937CB4]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Team Size</label>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value) || 1})}
                    className="border-[#937CB4]/30"
                  />
                </div>
              </div>

              {/* Row 3: Rating & Deliverables */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Client Rating</label>
                  <Select 
                    value={formData.rating.toString()} 
                    onValueChange={(value) => setFormData({...formData, rating: parseFloat(value)})}
                  >
                    <SelectTrigger className="border-[#937CB4]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5.0)</SelectItem>
                      <SelectItem value="4.5">⭐⭐⭐⭐✨ (4.5)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4.0)</SelectItem>
                      <SelectItem value="3.5">⭐⭐⭐✨ (3.5)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3.0)</SelectItem>
                      <SelectItem value="2.5">⭐⭐✨ (2.5)</SelectItem>
                      <SelectItem value="2">⭐⭐ (2.0)</SelectItem>
                      <SelectItem value="1.5">⭐✨ (1.5)</SelectItem>
                      <SelectItem value="1">⭐ (1.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#422462] mb-2">Deliverables</label>
                  <Input 
                    type="number"
                    min="0"
                    value={formData.deliverables}
                    onChange={(e) => setFormData({...formData, deliverables: parseInt(e.target.value) || 0})}
                    className="border-[#937CB4]/30"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="border-[#937CB4]/30"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43]"
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                >
                  {editingProject ? "Update Project" : "Add Project"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[60]">
            <div className="sticky top-0 bg-gradient-to-r from-[#200B43] to-[#422462] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedProject.name}</h3>
                    <p className="text-white/80">{selectedProject.client}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <Calendar className="h-5 w-5 text-[#422462] mx-auto mb-2" />
                  <p className="text-xs text-[#5A4079] mb-1">Completed</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedProject.completedDate}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <Users className="h-5 w-5 text-[#422462] mx-auto mb-2" />
                  <p className="text-xs text-[#5A4079] mb-1">Team Size</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedProject.teamSize}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <TrendingUp className="h-5 w-5 text-[#422462] mx-auto mb-2" />
                  <p className="text-xs text-[#5A4079] mb-1">Budget</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedProject.budget}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-white border border-[#937CB4]/20">
                  <FileText className="h-5 w-5 text-[#422462] mx-auto mb-2" />
                  <p className="text-xs text-[#5A4079] mb-1">Deliverables</p>
                  <p className="text-sm font-bold text-[#422462]">{selectedProject.deliverables}</p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-3">Client Rating</h4>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-200">
                  {renderStars(selectedProject.rating)}
                  <span className="text-2xl font-bold text-yellow-600">{selectedProject.rating}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-3">Project Description</h4>
                <p className="text-sm text-[#5A4079] bg-[#F0E9FF]/30 p-4 rounded-xl border border-[#937CB4]/20">
                  {selectedProject.description || "No description provided"}
                </p>
              </div>

              {/* Project Details */}
              <div>
                <h4 className="text-sm font-semibold text-[#422462] mb-3">Project Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F0E9FF]/30 rounded-xl border border-[#937CB4]/20">
                    <p className="text-xs text-[#5A4079] mb-1">Duration</p>
                    <p className="text-sm font-semibold text-[#200B43]">{selectedProject.duration}</p>
                  </div>
                  <div className="p-4 bg-[#F0E9FF]/30 rounded-xl border border-[#937CB4]/20">
                    <p className="text-xs text-[#5A4079] mb-1">Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-3 pt-4 border-t border-[#937CB4]/20">
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteProject(selectedProject.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    className="border-[#937CB4]/30"
                    onClick={() => {
                      handleEditProject(selectedProject);
                      setShowDetailModal(false);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#200B43] to-[#422462] text-white hover:from-[#1A0936] hover:to-[#200B43]"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
