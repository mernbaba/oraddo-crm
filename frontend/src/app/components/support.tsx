import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Headphones, AlertCircle, CheckCircle2, Clock, Send, HelpCircle, MessageSquare, Paperclip, ArrowLeft, User } from "lucide-react";
import { useState } from "react";
import { Modal } from "./ui/modal";

interface Message {
  id: string;
  sender: "user" | "support";
  senderName: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  issueType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  description: string;
  stepsToReproduce: string;
  browserInfo: string;
  createdAt: Date;
  messages: Message[];
}

export function Support() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TECH-1001",
      name: "Haritha Sree",
      email: "haritha.sree@company.com",
      subject: "Dashboard widgets not loading",
      issueType: "Bug/Error",
      priority: "high",
      status: "in-progress",
      description: "The dashboard widgets are showing loading state indefinitely and not displaying any data.",
      stepsToReproduce: "1. Navigate to Dashboard\n2. Wait for widgets to load\n3. Widgets remain in loading state",
      browserInfo: "Chrome 120, Windows 11",
      createdAt: new Date("2026-02-15T10:30:00"),
      messages: [
        {
          id: "msg-1",
          sender: "user",
          senderName: "Haritha Sree",
          content: "The dashboard widgets are showing loading state indefinitely and not displaying any data.",
          timestamp: new Date("2026-02-15T10:30:00"),
        },
        {
          id: "msg-2",
          sender: "support",
          senderName: "Support Team",
          content: "Thank you for reporting this issue. We're looking into it. Can you please try clearing your browser cache and let us know if the issue persists?",
          timestamp: new Date("2026-02-15T14:20:00"),
        },
        {
          id: "msg-3",
          sender: "user",
          senderName: "Haritha Sree",
          content: "I cleared the cache but the issue is still there. Also tried in incognito mode with the same result.",
          timestamp: new Date("2026-02-15T15:45:00"),
        },
        {
          id: "msg-4",
          sender: "support",
          senderName: "Support Team",
          content: "Thank you for the update. We've identified the issue and our development team is working on a fix. We'll update you once it's deployed.",
          timestamp: new Date("2026-02-16T09:15:00"),
        }
      ]
    },
    {
      id: "TECH-1002",
      name: "Admin User",
      email: "admin@company.com",
      subject: "Export feature not working",
      issueType: "Feature Not Working",
      priority: "medium",
      status: "resolved",
      description: "Unable to export reports to PDF format. The button doesn't respond when clicked.",
      stepsToReproduce: "1. Go to Reports section\n2. Click Export to PDF\n3. Nothing happens",
      browserInfo: "Firefox 122, macOS",
      createdAt: new Date("2026-02-10T11:20:00"),
      messages: [
        {
          id: "msg-5",
          sender: "user",
          senderName: "Admin User",
          content: "Unable to export reports to PDF format. The button doesn't respond when clicked.",
          timestamp: new Date("2026-02-10T11:20:00"),
        },
        {
          id: "msg-6",
          sender: "support",
          senderName: "Support Team",
          content: "We've identified and fixed this issue. Please refresh your browser and try again. Let us know if you still experience any problems.",
          timestamp: new Date("2026-02-11T10:30:00"),
        },
        {
          id: "msg-7",
          sender: "user",
          senderName: "Admin User",
          content: "Works perfectly now! Thank you for the quick fix.",
          timestamp: new Date("2026-02-11T14:15:00"),
        },
        {
          id: "msg-8",
          sender: "support",
          senderName: "Support Team",
          content: "Great! I'm marking this ticket as resolved. Feel free to reopen if you need any further assistance.",
          timestamp: new Date("2026-02-11T14:30:00"),
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    issueType: "Bug/Error",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    description: "",
    stepsToReproduce: "",
    browserInfo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: Ticket = {
      id: `TECH-${1000 + tickets.length + 1}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      issueType: formData.issueType,
      priority: formData.priority,
      status: "open",
      description: formData.description,
      stepsToReproduce: formData.stepsToReproduce,
      browserInfo: formData.browserInfo,
      createdAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "user",
          senderName: formData.name,
          content: formData.description,
          timestamp: new Date(),
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowCreateModal(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      issueType: "Bug/Error",
      priority: "medium",
      description: "",
      stepsToReproduce: "",
      browserInfo: ""
    });

 
    setTimeout(() => setSelectedTicket(newTicket), 300);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          sender: "user",
          senderName: ticket.name,
          content: newMessage,
          timestamp: new Date(),
        };
        
        const updatedTicket = {
          ...ticket,
          messages: [...ticket.messages, newMsg]
        };
        
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return ticket;
    });

    setTickets(updatedTickets);
    setNewMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    urgent: "bg-red-100 text-red-800 border-red-300",
  };

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

 
  if (!selectedTicket) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] via-[#5A4079] to-[#422462] animate-gradient"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text mb-2">Technical Support</h2>
          <p className="text-[#5A4079]">
            Report platform issues and get technical assistance
          </p>
        </div>

 
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-[#937CB4]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-base">Response Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">24-48 hrs</p>
              <p className="text-xs text-[#5A4079] mt-1">Average response time</p>
            </CardContent>
          </Card>

          <Card className="border-[#937CB4]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-base">Your Tickets</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">{tickets.length}</p>
              <p className="text-xs text-[#5A4079] mt-1">Total tickets submitted</p>
            </CardContent>
          </Card>

          <Card className="border-[#937CB4]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#5A4079] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-base">Support Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">24/7</p>
              <p className="text-xs text-[#5A4079] mt-1">Submit tickets anytime</p>
            </CardContent>
          </Card>
        </div>

 
        <div className="text-center py-4">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
          >
            <Send className="mr-2 h-5 w-5" />
            Create New Support Ticket
          </Button>
        </div>
 
        <div>
          <h3 className="text-xl font-bold text-[#200B43] mb-4">My Support Tickets</h3>
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <Card className="border-[#937CB4]/20">
                <CardContent className="pt-6 text-center py-12">
                  <MessageSquare className="h-12 w-12 text-[#937CB4] mx-auto mb-4 opacity-50" />
                  <p className="text-[#5A4079] mb-4">No support tickets yet</p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    variant="outline"
                    className="border-[#937CB4]"
                  >
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className="border-[#937CB4]/20 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-[#5A4079]" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#200B43]">{ticket.id}</span>
                              <Badge variant="outline" className={priorityColors[ticket.priority]}>
                                {ticket.priority}
                              </Badge>
                              <Badge className={statusColors[ticket.status]}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-[#200B43]">{ticket.subject}</h4>
                            <p className="text-sm text-[#5A4079] mt-1">{ticket.issueType}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-[#5A4079]">
                        <p>{ticket.createdAt.toLocaleDateString()}</p>
                        <p className="text-xs mt-1">{ticket.messages.length} messages</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
 
        <Card className="border-[#937CB4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Common Technical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• Login/Authentication Problems</p>
              </div>
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• Data Not Loading/Saving</p>
              </div>
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• UI/Display Issues</p>
              </div>
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• Performance/Speed Issues</p>
              </div>
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• Feature Not Working as Expected</p>
              </div>
              <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3">
                <p className="font-medium text-[#422462] text-sm">• Error Messages/Crashes</p>
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Technical Support Ticket"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F0E9FF]/30 border border-[#937CB4]/20 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-[#422462] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#5A4079]">
                  This form is for <strong>technical platform issues only</strong>. For business inquiries, please use the appropriate module.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Issue Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option>Bug/Error</option>
                  <option>Performance Issue</option>
                  <option>Feature Not Working</option>
                  <option>Login/Authentication</option>
                  <option>Data Loading Issue</option>
                  <option>UI/Display Problem</option>
                  <option>Other Technical Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="low">Low - Minor inconvenience</option>
                  <option value="medium">Medium - Affects workflow</option>
                  <option value="high">High - Blocking work</option>
                  <option value="urgent">Urgent - System down</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Describe the issue in detail. What happened? What were you trying to do?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Steps to Reproduce <span className="text-red-500">*</span>
              </label>
              <textarea
                name="stepsToReproduce"
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Step 1: I clicked on...&#10;Step 2: Then I tried to...&#10;Step 3: The error appeared..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Browser & Device Information
              </label>
              <input
                type="text"
                name="browserInfo"
                value={formData.browserInfo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Chrome 120, Windows 11 / Safari, macOS"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462]"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

 
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col h-[calc(100vh-200px)]">
 
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedTicket(null)}
            className="mb-4 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>

          <Card className="border-[#937CB4]/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#200B43]">{selectedTicket.id}</span>
                    <Badge variant="outline" className={priorityColors[selectedTicket.priority]}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={statusColors[selectedTicket.status]}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-[#200B43]">{selectedTicket.subject}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-2">
                    <div>
                      <p className="text-[#5A4079]">Issue Type</p>
                      <p className="font-medium text-[#200B43]">{selectedTicket.issueType}</p>
                    </div>
                    <div>
                      <p className="text-[#5A4079]">Created</p>
                      <p className="font-medium text-[#200B43]">{selectedTicket.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[#5A4079]">Browser</p>
                      <p className="font-medium text-[#200B43]">{selectedTicket.browserInfo || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-[#5A4079]">Messages</p>
                      <p className="font-medium text-[#200B43]">{selectedTicket.messages.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
 
        <Card className="border-[#937CB4]/20 flex-1 flex flex-col">
          <CardHeader className="border-b border-[#937CB4]/20">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedTicket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className={`h-10 w-10 flex-shrink-0 ${message.sender === "support" ? "bg-gradient-to-br from-[#937CB4] to-[#5A4079]" : "bg-gradient-to-br from-[#422462] to-[#5A4079]"}`}>
                  <AvatarFallback className="text-white">
                    {message.sender === "support" ? "ST" : message.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-[70%] ${message.sender === "user" ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium text-[#200B43] ${message.sender === "user" ? "ml-auto" : ""}`}>
                      {message.senderName}
                    </span>
                    <span className="text-xs text-[#5A4079]">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-[#422462] to-[#5A4079] text-white ml-auto" 
                      : "bg-[#F0E9FF] text-[#200B43]"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
 
          <div className="border-t border-[#937CB4]/20 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
              <Button
                type="button"
                variant="outline"
                className="border-[#937CB4]"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462]"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </form>
          </div>
        </Card>
 
        <Card className="border-[#937CB4]/20 mt-4">
          <CardHeader>
            <CardTitle className="text-base">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#5A4079]">Steps to Reproduce:</label>
              <p className="text-sm text-[#200B43] whitespace-pre-wrap mt-1 bg-[#F0E9FF]/30 p-3 rounded-lg">
                {selectedTicket.stepsToReproduce}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}