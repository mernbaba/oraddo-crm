import { Receipt, Plus, Search, Filter, Download, Send, Eye, Sparkles, DollarSign, Edit, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";

export function BizDevInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  // AI Generation States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    companyName: "",
    companyBillingDetails: "",
    clientName: "",
    clientBillingDetails: "",
    service: "",
    description: "",
    paymentType: "",
    subtotal: "",
    gstPercentage: "",
    gstCharges: "",
    totalAmount: ""
  });
  const [isContentGenerated, setIsContentGenerated] = useState(false);

  const invoices = [
    { 
      id: "INV-2024-001",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Tech Corp", 
      clientBillingDetails: "456 Business Ave, New York, NY 10001 | Tax ID: 98-7654321",
      service: "AI Integration System",
      paymentType: "Bank Transfer",
      subtotal: "₹125,000",
      gstCharges: "₹12,500",
      gstPercentage: "10%",
      totalAmount: "₹137,500",
      status: "Paid", 
      dueDate: "2024-01-15", 
      issueDate: "2024-01-01",
      description: "Complete AI integration solution with machine learning capabilities"
    },
    { 
      id: "INV-2024-002",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Digital Solutions", 
      clientBillingDetails: "789 Corporate Blvd, Austin, TX 73301 | Tax ID: 11-2233445",
      service: "Cloud Migration",
      paymentType: "Credit Card",
      subtotal: "₹89,500",
      gstCharges: "₹8,950",
      gstPercentage: "10%",
      totalAmount: "₹98,450",
      status: "Pending", 
      dueDate: "2024-01-20", 
      issueDate: "2024-01-05",
      description: "Full cloud migration and infrastructure setup"
    },
    { 
      id: "INV-2024-003",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Future Systems", 
      clientBillingDetails: "321 Innovation Way, Seattle, WA 98101 | Tax ID: 55-6677889",
      service: "Security Upgrade",
      paymentType: "Wire Transfer",
      subtotal: "₹156,000",
      gstCharges: "₹15,600",
      gstPercentage: "10%",
      totalAmount: "₹171,600",
      status: "Overdue", 
      dueDate: "2024-01-05", 
      issueDate: "2023-12-20",
      description: "Enterprise-level security implementation"
    },
    { 
      id: "INV-2024-004",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Global Enterprises", 
      clientBillingDetails: "555 International Plaza, Miami, FL 33101 | Tax ID: 22-3344556",
      service: "Data Analytics Platform",
      paymentType: "Bank Transfer",
      subtotal: "₹203,000",
      gstCharges: "₹20,300",
      gstPercentage: "10%",
      totalAmount: "₹223,300",
      status: "Paid", 
      dueDate: "2024-01-25", 
      issueDate: "2024-01-10",
      description: "Advanced analytics and reporting system"
    },
    { 
      id: "INV-2024-005",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Smart Industries", 
      clientBillingDetails: "888 Manufacturing Dr, Detroit, MI 48201 | Tax ID: 33-4455667",
      service: "IoT Implementation",
      paymentType: "Check",
      subtotal: "₹98,750",
      gstCharges: "₹9,875",
      gstPercentage: "10%",
      totalAmount: "₹108,625",
      status: "Pending", 
      dueDate: "2024-01-30", 
      issueDate: "2024-01-12",
      description: "IoT sensors and management platform"
    },
    { 
      id: "INV-2024-006",
      companyName: "ProcessFlow Inc.",
      companyBillingDetails: "123 Tech Street, Silicon Valley, CA 94025 | Tax ID: 12-3456789 | Email: billing@processflow.com",
      clientName: "Innovation Labs", 
      clientBillingDetails: "999 Research Park, Boston, MA 02101 | Tax ID: 44-5566778",
      service: "Machine Learning Suite",
      paymentType: "ACH",
      subtotal: "₹175,000",
      gstCharges: "₹17,500",
      gstPercentage: "10%",
      totalAmount: "₹192,500",
      status: "Draft", 
      dueDate: "2024-02-05", 
      issueDate: "2024-01-08",
      description: "Custom ML algorithms and training platform"
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const searchMatch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === "all" || invoice.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const handleViewInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700 border-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Overdue": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const stats = [
    { label: "Total Invoices", value: "156", change: "+24", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Total Revenue", value: "₹4.8M", change: "+32%", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Paid", value: "124", change: "+15%", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Pending", value: "32", change: "+9", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  // AI Generate Invoice Function
  const handleGenerateInvoice = () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt to generate the invoice!");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      
      // Extract and generate invoice data
      const extractedInfo = {
        companyName: "ProcessFlow Inc.",
        companyBillingDetails: "123 Tech Park, Bangalore, Karnataka 560001 | GSTIN: 29ABCDE1234F1Z5 | Email: billing@processflow.in",
        clientName: extractClientName(aiPrompt),
        clientBillingDetails: generateClientBilling(aiPrompt),
        service: generateServiceName(aiPrompt),
        description: generateInvoiceDescription(aiPrompt),
        paymentType: determinePaymentType(aiPrompt),
        subtotal: "",
        gstPercentage: "18%",
        gstCharges: "",
        totalAmount: ""
      };

      // Calculate amounts
      const baseAmount = calculateInvoiceAmount(aiPrompt);
      const gstAmount = Math.round(baseAmount * 0.18);
      const totalAmount = baseAmount + gstAmount;

      extractedInfo.subtotal = `₹${baseAmount.toLocaleString('en-IN')}`;
      extractedInfo.gstCharges = `₹${gstAmount.toLocaleString('en-IN')}`;
      extractedInfo.totalAmount = `₹${totalAmount.toLocaleString('en-IN')}`;

      setGeneratedContent(extractedInfo);
      setIsContentGenerated(true);
      setIsGenerating(false);
    }, 2000);
  };

  // Helper functions for AI invoice generation
  const extractClientName = (prompt: string): string => {
    const clientMatch = prompt.match(/(?:for|to|client|company)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:requiring|needs|for|with|in)|,|\.|\s*$)/i);
    if (clientMatch) {
      const name = clientMatch[1].trim();
      // Remove common trailing words
      return name.replace(/\s+(requiring|needs|for|with|in)$/i, '').trim();
    }
    return "Acme Corporation";
  };

  const generateClientBilling = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    const gstPrefix = {
      "Mumbai": "27", "Delhi": "07", "Bangalore": "29", 
      "Hyderabad": "36", "Chennai": "33", "Pune": "27", "Kolkata": "19"
    }[city] || "29";
    
    return `${Math.floor(Math.random() * 900) + 100} Business Tower, ${city}, India | GSTIN: ${gstPrefix}ABCDE${Math.floor(Math.random() * 9000) + 1000}F1Z${Math.floor(Math.random() * 9) + 1}`;
  };

  const generateServiceName = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes("ai") || promptLower.includes("machine learning") || promptLower.includes("ml")) {
      return "AI/ML Development Services";
    }
    if (promptLower.includes("cloud") || promptLower.includes("infrastructure")) {
      return "Cloud Infrastructure Services";
    }
    if (promptLower.includes("mobile") || promptLower.includes("app")) {
      return "Mobile Application Development";
    }
    if (promptLower.includes("web") || promptLower.includes("website") || promptLower.includes("dashboard")) {
      return "Web Development Services";
    }
    if (promptLower.includes("security") || promptLower.includes("secure")) {
      return "Security Implementation Services";
    }
    if (promptLower.includes("consulting") || promptLower.includes("consultation")) {
      return "IT Consulting Services";
    }
    if (promptLower.includes("design") || promptLower.includes("ui") || promptLower.includes("ux")) {
      return "UI/UX Design Services";
    }
    
    return "Professional IT Services";
  };

  const generateInvoiceDescription = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    let description = "Professional services including: ";
    const services = [];

    if (promptLower.includes("ai") || promptLower.includes("ml")) {
      services.push("AI model development and integration");
    }
    if (promptLower.includes("cloud")) {
      services.push("cloud infrastructure setup and migration");
    }
    if (promptLower.includes("mobile")) {
      services.push("cross-platform mobile app development");
    }
    if (promptLower.includes("web") || promptLower.includes("dashboard")) {
      services.push("responsive web application development");
    }
    if (promptLower.includes("security")) {
      services.push("security audit and implementation");
    }
    if (promptLower.includes("design")) {
      services.push("UI/UX design and prototyping");
    }
    if (promptLower.includes("api")) {
      services.push("API development and integration");
    }
    if (promptLower.includes("database")) {
      services.push("database design and optimization");
    }

    if (services.length === 0) {
      services.push("custom software development", "technical consultation", "quality assurance");
    }

    description += services.join(", ") + ".";
    
    // Add timeline if mentioned
    const timelineMatch = prompt.match(/(\d+)\s*(month|months|week|weeks)/i);
    if (timelineMatch) {
      description += ` Project duration: ${timelineMatch[1]} ${timelineMatch[2]}.`;
    }

    return description;
  };

  const determinePaymentType = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes("bank transfer") || promptLower.includes("neft") || promptLower.includes("rtgs")) {
      return "Bank Transfer";
    }
    if (promptLower.includes("upi")) {
      return "UPI";
    }
    if (promptLower.includes("credit card") || promptLower.includes("card")) {
      return "Credit Card";
    }
    if (promptLower.includes("wire")) {
      return "Wire Transfer";
    }
    if (promptLower.includes("paypal")) {
      return "PayPal";
    }
    
    return "Bank Transfer"; // Default for Indian market
  };

  const calculateInvoiceAmount = (prompt: string): number => {
    const promptLower = prompt.toLowerCase();
    let baseAmount = 100000; // Base ₹1,00,000

    // Service-based pricing
    if (promptLower.includes("ai") || promptLower.includes("ml")) baseAmount += 80000;
    if (promptLower.includes("cloud")) baseAmount += 50000;
    if (promptLower.includes("mobile")) baseAmount += 60000;
    if (promptLower.includes("web") || promptLower.includes("dashboard")) baseAmount += 55000;
    if (promptLower.includes("security")) baseAmount += 70000;
    if (promptLower.includes("enterprise")) baseAmount += 100000;
    if (promptLower.includes("design") || promptLower.includes("ui/ux")) baseAmount += 40000;
    if (promptLower.includes("api")) baseAmount += 35000;
    if (promptLower.includes("database")) baseAmount += 30000;

    // Check for explicit amount in prompt
    const amountMatch = prompt.match(/(?:₹|INR|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lakhs|L)?/i);
    if (amountMatch) {
      const numStr = amountMatch[1].replace(/,/g, '');
      let amount = parseFloat(numStr);
      if (amountMatch[0].toLowerCase().includes('lakh')) {
        amount = amount * 100000;
      }
      return Math.round(amount);
    }

    // Timeline multiplier
    const timelineMatch = prompt.match(/(\d+)\s*month/i);
    if (timelineMatch) {
      const months = parseInt(timelineMatch[1]);
      if (months > 6) baseAmount += 50000;
      if (months > 9) baseAmount += 80000;
      if (months > 12) baseAmount += 120000;
    }

    return baseAmount;
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Invoice saved successfully! ✅");
    setShowCreateModal(false);
    resetAIForm();
  };

  const handleDownloadInvoice = () => {
    alert("Downloading invoice as PDF... 📄");
  };

  const resetAIForm = () => {
    setAiPrompt("");
    setIsContentGenerated(false);
    setGeneratedContent({
      companyName: "",
      companyBillingDetails: "",
      clientName: "",
      clientBillingDetails: "",
      service: "",
      description: "",
      paymentType: "",
      subtotal: "",
      gstPercentage: "",
      gstCharges: "",
      totalAmount: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <Receipt className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Invoice Generation</h2>
            <p className="text-[#5A4079]">Create and manage invoices</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
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
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <DollarSign className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <input
            type="text"
            placeholder="Search invoices..."
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

      {/* Invoices Table */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Invoice ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Issue Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Due Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#422462]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-[#422462]">{invoice.id}</td>
                  <td className="p-4 text-sm text-[#200B43]">{invoice.clientName}</td>
                  <td className="p-4 text-sm font-semibold text-[#422462]">{invoice.totalAmount}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{invoice.issueDate}</td>
                  <td className="p-4 text-sm text-[#5A4079]">{invoice.dueDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Download className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                        <Send className="h-4 w-4 text-[#5A4079]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetAIForm(); }} title="Create New Invoice with AI" size="lg">
        <form onSubmit={handleSaveInvoice} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* AI Prompt Section */}
          {!isContentGenerated && (
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-[#200B43]">AI Invoice Generator</h3>
                  <p className="text-xs text-[#5A4079]">Describe your service and let AI create a professional invoice</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Describe Your Service *
                </label>
                <textarea
                  rows={5}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462] focus:border-transparent resize-none text-[#200B43]"
                  placeholder="Example: Invoice for Tech Innovations requiring AI development and cloud infrastructure services worth ₹2.5 lakh over 4 months with bank transfer payment..."
                  disabled={isGenerating}
                />
                <p className="text-xs text-[#5A4079] mt-2">
                  💡 Tip: Include client name, services provided, amount (optional), payment method, and any specific requirements
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGenerateInvoice}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Invoice with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Generated Content - Editable Fields */}
          {isContentGenerated && (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Invoice generated successfully! You can edit any field before saving.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Invoice ID</label>
                  <input
                    type="text"
                    defaultValue="INV-2024-007"
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Issue Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                
                {/* Company Details Section */}
                <div className="col-span-2 border-t border-[#937CB4]/20 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-[#422462] mb-3">Company Details</h3>
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
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Company Billing Details</label>
                  <textarea
                    rows={2}
                    value={generatedContent.companyBillingDetails}
                    onChange={(e) => setGeneratedContent({...generatedContent, companyBillingDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                
                {/* Client Details Section */}
                <div className="col-span-2 border-t border-[#937CB4]/20 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-[#422462] mb-3">Client Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Client Name</label>
                  <input
                    type="text"
                    value={generatedContent.clientName}
                    onChange={(e) => setGeneratedContent({...generatedContent, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Client Billing Details</label>
                  <textarea
                    rows={2}
                    value={generatedContent.clientBillingDetails}
                    onChange={(e) => setGeneratedContent({...generatedContent, clientBillingDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                
                {/* Service & Payment Section */}
                <div className="col-span-2 border-t border-[#937CB4]/20 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-[#422462] mb-3">Service & Payment Details</h3>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Service</label>
                  <input
                    type="text"
                    value={generatedContent.service}
                    onChange={(e) => setGeneratedContent({...generatedContent, service: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={generatedContent.description}
                    onChange={(e) => setGeneratedContent({...generatedContent, description: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Payment Type</label>
                  <select 
                    value={generatedContent.paymentType}
                    onChange={(e) => setGeneratedContent({...generatedContent, paymentType: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Due Date</label>
                  <input
                    type="date"
                    defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                
                {/* Amount & Tax Section */}
                <div className="col-span-2 border-t border-[#937CB4]/20 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-[#422462] mb-3">Amount Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Subtotal Amount</label>
                  <input
                    type="text"
                    value={generatedContent.subtotal}
                    onChange={(e) => setGeneratedContent({...generatedContent, subtotal: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">GST Percentage</label>
                  <input
                    type="text"
                    value={generatedContent.gstPercentage}
                    onChange={(e) => setGeneratedContent({...generatedContent, gstPercentage: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">GST Charges</label>
                  <input
                    type="text"
                    value={generatedContent.gstCharges}
                    onChange={(e) => setGeneratedContent({...generatedContent, gstCharges: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Total Amount</label>
                  <input
                    type="text"
                    value={generatedContent.totalAmount}
                    onChange={(e) => setGeneratedContent({...generatedContent, totalAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4] font-semibold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Regenerate Button */}
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsContentGenerated(false);
                    setGeneratedContent({
                      companyName: "",
                      companyBillingDetails: "",
                      clientName: "",
                      clientBillingDetails: "",
                      service: "",
                      description: "",
                      paymentType: "",
                      subtotal: "",
                      gstPercentage: "",
                      gstCharges: "",
                      totalAmount: ""
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

          {/* Action Buttons */}
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
                onClick={handleDownloadInvoice}
                className="border-[#422462]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#422462] to-[#5A4079]"
              >
                Save Invoice
              </Button>
            </div>
          )}
        </form>
      </Modal>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`Invoice: ${selectedInvoice.id}`} size="lg">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#937CB4]/20">
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Invoice Date</label>
                <p className="text-[#200B43] font-medium">{selectedInvoice.issueDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Due Date</label>
                <p className="text-[#200B43] font-medium">{selectedInvoice.dueDate}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-[#5A4079]">Status</label>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="pb-4 border-b border-[#937CB4]/20">
              <h3 className="text-sm font-semibold text-[#422462] mb-3">From (Company Details)</h3>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Company Name</label>
                <p className="text-[#200B43] font-medium mb-2">{selectedInvoice.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Billing Details</label>
                <p className="text-[#200B43] text-sm">{selectedInvoice.companyBillingDetails}</p>
              </div>
            </div>

            {/* Client Details */}
            <div className="pb-4 border-b border-[#937CB4]/20">
              <h3 className="text-sm font-semibold text-[#422462] mb-3">To (Client Details)</h3>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Client Name</label>
                <p className="text-[#200B43] font-medium mb-2">{selectedInvoice.clientName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Billing Details</label>
                <p className="text-[#200B43] text-sm">{selectedInvoice.clientBillingDetails}</p>
              </div>
            </div>

            {/* Service Details */}
            <div className="pb-4 border-b border-[#937CB4]/20">
              <h3 className="text-sm font-semibold text-[#422462] mb-3">Service Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Service</label>
                  <p className="text-[#200B43] font-medium">{selectedInvoice.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5A4079]">Payment Type</label>
                  <p className="text-[#200B43] font-medium">{selectedInvoice.paymentType}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-[#5A4079]">Description</label>
                <p className="text-[#200B43] mt-1">{selectedInvoice.description}</p>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-gradient-to-br from-[#F0E9FF]/50 to-[#F0E9FF]/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#422462] mb-3">Amount Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#5A4079]">Subtotal</span>
                  <span className="text-sm font-medium text-[#200B43]">{selectedInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#5A4079]">GST ({selectedInvoice.gstPercentage})</span>
                  <span className="text-sm font-medium text-[#200B43]">{selectedInvoice.gstCharges}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#937CB4]/30">
                  <span className="text-base font-semibold text-[#422462]">Total Amount</span>
                  <span className="text-2xl font-bold gradient-text">{selectedInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Invoice Modal */}
      {selectedInvoice && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Invoice" size="lg">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Invoice ID</label>
                <input
                  type="text"
                  defaultValue={selectedInvoice.id}
                  readOnly
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Client</label>
                <input
                  type="text"
                  defaultValue={selectedInvoice.clientName}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Amount</label>
                <input
                  type="text"
                  defaultValue={selectedInvoice.totalAmount}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Tax</label>
                <input
                  type="text"
                  defaultValue={selectedInvoice.gstCharges}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Issue Date</label>
                <input
                  type="date"
                  defaultValue={selectedInvoice.issueDate}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Due Date</label>
                <input
                  type="date"
                  defaultValue={selectedInvoice.dueDate}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Items/Description</label>
                <textarea
                  rows={3}
                  defaultValue={selectedInvoice.description}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Status</label>
                <select 
                  defaultValue={selectedInvoice.status}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}