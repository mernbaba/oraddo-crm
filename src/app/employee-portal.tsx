import { useState } from "react";
import { Button } from "./components/ui/button";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Megaphone, 
  FolderKanban, 
  UserPlus, 
  StickyNote, 
  MessageCircle, 
  Bell, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Receipt, 
  CreditCard, 
  CalendarDays, 
  ListChecks, 
  Calendar, 
  ClipboardList, 
  Headphones, 
  BarChart3, 
  LogOut, 
  Briefcase, 
  UserCheck,
  DollarSign,
  Shield
} from "lucide-react";
import { Dashboard } from "./components/dashboard";
import { BusinessDevelopment } from "./components/business-development";
import { BizDevProposal } from "./components/bizdev-proposal";
import { BizDevInvoice } from "./components/bizdev-invoice";
import { BizDevBilling } from "./components/bizdev-billing";
import { Marketing } from "./components/marketing";
import { MarketingCalendar } from "./components/marketing-calendar";
import { MarketingStrategies } from "./components/marketing-strategies";
import { MarketingBlogs } from "./components/marketing-blogs";
import { HumanResources } from "./components/human-resources";
import { HRAttendance } from "./components/hr-attendance";
import { HRExpenses } from "./components/hr-expenses";
import { ProjectManagement } from "./components/project-management";
import { ProjectKanban } from "./components/project-kanban";
import { ProjectCompleted } from "./components/project-completed";
import { ProjectTasks } from "./components/project-tasks";
import { LeadGeneration } from "./components/lead-generation";
import { Support } from "./components/support";
import { Notes } from "./components/notes";
import { Chat } from "./components/chat";
import { Notifications } from "./components/notifications";
import { Profile } from "./components/profile";
import { HRJobManagement } from "./components/hr-job-management";
import { HRPerformanceMetrics, HRSalaryStructure, HRResignation } from "./components/hr-all-remaining";

type View = string;

