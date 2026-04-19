import { useState, useEffect } from "react";
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
  FileText,
  Image as ImageIcon,
  Loader2,
  Settings,
  MoreVertical,
  MicOff,
  Mic,
  VideoOff
} from "lucide-react";
import { marketingService, MarketingEvent } from "../services/marketingService";
import { Modal } from "./ui/modal";

export function MarketingMeetings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<MarketingEvent[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "view" | "edit">("create");
  const [selectedMeeting, setSelectedMeeting] = useState<MarketingEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOccasion, setFilterOccasion] = useState<string>("All");
 
  const showAttendScreen = searchParams.get("view") === "attend";
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [formData, setFormData] = useState<Partial<MarketingEvent>>({
    title: "",
    occasion: "Meeting",
    date: new Date().toISOString().split('T')[0],
    start_time: "10:00 AM",
    end_time: "11:00 AM",
    location: "Virtual",
    meetingType: "Virtual",
    attendees: "",
    organizer: "Admin",
    description: "",
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
      fetchMeetings();
    }
  }, [orgId]);

  const fetchMeetings = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await marketingService.getByOrg(orgId);
      setMeetings(res.data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const toBackendTime = (uiTime: string) => {
    if (!uiTime || !uiTime.includes(' ')) return uiTime;
    const [time, modifier] = uiTime.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const toUITime = (backendTime: string) => {
    if (!backendTime || backendTime.includes('AM') || backendTime.includes('PM')) return backendTime;
    let [hours, minutes] = backendTime.split(':');
    let modifier = 'AM';
    let h = parseInt(hours, 10);
    if (h >= 12) {
      modifier = 'PM';
      if (h > 12) h -= 12;
    }
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${modifier}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        organizationID: orgId,
        start_time: toBackendTime(formData.start_time || ""),
        end_time: toBackendTime(formData.end_time || ""),
      } as MarketingEvent;
      await marketingService.create(payload);
      alert("Meeting scheduled successfully! 📅");
      setShowModal(false);
      resetForm();
      fetchMeetings();
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to schedule meeting.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        start_time: toBackendTime(formData.start_time || ""),
        end_time: toBackendTime(formData.end_time || ""),
      } as MarketingEvent;
      await marketingService.update(selectedMeeting.id, payload);
      alert("Meeting updated successfully! ✨");
      setShowModal(false);
      fetchMeetings();
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert("Failed to update meeting.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await marketingService.delete(id);
      alert("Meeting deleted! 🗑️");
      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to delete meeting.");
    }
  };

  const handleOpenEdit = (meeting: MarketingEvent) => {
    setSelectedMeeting(meeting);
    setFormData({
      ...meeting,
      start_time: toUITime(meeting.start_time || ""),
      end_time: toUITime(meeting.end_time || ""),
    });
    setViewMode("edit");
    setShowModal(true);
  };

  const handleOpenView = (meeting: MarketingEvent) => {
    setSelectedMeeting(meeting);
    setFormData({
      ...meeting,
      start_time: toUITime(meeting.start_time || ""),
      end_time: toUITime(meeting.end_time || ""),
    });
    setViewMode("view");
    setShowModal(true);
  };

  const handleAttend = (meeting: MarketingEvent) => {
    setSelectedMeeting(meeting);
    setFormData({
      ...meeting,
      start_time: toUITime(meeting.start_time || ""),
      end_time: toUITime(meeting.end_time || ""),
    });
    setSearchParams({ view: "attend" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      occasion: "Meeting",
      date: new Date().toISOString().split('T')[0],
      start_time: "10:00 AM",
      end_time: "11:00 AM",
      location: "Virtual",
      meetingType: "Virtual",
      attendees: "",
      organizer: "Admin",
      description: "",
    });
    setShowModal(false);
    setSelectedMeeting(null);
    setViewMode("create");
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (meeting.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOccasion = filterOccasion === "All" || meeting.occasion === filterOccasion;
    return matchesSearch && matchesOccasion;
  });

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

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#937CB4]/20 p-4 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#937CB4]" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#937CB4]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#422462]/20"
                />
              </div>
              <select
                value={filterOccasion}
                onChange={(e) => setFilterOccasion(e.target.value)}
                className="px-4 py-2 bg-white border border-[#937CB4]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#422462]/20"
              >
                <option value="All">All Occasions</option>
                <option value="Meeting">Meeting</option>
                <option value="Event">Event</option>
                <option value="Campaign">Campaign</option>
                <option value="Post">Post</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20 rounded-2xl">
                <Loader2 className="h-10 w-10 text-[#422462] animate-spin" />
              </div>
            )}

            {!loading && filteredMeetings.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[#937CB4]/20">
                <Video className="h-12 w-12 text-[#937CB4] mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[#200B43] mb-2">No meetings found</h3>
                <p className="text-[#5A4079] max-w-sm mb-6">
                  {searchTerm ? "No meetings match your search criteria." : "You haven't scheduled any meetings yet."}
                </p>
              </div>
            )}

            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex flex-col bg-white rounded-2xl border border-[#937CB4]/20 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#200B43] group-hover:text-[#422462] transition-colors line-clamp-1">
                      {meeting.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      meeting.occasion === "Meeting" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {meeting.occasion || "Meeting"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Scheduled
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-[#5A4079]">
                      <div className="p-2 rounded-lg bg-[#F0E9FF]/50">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#5A4079]">
                      <div className="p-2 rounded-lg bg-[#F0E9FF]/50">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {toUITime(meeting.start_time || "")} - {toUITime(meeting.end_time || "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#5A4079]">
                      <div className="p-2 rounded-lg bg-[#F0E9FF]/50">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{meeting.location || "Virtual"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#5A4079]">
                      <div className="p-2 rounded-lg bg-[#F0E9FF]/50">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {(meeting.attendees || "").split(",").filter(Boolean).length} participants
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5A4079] line-clamp-2 mb-6 min-h-[40px]">
                    {meeting.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#937CB4]/10">
                    <Button 
                      className="flex-1 bg-[#F0E9FF] text-[#422462] hover:bg-[#E5D5FF]"
                      onClick={() => handleAttend(meeting)}
                    >
                      <Video className="h-4 w-4 mr-2" /> Attend
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
                      onClick={() => handleOpenView(meeting)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <div className="flex gap-1">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#422462]"
                        onClick={() => handleOpenEdit(meeting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="fixed inset-0 z-50 bg-[#202124] flex flex-col">
          <div className="h-16 border-b border-gray-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4 text-white">
              <Clock className="h-5 w-5 opacity-70" />
              <span>{formData.start_time}</span>
              <span className="opacity-30">|</span>
              <span className="font-medium">{formData.title}</span>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSearchParams({})}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6 flex items-center justify-center bg-black/20">
               <div className="relative w-full max-w-4xl aspect-video rounded-3xl bg-gradient-to-br from-[#422462] to-[#200B43] flex items-center justify-center overflow-hidden shadow-2xl">
                  <div className="text-center">
                     <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl font-bold text-white opacity-80">
                           {(formData.organizer || "A").charAt(0)}
                        </span>
                     </div>
                     <h3 className="text-2xl font-bold text-white">{formData.organizer || "Admin"} (You)</h3>
                     <p className="text-white/60 mt-2">Connecting to secure meeting server...</p>
                  </div>
                  {isVideoOff && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                       <VideoOff className="h-20 w-20 text-white/20" />
                    </div>
                  )}
               </div>
            </div>
          </div>

          <div className="h-24 border-t border-gray-700 flex items-center justify-center gap-6 px-8">
             <Button 
                variant="outline" 
                className={`h-14 w-14 rounded-full border-gray-600 ${isMuted ? 'bg-red-500 border-red-500 text-white' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsMuted(!isMuted)}
             >
                {isMuted ? <MicOff /> : <Mic />}
             </Button>
             <Button 
                variant="outline" 
                className={`h-14 w-14 rounded-full border-gray-600 ${isVideoOff ? 'bg-red-500 border-red-500 text-white' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsVideoOff(!isVideoOff)}
             >
                {isVideoOff ? <VideoOff /> : <Video />}
             </Button>
             <Button className="bg-red-500 hover:bg-red-600 text-white px-8 h-12 rounded-full font-bold" onClick={() => setSearchParams({})}>
                Leave Meeting
             </Button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={showModal} 
        onClose={resetForm} 
        title={viewMode === "create" ? "Schedule New Meeting" : viewMode === "edit" ? "Edit Meeting" : "Meeting Details"}
        size="lg"
      >
        {viewMode === "view" && selectedMeeting ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#422462]">Date</label>
                <div className="flex items-center text-[#5A4079] mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedMeeting.date}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#422462]">Time</label>
                <div className="flex items-center text-[#5A4079] mt-1">
                  <Clock className="h-4 w-4 mr-2" />
                  {toUITime(selectedMeeting.start_time || "")} - {toUITime(selectedMeeting.end_time || "")}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#422462]">Location</label>
                <div className="flex items-center text-[#5A4079] mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedMeeting.location || "Virtual"}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#422462]">Organizer</label>
                <div className="flex items-center text-[#5A4079] mt-1">
                  <Users className="h-4 w-4 mr-2" />
                  {selectedMeeting.organizer || "Admin"}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#422462]">Description</label>
              <p className="text-[#5A4079] mt-1">{selectedMeeting.description || "No description provided."}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#422462] mb-2 block">Participants</label>
              <div className="flex flex-wrap gap-2">
                {(selectedMeeting.attendees || "").split(",").filter(Boolean).map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-[#F0E9FF] text-[#422462] rounded-full text-sm">
                    {p.trim()}
                  </span>
                ))}
                {!(selectedMeeting.attendees || "").split(",").filter(Boolean).length && (
                  <span className="text-sm text-[#5A4079]">No participants added</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button
                onClick={() => handleOpenEdit(selectedMeeting)}
                className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Meeting
              </Button>
              <Button onClick={resetForm} variant="outline" className="flex-1">Close</Button>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={viewMode === "create" ? handleCreateMeeting : handleUpdateMeeting}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#422462] mb-1">Title *</label>
                <input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg focus:ring-2 focus:ring-[#422462] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#422462] mb-1">Occasion</label>
                <select 
                  name="occasion" 
                  value={formData.occasion} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Event">Event</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Post">Post</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#422462] mb-1">Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  value={formData.date} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#422462] mb-1">Start Time *</label>
                <input 
                  type="time" 
                  name="start_time" 
                  required 
                  value={formData.start_time?.includes(':') ? formData.start_time : ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#422462] mb-1">End Time *</label>
                <input 
                  type="time" 
                  name="end_time" 
                  required 
                  value={formData.end_time?.includes(':') ? formData.end_time : ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#422462] mb-1">Location</label>
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                  placeholder="e.g. Virtual, Office Room A"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#422462] mb-1">Attendees (comma separated)</label>
                <input 
                  name="attendees" 
                  value={formData.attendees} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                  placeholder="Haritha, Rajesh, Priya"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#422462] mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-[#937CB4]/20 rounded-lg outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="flex-1 bg-[#422462] text-white hover:bg-[#5A4079]">
                {isSaving ? "Saving..." : viewMode === "create" ? "Schedule" : "Update"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}