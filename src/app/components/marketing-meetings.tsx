import { useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "./ui/button";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  X,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Upload,
  Phone,
  Mail,
  Link as LinkIcon,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MessageSquare,
  MoreVertical,
  Settings,
  Grid3x3,
  Maximize,
  PhoneOff,
  UserPlus as UserPlusIcon,
  Volume2,
  VolumeX
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  type: "Client" | "Team" | "Internal" | "External";
  date: string;
  time: string;
  duration: string;
  location: "Virtual" | "Office" | "Client Site" | "Conference";
  participants: string[];
  organizer: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  description: string;
  meetingLink?: string;
  agenda?: string;
  notes?: string;
  actionItems?: string[];
}

export function MarketingMeetings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Q1 Marketing Strategy Review",
      type: "Team",
      date: "2026-03-20",
      time: "10:00 AM",
      duration: "2 hours",
      location: "Virtual",
      participants: ["Haritha Sree", "Rajesh Kumar", "Priya Sharma", "Amit Patel"],
      organizer: "Haritha Sree",
      status: "Scheduled",
      description: "Quarterly review of marketing strategies and campaign performance",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      agenda: "1. Q1 Performance Review\n2. Campaign Analysis\n3. Budget Discussion\n4. Q2 Planning",
      actionItems: []
    },
    {
      id: "2",
      title: "Client Presentation - TechCorp",
      type: "Client",
      date: "2026-03-18",
      time: "02:00 PM",
      duration: "1.5 hours",
      location: "Client Site",
      participants: ["Haritha Sree", "Suresh Reddy", "TechCorp Team"],
      organizer: "Haritha Sree",
      status: "Scheduled",
      description: "Present new digital marketing campaign proposal for TechCorp",
      agenda: "1. Introduction\n2. Campaign Overview\n3. Timeline & Budget\n4. Q&A Session",
      actionItems: []
    },
    {
      id: "3",
      title: "Social Media Campaign Planning",
      type: "Team",
      date: "2026-03-15",
      time: "11:00 AM",
      duration: "1 hour",
      location: "Virtual",
      participants: ["Haritha Sree", "Kavita Singh", "Rohit Mehta"],
      organizer: "Kavita Singh",
      status: "Completed",
      description: "Plan social media content calendar for March",
      notes: "Finalized content calendar. Team to start content creation.",
      actionItems: ["Kavita: Create Instagram content", "Rohit: Design graphics", "Haritha: Review final posts"]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "view" | "edit">("create");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
 
  const showAttendScreen = searchParams.get("view") === "attend";
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  
  const [formData, setFormData] = useState<Meeting>({
    id: "",
    title: "",
    type: "Team",
    date: "",
    time: "",
    duration: "",
    location: "Virtual",
    participants: [],
    organizer: "Haritha Sree",
    status: "Scheduled",
    description: "",
    meetingLink: "",
    agenda: "",
    notes: "",
    actionItems: []
  });

  const [participantInput, setParticipantInput] = useState("");
  const [actionItemInput, setActionItemInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }));
      setParticipantInput("");
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const addActionItem = () => {
    if (actionItemInput.trim()) {
      setFormData(prev => ({
        ...prev,
        actionItems: [...(prev.actionItems || []), actionItemInput.trim()]
      }));
      setActionItemInput("");
    }
  };

  const removeActionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actionItems: (prev.actionItems || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (viewMode === "create") {
      const newMeeting: Meeting = {
        ...formData,
        id: Date.now().toString()
      };
      setMeetings([...meetings, newMeeting]);
    } else if (viewMode === "edit" && selectedMeeting) {
      setMeetings(meetings.map(m => m.id === selectedMeeting.id ? formData : m));
    }
    resetForm();
  };

  const handleView = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData(meeting);
    setViewMode("view");
    setShowModal(true);
  };

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData(meeting);
    setViewMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const handleAttend = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData(meeting);
    setSearchParams({ view: "attend" });
    setIsMuted(false);
    setIsVideoOff(false);
    setShowChat(false);
    setShowParticipants(false);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      type: "Team",
      date: "",
      time: "",
      duration: "",
      location: "Virtual",
      participants: [],
      organizer: "Haritha Sree",
      status: "Scheduled",
      description: "",
      meetingLink: "",
      agenda: "",
      notes: "",
      actionItems: []
    });
    setShowModal(false);
    setSelectedMeeting(null);
    setViewMode("create");
    setParticipantInput("");
    setActionItemInput("");
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || meeting.status === filterStatus;
    const matchesType = filterType === "All" || meeting.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-300";
      case "Completed": return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-300";
      case "In Progress": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Client": return "bg-purple-100 text-purple-700";
      case "Team": return "bg-blue-100 text-blue-700";
      case "Internal": return "bg-indigo-100 text-indigo-700";
      case "External": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case "Virtual": return <Video className="h-4 w-4" />;
      case "Office": return <MapPin className="h-4 w-4" />;
      case "Client Site": return <MapPin className="h-4 w-4" />;
      case "Conference": return <Users className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {!showAttendScreen ? (
        <>
    
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#200B43]">Meetings Management</h2>
              <p className="text-[#5A4079] mt-1">Schedule and manage client and team meetings</p>
            </div>
            <Button
              onClick={() => {
                setViewMode("create");
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] text-white shadow-lg shadow-[#937CB4]/30"
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
 
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#937CB4]/20 shadow-xl shadow-[#937CB4]/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462] bg-white/50"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462] bg-white/50"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462] bg-white/50"
          >
            <option value="All">All Types</option>
            <option value="Client">Client</option>
            <option value="Team">Team</option>
            <option value="Internal">Internal</option>
            <option value="External">External</option>
          </select>

          <div className="text-sm text-[#5A4079] flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredMeetings.length} meetings found
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#937CB4]/20 shadow-xl shadow-[#937CB4]/10 p-6 hover:shadow-2xl hover:shadow-[#937CB4]/20 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#200B43] mb-2">{meeting.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(meeting.type)}`}>
                    {meeting.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-[#5A4079]">
                <Calendar className="h-4 w-4 mr-2 text-[#422462]" />
                {new Date(meeting.date).toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center text-sm text-[#5A4079]">
                <Clock className="h-4 w-4 mr-2 text-[#422462]" />
                {meeting.time} ({meeting.duration})
              </div>
              <div className="flex items-center text-sm text-[#5A4079]">
                {getLocationIcon(meeting.location)}
                <span className="ml-2">{meeting.location}</span>
              </div>
              <div className="flex items-center text-sm text-[#5A4079]">
                <Users className="h-4 w-4 mr-2 text-[#422462]" />
                {meeting.participants.length} participants
              </div>
            </div>

            <p className="text-sm text-[#5A4079] mb-4 line-clamp-2">
              {meeting.description}
            </p>

            <div className="flex gap-2 pt-4 border-t border-[#937CB4]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAttend(meeting)}
                className="flex-1 border-[#937CB4]/40 hover:bg-[#F0E9FF]"
              >
                <Video className="h-3 w-3 mr-1" />
                Attend
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(meeting)}
                className="flex-1 border-[#937CB4]/40 hover:bg-[#F0E9FF]"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(meeting.id)}
                className="border-red-300 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#937CB4]/20 shadow-xl shadow-[#937CB4]/10 p-12 text-center">
          <Video className="h-16 w-16 text-[#937CB4] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-[#200B43] mb-2">No Meetings Found</h3>
          <p className="text-[#5A4079]">
            {searchTerm || filterStatus !== "All" || filterType !== "All"
              ? "Try adjusting your filters"
              : "Schedule your first meeting to get started"}
          </p>
        </div>
      )}
        </>
      ) : (
         
        <div className="bg-[#202124] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          {/* Top Bar */}
          <div className="h-16 bg-[#202124] border-b border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-white text-sm">{formData.time}</span>
              </div>
              <div className="h-6 w-px bg-gray-700"></div>
              <h1 className="text-white font-medium">{formData.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
 
          <div className="flex-1 flex relative overflow-hidden">
 
            <div className={`flex-1 p-6 ${showChat || showParticipants ? 'pr-0' : ''}`}>
              <div className="h-full grid grid-cols-2 gap-4">
 
                <div className="relative bg-gradient-to-br from-[#422462] to-[#5A4079] rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-[#F0E9FF] flex items-center justify-center mx-auto mb-3">
                        <span className="text-4xl font-bold text-[#422462]">
                          {formData.organizer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="text-white font-medium">{formData.organizer} (You)</p>
                    </div>
                  </div>
                  {isVideoOff && (
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                      <span className="text-white text-sm flex items-center gap-2">
                        <VideoOff className="h-4 w-4" />
                        Camera Off
                      </span>
                    </div>
                  )}
                  {isMuted && (
                    <div className="absolute top-4 right-4 bg-red-500 p-2 rounded-full">
                      <MicOff className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded">
                      {formData.organizer}
                    </span>
                  </div>
                </div>
 
                {formData.participants.slice(0, 3).map((participant, index) => (
                  <div key={index} className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                          <span className="text-4xl font-bold text-white">
                            {participant.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-white font-medium">{participant}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded">
                        {participant}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {showChat && (
              <div className="w-80 bg-white border-l border-gray-300 flex flex-col flex-shrink-0">
                <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
                  <h3 className="font-semibold text-gray-800">In-call messages</h3>
                  <button onClick={() => setShowChat(false)} className="text-gray-600 hover:text-gray-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-center text-gray-500 text-sm">
                    Messages can only be seen by people in the call
                  </div>
                </div>
                <div className="border-t border-gray-300 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Send a message to everyone"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                    />
                    <button className="px-4 py-2 bg-[#422462] text-white rounded-lg hover:bg-[#5A4079]">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
 
            {showParticipants && (
              <div className="w-80 bg-white border-l border-gray-300 flex flex-col flex-shrink-0">
                <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
                  <h3 className="font-semibold text-gray-800">People ({formData.participants.length + 1})</h3>
                  <button onClick={() => setShowParticipants(false)} className="text-gray-600 hover:text-gray-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#F0E9FF] flex items-center justify-center">
                      <span className="text-lg font-semibold text-[#422462]">
                        {formData.organizer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{formData.organizer}</p>
                      <p className="text-sm text-gray-500">You</p>
                    </div>
                    {!isMuted && <Mic className="h-4 w-4 text-green-600" />}
                    {isMuted && <MicOff className="h-4 w-4 text-red-600" />}
                  </div>
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">
                          {participant.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{participant}</p>
                      </div>
                      <Mic className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
 
          <div className="h-24 bg-[#202124] border-t border-gray-700 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>{new Date(formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-gray-500">•</span>
              <span>{formData.duration}</span>
            </div>
 
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-all ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <Video className="h-6 w-6 text-white" />}
              </button>

              <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all">
                <Monitor className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setSearchParams({})}
                className="px-6 py-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              >
                <PhoneOff className="h-6 w-6 text-white" />
              </button>
            </div>
 
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowChat(!showChat);
                  setShowParticipants(false);
                }}
                className={`p-4 rounded-full transition-all ${
                  showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => {
                  setShowParticipants(!showParticipants);
                  setShowChat(false);
                }}
                className={`p-4 rounded-full transition-all ${
                  showParticipants ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Users className="h-6 w-6 text-white" />
              </button>

              <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all">
                <Grid3x3 className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
 
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white p-6 rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-bold">
                {viewMode === "create" && "Schedule New Meeting"}
                {viewMode === "edit" && "Edit Meeting"}
                {viewMode === "view" && "Meeting Details"}
              </h2>
              <button onClick={resetForm} className="hover:bg-white/20 rounded-full p-2 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {viewMode === "view" ? (
 
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#200B43] mb-2">{formData.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(formData.type)}`}>
                        {formData.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(formData.status)}`}>
                        {formData.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Date</label>
                      <div className="flex items-center text-[#5A4079] mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(formData.date).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Time & Duration</label>
                      <div className="flex items-center text-[#5A4079] mt-1">
                        <Clock className="h-4 w-4 mr-2" />
                        {formData.time} ({formData.duration})
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Location</label>
                      <div className="flex items-center text-[#5A4079] mt-1">
                        {getLocationIcon(formData.location)}
                        <span className="ml-2">{formData.location}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Organizer</label>
                      <div className="flex items-center text-[#5A4079] mt-1">
                        <Users className="h-4 w-4 mr-2" />
                        {formData.organizer}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#422462]">Description</label>
                    <p className="text-[#5A4079] mt-1">{formData.description}</p>
                  </div>

                  {formData.meetingLink && (
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Meeting Link</label>
                      <div className="flex items-center gap-2 mt-1">
                        <LinkIcon className="h-4 w-4 text-[#422462]" />
                        <a href={formData.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {formData.meetingLink}
                        </a>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-[#422462] mb-2 block">Participants ({formData.participants.length})</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.participants.map((participant, index) => (
                        <span key={index} className="px-3 py-1 bg-[#F0E9FF] text-[#422462] rounded-full text-sm">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>

                  {formData.agenda && (
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Agenda</label>
                      <div className="mt-1 p-4 bg-[#F0E9FF]/50 rounded-lg">
                        <pre className="text-[#5A4079] whitespace-pre-wrap font-sans text-sm">{formData.agenda}</pre>
                      </div>
                    </div>
                  )}

                  {formData.notes && (
                    <div>
                      <label className="text-sm font-semibold text-[#422462]">Meeting Notes</label>
                      <div className="mt-1 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <pre className="text-[#5A4079] whitespace-pre-wrap font-sans text-sm">{formData.notes}</pre>
                      </div>
                    </div>
                  )}

                  {formData.actionItems && formData.actionItems.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-[#422462] mb-2 block">Action Items</label>
                      <div className="space-y-2">
                        {formData.actionItems.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-[#5A4079] text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
                    <Button
                      onClick={() => {
                        setViewMode("edit");
                      }}
                      className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Meeting
                    </Button>
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-[#937CB4]/40"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
 
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Meeting Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="e.g., Q1 Marketing Strategy Review"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Meeting Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      >
                        <option value="Client">Client</option>
                        <option value="Team">Team</option>
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="e.g., 1 hour, 2 hours"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Location *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      >
                        <option value="Virtual">Virtual</option>
                        <option value="Office">Office</option>
                        <option value="Client Site">Client Site</option>
                        <option value="Conference">Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Organizer *
                      </label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Meeting Link (for virtual meetings)
                      </label>
                      <input
                        type="url"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="https://meet.google.com/abc-defg-hij"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="Brief description of the meeting"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Agenda
                      </label>
                      <textarea
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="1. Item one&#10;2. Item two&#10;3. Item three"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Meeting Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                        placeholder="Add meeting notes and key discussion points"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Participants
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={participantInput}
                          onChange={(e) => setParticipantInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                          className="flex-1 px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                          placeholder="Enter participant name"
                        />
                        <Button
                          type="button"
                          onClick={addParticipant}
                          className="bg-[#422462] hover:bg-[#5A4079]"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.participants.map((participant, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#F0E9FF] text-[#422462] rounded-full text-sm flex items-center gap-2"
                          >
                            {participant}
                            <button
                              type="button"
                              onClick={() => removeParticipant(index)}
                              className="hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#422462] mb-2">
                        Action Items
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={actionItemInput}
                          onChange={(e) => setActionItemInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                          className="flex-1 px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422462]"
                          placeholder="Enter action item"
                        />
                        <Button
                          type="button"
                          onClick={addActionItem}
                          className="bg-[#422462] hover:bg-[#5A4079]"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.actionItems || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="flex-1 text-[#5A4079] text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => removeActionItem(index)}
                              className="hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-[#937CB4]/20">
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] text-white"
                    >
                      {viewMode === "create" ? "Schedule Meeting" : "Update Meeting"}
                    </Button>
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-[#937CB4]/40"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}