export default function EmployeePortal() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hrMenuExpanded, setHrMenuExpanded] = useState(false);
  const [bizDevExpanded, setBizDevExpanded] = useState(false);
  const [marketingExpanded, setMarketingExpanded] = useState(false);
  const [projectExpanded, setProjectExpanded] = useState(false);

  const getViewTitle = () => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      "dashboard": { title: "AI Dashboard", subtitle: "Intelligent overview of your business processes and performance metrics" },
      "bizdev-proposal": { title: "Proposal Quotation", subtitle: "Create and manage business proposals and quotations" },
      "bizdev-invoice": { title: "Invoice Generation", subtitle: "Generate and track invoices for your clients" },
      "bizdev-billing": { title: "Billing Management", subtitle: "Manage billing cycles and payment tracking" },
      "marketing-calendar": { title: "Marketing Calendar", subtitle: "Plan and schedule your marketing campaigns" },
      "marketing-strategies": { title: "Marketing Strategies", subtitle: "Develop and execute marketing strategies" },
      "marketing-blogs": { title: "Blogs", subtitle: "Create and manage blog content" },
      "project-kanban": { title: "Kanban Board", subtitle: "Visualize and manage project workflows" },
      "project-completed": { title: "Completed Projects", subtitle: "Review completed project history" },
      "project-tasks": { title: "Tasks", subtitle: "Manage project tasks and assignments" },
      "lead-generation": { title: "Lead Generation", subtitle: "Capture and manage potential customers" },
      "support": { title: "Support", subtitle: "Customer support and ticket management" },
      "notes": { title: "Notes", subtitle: "Create and organize your notes" },
      "chat": { title: "Chat", subtitle: "Team communication and collaboration" },
      "notifications": { title: "Notifications", subtitle: "Stay updated with system alerts" },
      "profile": { title: "My Profile", subtitle: "Manage your personal information and preferences" },
      "hr-attendance": { title: "Attendance", subtitle: "Monitor employee attendance and leave" },
      "hr-self-service-performance": { title: "My Performance Metrics", subtitle: "Track your monthly performance and achievements" },
      "hr-self-service-salary-structure": { title: "My Salary Structure", subtitle: "View your salary breakdown and compensation details" },
      "hr-self-service-resignation": { title: "Resignation Process", subtitle: "Submit and track your resignation application" },
      "hr-expenses": { title: "Expenses", subtitle: "Submit and track expense claims" },
      "hr-job-management": { title: "Job Management", subtitle: "Manage job postings and recruitment" },
    };
    return titles[currentView] || { title: "Employee Portal", subtitle: "Intelligent Business Management" };
  };

  const viewInfo = getViewTitle();

  const renderView = () => {
    const PlaceholderView = ({ title }: { title: string }) => (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#422462] animate-pulse-glow" />
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">{title}</h2>
            <p className="text-[#5A4079]">Content coming soon...</p>
          </div>
        </div>
      </div>
    );

    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      
      // Business Development
      case "business-development":
        return <BusinessDevelopment />;
      case "bizdev-proposal":
        return <BizDevProposal />;
      case "bizdev-invoice":
        return <BizDevInvoice />;
      case "bizdev-billing":
        return <BizDevBilling />;
      
      // Marketing
      case "marketing":
        return <Marketing />;
      case "marketing-calendar":
        return <MarketingCalendar />;
      case "marketing-strategies":
        return <MarketingStrategies />;
      case "marketing-blogs":
        return <MarketingBlogs />;
      
      // HR (NO Organization Management)
      case "human-resources":
        return <HumanResources />;
      case "hr-attendance":
        return <HRAttendance />;
      case "hr-self-service-performance":
        return <HRPerformanceMetrics />;
      case "hr-self-service-salary-structure":
        return <HRSalaryStructure />;
      case "hr-self-service-resignation":
        return <HRResignation />;
      case "hr-expenses":
        return <HRExpenses />;
      case "hr-job-management":
        return <HRJobManagement />;
      
      // Project Management
      case "project-management":
        return <ProjectManagement />;
      case "project-kanban":
        return <ProjectKanban />;
      case "project-completed":
        return <ProjectCompleted />;
      case "project-tasks":
        return <ProjectTasks />;
      
      // Lead Generation
      case "lead-generation":
        return <LeadGeneration />;
      
      // Utilities
      case "support":
        return <Support />;
      case "notes":
        return <Notes />;
      case "chat":
        return <Chat />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile />;
      
      default:
        return <PlaceholderView title={viewInfo.title} />;
    }
  };

  const isBizDevView = currentView === "business-development" || currentView.startsWith("bizdev-");
  const isMarketingView = currentView === "marketing" || currentView.startsWith("marketing-");
  const isHRView = currentView.startsWith("hr-");
  const isProjectView = currentView === "project-management" || currentView.startsWith("project-");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF]">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-[#937CB4]/20 z-50 shadow-lg shadow-[#937CB4]/10">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden hover:bg-[#F0E9FF]"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#422462] blur-xl opacity-40 animate-pulse"></div>
                <Sparkles className="h-8 w-8 text-[#422462] relative z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#422462] via-[#5A4079] to-[#937CB4] bg-clip-text text-transparent">
                  Employee Portal
                </h1>
                <p className="text-xs text-[#5A4079]">AI-Powered Business Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#F0E9FF]"
              onClick={() => setCurrentView("notifications")}
            >
              <Bell className="h-5 w-5 text-[#5A4079]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#422462]/10 to-[#5A4079]/10 border border-[#937CB4]/20 cursor-pointer hover:bg-[#F0E9FF]/50 transition-colors" onClick={() => setCurrentView("profile")}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center text-white font-bold text-sm">
                HS
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#200B43]">Haritha Sree</p>
                <p className="text-xs text-[#5A4079]">Employee</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#5A4079]" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 w-64 bg-white/90 backdrop-blur-xl border-r border-[#937CB4]/20 transition-all duration-300 z-40 overflow-y-auto shadow-xl shadow-[#937CB4]/10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 space-y-2">
          {/* Dashboard */}
          <Button
            variant="ghost"
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              currentView === "dashboard"
                ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30'
                : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
            }`}
            onClick={() => { setCurrentView("dashboard"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            <span className="relative z-10">Dashboard</span>
          </Button>

          {/* Business Development */}
          <div>
            <Button
              variant="ghost"
              className={`
                w-full justify-start transition-all duration-300 group relative overflow-hidden
                ${isBizDevView 
                  ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30' 
                  : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
                }
              `}
              onClick={() => setBizDevExpanded(!bizDevExpanded)}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              <span className="relative z-10 flex-1 text-left">Business Development</span>
              {bizDevExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className={`overflow-hidden transition-all duration-300 ${bizDevExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "bizdev-proposal" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("bizdev-proposal"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="text-sm">Proposal Quotation</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "bizdev-invoice" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("bizdev-invoice"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  <span className="text-sm">Invoice Generation</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "bizdev-billing" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("bizdev-billing"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="text-sm">Billing Management</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div>
            <Button
              variant="ghost"
              className={`
                w-full justify-start transition-all duration-300 group relative overflow-hidden
                ${isMarketingView 
                  ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30' 
                  : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
                }
              `}
              onClick={() => setMarketingExpanded(!marketingExpanded)}
            >
              <Megaphone className="mr-3 h-5 w-5" />
              <span className="relative z-10 flex-1 text-left">Marketing</span>
              {marketingExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className={`overflow-hidden transition-all duration-300 ${marketingExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "marketing-calendar" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("marketing-calendar"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span className="text-sm">Marketing Calendar</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "marketing-strategies" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("marketing-strategies"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  <span className="text-sm">Marketing Strategies</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "marketing-blogs" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("marketing-blogs"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="text-sm">Blogs</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Human Resources - NO Finance, NO Organization Management */}
          <div>
            <Button
              variant="ghost"
              className={`
                w-full justify-start transition-all duration-300 group relative overflow-hidden
                ${isHRView 
                  ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30' 
                  : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
                }
              `}
              onClick={() => setHrMenuExpanded(!hrMenuExpanded)}
            >
              <Users className="mr-3 h-5 w-5" />
              <span className="relative z-10 flex-1 text-left">Human Resources</span>
              {hrMenuExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {/* HR Submenu - NO Organization Management */}
            <div className={`overflow-hidden transition-all duration-300 ${hrMenuExpanded ? 'max-h-[2000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-2 space-y-1">
                
                {/* Attendance */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "hr-attendance" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-attendance"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="text-sm">Attendance</span>
                </Button>

                {/* My Performance Metrics */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "hr-self-service-performance" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-self-service-performance"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span className="text-sm">My Performance Metrics</span>
                </Button>

                {/* My Salary Structure */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "hr-self-service-salary-structure" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-self-service-salary-structure"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span className="text-sm">My Salary Structure</span>
                </Button>

                {/* Resignation Process */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "hr-self-service-resignation" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-self-service-resignation"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm">Resignation Process</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === 'hr-job-management' 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-job-management"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className="text-sm">Job Management</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === 'hr-expenses' 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("hr-expenses"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span className="text-sm">Expenses</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Project Management */}
          <div>
            <Button
              variant="ghost"
              className={`
                w-full justify-start transition-all duration-300 group relative overflow-hidden
                ${isProjectView 
                  ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30' 
                  : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
                }
              `}
              onClick={() => setProjectExpanded(!projectExpanded)}
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              <span className="relative z-10 flex-1 text-left">Project Management</span>
              {projectExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className={`overflow-hidden transition-all duration-300 ${projectExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "project-kanban" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("project-kanban"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  <span className="text-sm">Kanban Board</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "project-completed" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("project-completed"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span className="text-sm">Completed Projects</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    w-full justify-start transition-all duration-300 group relative overflow-hidden
                    ${currentView === "project-tasks" 
                      ? 'bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#937CB4] hover:to-[#5A4079] shadow-md' 
                      : 'text-[#200B43] hover:bg-[#F0E9FF]/70'
                    }
                  `}
                  onClick={() => { setCurrentView("project-tasks"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  <span className="text-sm">Tasks</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Lead Generation */}
          <Button
            variant="ghost"
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              currentView === "lead-generation"
                ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#422462] hover:to-[#5A4079] shadow-lg shadow-[#937CB4]/30'
                : 'text-[#200B43] hover:bg-[#F0E9FF]/70 hover:text-[#200B43]'
            }`}
            onClick={() => { setCurrentView("lead-generation"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          >
            <UserPlus className="mr-3 h-5 w-5" />
            <span className="relative z-10">Lead Generation</span>
          </Button>

          {/* Divider */}
          <div className="border-t border-[#937CB4]/20 my-2"></div>

          {/* Utilities */}
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${
              currentView === "notes"
                ? 'bg-[#F0E9FF] text-[#422462]'
                : 'text-[#5A4079] hover:bg-[#F0E9FF]/50'
            }`}
            onClick={() => { setCurrentView("notes"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          >
            <StickyNote className="mr-2 h-4 w-4" />
            <span className="text-sm">Notes</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${
              currentView === "chat"
                ? 'bg-[#F0E9FF] text-[#422462]'
                : 'text-[#5A4079] hover:bg-[#F0E9FF]/50'
            }`}
            onClick={() => { setCurrentView("chat"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">Chat</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${
              currentView === "support"
                ? 'bg-[#F0E9FF] text-[#422462]'
                : 'text-[#5A4079] hover:bg-[#F0E9FF]/50'
            }`}
            onClick={() => { setCurrentView("support"); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          >
            <Headphones className="mr-2 h-4 w-4" />
            <span className="text-sm">Support</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-30 animate-pulse"></div>
                <Sparkles className="h-6 w-6 text-[#422462] relative z-10 animate-pulse-glow" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">{viewInfo.title}</h1>
            </div>
            <p className="text-[#5A4079] ml-9">{viewInfo.subtitle}</p>
          </div>

          {/* Content */}
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tl from-[#422462]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
