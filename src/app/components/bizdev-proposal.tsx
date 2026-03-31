import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";

export function BizDevProposal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);
  
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    companyName: "",
    clientName: "",
    requirements: "",
    timeline: "",
    resources: "",
    services: "",
    description: "",
    pricing: ""
  });
  const [isContentGenerated, setIsContentGenerated] = useState(false);

  const proposals = [
    { 
      id: "PRO-001", 
      companyName: "ProcessFlow Inc.",
      clientName: "Tech Corp", 
      requirements: "AI integration with existing systems, real-time data processing, machine learning model deployment",
      timeline: "6 months",
      resources: "3 AI Engineers, 2 Data Scientists, 1 Project Manager",
      services: "AI Integration, Machine Learning, Custom Development",
      description: "Complete AI integration solution with machine learning capabilities for enterprise-level automation",
      pricing: "₹125,000", 
      status: "Pending", 
      date: "2024-01-08"
    },
    { 
      id: "PRO-002", 
      companyName: "ProcessFlow Inc.",
      clientName: "Digital Solutions", 
      requirements: "Full cloud infrastructure migration, data security compliance, zero-downtime deployment",
      timeline: "4 months",
      resources: "2 Cloud Architects, 3 DevOps Engineers, 1 Security Specialist",
      services: "Cloud Migration, Infrastructure Setup, Security Implementation",
      description: "Full cloud migration and infrastructure setup with AWS/Azure deployment",
      pricing: "₹89,500", 
      status: "Approved", 
      date: "2024-01-07"
    },
    { 
      id: "PRO-003", 
      companyName: "ProcessFlow Inc.",
      clientName: "Future Systems", 
      requirements: "Enterprise security audit, penetration testing, security policy implementation",
      timeline: "5 months",
      resources: "2 Security Engineers, 1 Compliance Officer, 2 System Administrators",
      services: "Security Audit, Penetration Testing, Policy Implementation",
      description: "Enterprise-level security implementation with compliance certifications",
      pricing: "₹156,000", 
      status: "Draft", 
      date: "2024-01-06"
    },
    { 
      id: "PRO-004", 
      companyName: "ProcessFlow Inc.",
      clientName: "Global Enterprises", 
      requirements: "Real-time analytics dashboard, predictive modeling, data visualization",
      timeline: "7 months",
      resources: "3 Data Engineers, 2 Analysts, 1 UI/UX Designer",
      services: "Data Analytics, Dashboard Development, Predictive Modeling",
      description: "Advanced analytics and reporting system with AI-powered insights",
      pricing: "₹203,000", 
      status: "Approved", 
      date: "2024-01-05"
    },
    { 
      id: "PRO-005", 
      companyName: "ProcessFlow Inc.",
      clientName: "Smart Industries", 
      requirements: "IoT sensor deployment, data collection platform, monitoring dashboard",
      timeline: "3 months",
      resources: "2 IoT Specialists, 1 Backend Developer, 1 Hardware Engineer",
      services: "IoT Implementation, Sensor Integration, Platform Development",
      description: "IoT sensors and management platform for industrial automation",
      pricing: "₹98,750", 
      status: "Pending", 
      date: "2024-01-04"
    },
    { 
      id: "PRO-006", 
      companyName: "ProcessFlow Inc.",
      clientName: "Innovation Labs", 
      requirements: "Custom ML algorithms, model training infrastructure, API integration",
      timeline: "8 months",
      resources: "4 ML Engineers, 2 Data Scientists, 1 DevOps Engineer",
      services: "Machine Learning, Custom Algorithms, API Development",
      description: "Custom ML algorithms and training platform with auto-scaling capabilities",
      pricing: "₹175,000", 
      status: "Rejected", 
      date: "2024-01-03"
    },
  ];

  const filteredProposals = proposals.filter((proposal) => {
    const searchMatch = proposal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       proposal.services.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === "all" || proposal.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const handleViewProposal = (proposal: typeof proposals[0]) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const handleEditProposal = (proposal: typeof proposals[0]) => {
    setSelectedProposal(proposal);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Rejected": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const stats = [
    { label: "Total Proposals", value: "48", change: "+12%", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Total Value", value: "₹2.4M", change: "+18%", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Approved", value: "32", change: "+8%", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Pending", value: "10", change: "-5%", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const handleGenerateProposal = () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt to generate the proposal!");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {

      const promptLower = aiPrompt.toLowerCase();

      const extractedInfo = {
        companyName: "ProcessFlow Inc.",
        clientName: promptLower.includes("client") ? extractClientName(aiPrompt) : "Acme Corporation",
        requirements: generateRequirements(aiPrompt),
        timeline: extractTimeline(aiPrompt),
        resources: generateResources(aiPrompt),
        services: generateServices(aiPrompt),
        description: generateDescription(aiPrompt),
        pricing: calculatePricing(aiPrompt)
      };

      setGeneratedContent(extractedInfo);
      setIsContentGenerated(true);
      setIsGenerating(false);
    }, 2000);
  };

  const extractClientName = (prompt: string): string => {
    const clientMatch = prompt.match(/for\s+([A-Z][a-zA-Z\s&]+)/i);
    return clientMatch ? clientMatch[1].trim() : "Acme Corporation";
  };

  const extractTimeline = (prompt: string): string => {
    if (prompt.match(/\d+\s*(month|months)/i)) {
      const match = prompt.match(/(\d+)\s*(month|months)/i);
      return match ? `${match[1]} months` : "6 months";
    }
    if (prompt.match(/\d+\s*(week|weeks)/i)) {
      const match = prompt.match(/(\d+)\s*(week|weeks)/i);
      return match ? `${match[1]} weeks` : "12 weeks";
    }
    return "6 months";
  };

  const generateRequirements = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    const requirements = [];

    if (promptLower.includes("ai") || promptLower.includes("machine learning") || promptLower.includes("ml")) {
      requirements.push("AI/ML model development and integration");
      requirements.push("Data pipeline setup and optimization");
      requirements.push("Model training infrastructure");
    }
    if (promptLower.includes("cloud") || promptLower.includes("infrastructure")) {
      requirements.push("Cloud infrastructure setup and migration");
      requirements.push("Scalable architecture design");
      requirements.push("DevOps automation");
    }
    if (promptLower.includes("mobile") || promptLower.includes("app")) {
      requirements.push("Cross-platform mobile application development");
      requirements.push("API integration and backend services");
      requirements.push("User authentication and security");
    }
    if (promptLower.includes("web") || promptLower.includes("website") || promptLower.includes("dashboard")) {
      requirements.push("Responsive web application development");
      requirements.push("Modern UI/UX design implementation");
      requirements.push("Real-time data visualization");
    }
    if (promptLower.includes("security") || promptLower.includes("secure")) {
      requirements.push("Security audit and penetration testing");
      requirements.push("Compliance with industry standards");
      requirements.push("Data encryption and protection");
    }

    if (requirements.length === 0) {
      requirements.push("Custom software development");
      requirements.push("Technical consultation and strategy");
      requirements.push("Quality assurance and testing");
    }

    return requirements.join(", ");
  };

  const generateResources = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    const resources = [];

    if (promptLower.includes("ai") || promptLower.includes("ml") || promptLower.includes("machine learning")) {
      resources.push("3 AI/ML Engineers", "2 Data Scientists");
    }
    if (promptLower.includes("cloud") || promptLower.includes("devops")) {
      resources.push("2 Cloud Architects", "2 DevOps Engineers");
    }
    if (promptLower.includes("mobile")) {
      resources.push("2 Mobile Developers", "1 UI/UX Designer");
    }
    if (promptLower.includes("web") || promptLower.includes("dashboard")) {
      resources.push("3 Full Stack Developers", "1 UI/UX Designer");
    }
    if (promptLower.includes("security")) {
      resources.push("2 Security Engineers", "1 Compliance Officer");
    }

    resources.push("1 Project Manager", "1 QA Engineer");

    return resources.join(", ");
  };

  const generateServices = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    const services = [];

    if (promptLower.includes("ai") || promptLower.includes("ml")) {
      services.push("AI/ML Development");
    }
    if (promptLower.includes("cloud")) {
      services.push("Cloud Migration & Infrastructure");
    }
    if (promptLower.includes("mobile")) {
      services.push("Mobile App Development");
    }
    if (promptLower.includes("web") || promptLower.includes("dashboard")) {
      services.push("Web Application Development");
    }
    if (promptLower.includes("security")) {
      services.push("Security Implementation");
    }

    if (services.length === 0) {
      services.push("Custom Software Development");
    }

    services.push("Consulting & Support");

    return services.join(", ");
  };

  const generateDescription = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    let description = "Comprehensive solution delivering ";

    if (promptLower.includes("ai") || promptLower.includes("ml")) {
      description += "cutting-edge AI and machine learning capabilities with intelligent automation, ";
    }
    if (promptLower.includes("cloud")) {
      description += "scalable cloud infrastructure with high availability and performance optimization, ";
    }
    if (promptLower.includes("mobile")) {
      description += "intuitive cross-platform mobile applications with seamless user experience, ";
    }
    if (promptLower.includes("web") || promptLower.includes("dashboard")) {
      description += "modern web applications with real-time analytics and responsive design, ";
    }
    if (promptLower.includes("security")) {
      description += "enterprise-grade security with compliance and data protection, ";
    }

    description += "tailored to meet your specific business objectives and drive digital transformation.";

    return description;
  };

  const calculatePricing = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    let basePrice = 80000;

    if (promptLower.includes("ai") || promptLower.includes("ml")) basePrice += 50000;
    if (promptLower.includes("cloud")) basePrice += 30000;
    if (promptLower.includes("mobile")) basePrice += 40000;
    if (promptLower.includes("web") || promptLower.includes("dashboard")) basePrice += 35000;
    if (promptLower.includes("security")) basePrice += 45000;
    if (promptLower.includes("enterprise")) basePrice += 60000;

    const timelineMatch = prompt.match(/(\d+)\s*month/i);
    if (timelineMatch) {
      const months = parseInt(timelineMatch[1]);
      if (months > 6) basePrice += 30000;
      if (months > 9) basePrice += 50000;
    }

    return `₹${basePrice.toLocaleString('en-IN')}`;
  };

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Proposal saved successfully! ✅");
    setShowCreateModal(false);
    resetAIForm();
  };

  const handleDownloadProposal = () => {
    alert("Downloading proposal... 📄");
  };

  const resetAIForm = () => {
    setAiPrompt("");
    setIsContentGenerated(false);
    setGeneratedContent({
      companyName: "",
      clientName: "",
      requirements: "",
      timeline: "",
      resources: "",
      services: "",
      description: "",
      pricing: ""
    });
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <FileText className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Proposal Quotation</h2>
            <p className="text-[#5A4079]">Manage and track business proposals</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Proposal
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
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Proposal ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Client Name</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Services</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Pricing</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal, index) => (
                <tr
                  key={proposal.id}
                  className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-[#422462]">{proposal.id}</td>
                  <td className="p-4 text-sm text-[#200B43]">{proposal.clientName}</td>
                  <td className="p-4 text-sm text-[#200B43]">{proposal.services}</td>
                  <td className="p-4 text-sm font-semibold text-[#422462]">{proposal.pricing}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#5A4079]">{proposal.date}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleViewProposal(proposal)}>
                        <Eye className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleEditProposal(proposal)}>
                        <Edit className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Download className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetAIForm(); }} title="Create New Proposal with AI" size="lg">
        <form onSubmit={handleSaveProposal} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* AI Prompt Section */}
          {!isContentGenerated && (
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-[#200B43]">AI Proposal Generator</h3>
                  <p className="text-xs text-[#5A4079]">Describe your project and let AI create a professional proposal</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Describe Your Project *
                </label>
                <textarea
                  rows={5}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462] focus:border-transparent resize-none text-[#200B43]"
                  placeholder="Example: Create a proposal for Tech Corp requiring AI integration and cloud migration over 6 months with enterprise security features..."
                  disabled={isGenerating}
                />
                <p className="text-xs text-[#5A4079] mt-2">
                  💡 Tip: Include client name, services needed, timeline, and any specific requirements
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGenerateProposal}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Proposal...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Proposal with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {isContentGenerated && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Proposal generated successfully! You can edit any field before saving.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Proposal ID</label>
                  <input
                    type="text"
                    defaultValue="PRO-007"
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Company Name</label>
                  <input
                    type="text"
                    value={generatedContent.companyName}
                    onChange={(e) => setGeneratedContent({...generatedContent, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Client Name</label>
                  <input
                    type="text"
                    value={generatedContent.clientName}
                    onChange={(e) => setGeneratedContent({...generatedContent, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Requirements</label>
                  <textarea
                    rows={3}
                    value={generatedContent.requirements}
                    onChange={(e) => setGeneratedContent({...generatedContent, requirements: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Timeline</label>
                  <input
                    type="text"
                    value={generatedContent.timeline}
                    onChange={(e) => setGeneratedContent({...generatedContent, timeline: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Resources</label>
                  <input
                    type="text"
                    value={generatedContent.resources}
                    onChange={(e) => setGeneratedContent({...generatedContent, resources: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Services</label>
                  <input
                    type="text"
                    value={generatedContent.services}
                    onChange={(e) => setGeneratedContent({...generatedContent, services: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={generatedContent.description}
                    onChange={(e) => setGeneratedContent({...generatedContent, description: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Pricing</label>
                  <input
                    type="text"
                    value={generatedContent.pricing}
                    onChange={(e) => setGeneratedContent({...generatedContent, pricing: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsContentGenerated(false);
                    setGeneratedContent({
                      companyName: "",
                      clientName: "",
                      requirements: "",
                      timeline: "",
                      resources: "",
                      services: "",
                      description: "",
                      pricing: ""
                    });
                  }}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate with Different Prompt
                </Button>
              </div>
            </div>
          )}

          {isContentGenerated && (
            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { 
                  setShowCreateModal(false); 
                  resetAIForm(); 
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleDownloadProposal}
                className="border-[#422462]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#422462] to-[#5A4079]"
              >
                Save Proposal
              </Button>
            </div>
          )}
        </form>
      </Modal>

      {selectedProposal && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`Proposal: ${selectedProposal.id}`} size="lg">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Company Name</label>
                <p className="text-[#200B43] font-medium">{selectedProposal.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Client Name</label>
                <p className="text-[#200B43] font-medium">{selectedProposal.clientName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Pricing</label>
                <p className="text-2xl font-bold gradient-text">{selectedProposal.pricing}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Status</label>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProposal.status)}`}>
                    {selectedProposal.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Timeline</label>
                <p className="text-[#200B43] font-medium">{selectedProposal.timeline}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Date</label>
                <p className="text-[#200B43] font-medium">{selectedProposal.date}</p>
              </div>
            </div>
            
            <div className="border-t border-[#937CB4]/20 pt-4">
              <label className="text-sm font-medium text-[#5A4079]">Services</label>
              <p className="text-[#200B43] mt-1">{selectedProposal.services}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079]">Requirements</label>
              <p className="text-[#200B43] mt-1">{selectedProposal.requirements}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079]">Resources</label>
              <p className="text-[#200B43] mt-1">{selectedProposal.resources}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079]">Description</label>
              <p className="text-[#200B43] mt-1">{selectedProposal.description}</p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedProposal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Proposal" size="lg">
          <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Proposal ID</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.id}
                  readOnly
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.companyName}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Client Name</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.clientName}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Requirements</label>
                <textarea
                  rows={3}
                  defaultValue={selectedProposal.requirements}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Timeline</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.timeline}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
                <select 
                  defaultValue={selectedProposal.status}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Resources</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.resources}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Services</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.services}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                <textarea
                  rows={4}
                  defaultValue={selectedProposal.description}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Pricing</label>
                <input
                  type="text"
                  defaultValue={selectedProposal.pricing}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Date</label>
                <input
                  type="date"
                  defaultValue={selectedProposal.date}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-[#422462] to-[#5A4079]">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}