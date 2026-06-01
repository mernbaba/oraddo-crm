import { CalendarDays, Plus, ChevronLeft, ChevronRight, Sparkles, Clock, MapPin, Users, Video, Eye, Edit, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Modal } from "./ui/modal";
import { marketingService, MarketingEvent } from "../services/marketingService";

export function MarketingCalendar() {
  const [currentMonth, setCurrentMonth] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOccasion, setFilterOccasion] = useState("all");
  
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [eventList, setEventList] = useState<MarketingEvent[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<MarketingEvent>>({
    title: "",
    occasion: "Meeting",
    meetingType: "In-Person",
    date: new Date().toISOString().split('T')[0],
    start_time: "10:00",
    end_time: "11:00",
    location: "",
    organizer: "",
    attendees: "",
    description: ""
  });

  useEffect(() => {
    // Set current month display
    const now = new Date();
    setCurrentMonth(now.toLocaleString('default', { month: 'long', year: 'numeric' }));

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
      const res = await marketingService.getByOrg(orgId);
      setEventList(res.data || []);
    } catch (error) {
      console.error("Error fetching marketing events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setIsSaving(true);
    try {
      await marketingService.create({ ...formData, organizationID: orgId });
      alert("Event created successfully! 🗓️");
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await marketingService.delete(id);
      alert("Event deleted successfully! 🗑️");
      fetchData();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      occasion: "Meeting",
      meetingType: "In-Person",
      date: new Date().toISOString().split('T')[0],
      start_time: "10:00",
      end_time: "11:00",
      location: "",
      organizer: "",
      attendees: "",
      description: ""
    });
  };

  const filteredEvents = eventList.filter((event) => {
    const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (event.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                       (event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const occasionMatch = filterOccasion === "all" || event.occasion === filterOccasion;
    return searchMatch && occasionMatch;
  });

  const handleViewEvent = (event: MarketingEvent) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event: MarketingEvent) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
      attendees: event.attendees || ""
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !orgId) return;
    setIsSaving(true);
    try {
      await marketingService.update(selectedEvent.id, formData);
      alert("Event updated successfully! ✅");
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    } finally {
      setIsSaving(false);
    }
  };

  const getEventStats = () => {
    const total = eventList.length;
    const meetings = eventList.filter(e => e.occasion === "Meeting").length;
    const currentMonthNum = new Date().getMonth();
    const eventsThisMonth = eventList.filter(e => new Date(e.date).getMonth() === currentMonthNum).length;
    
    return [
      { label: "Total Events", value: total.toString(), gradient: "from-[#422462] to-[#5A4079]" },
      { label: "Meetings", value: meetings.toString(), gradient: "from-[#5A4079] to-[#937CB4]" },
      { label: "Events This Month", value: eventsThisMonth.toString(), gradient: "from-[#937CB4] to-[#5A4079]" },
      { label: "Team Members", value: "12", gradient: "from-[#422462] to-[#937CB4]" }, // Still hardcoded as per lack of team endpoint in audit
    ];
  };

  const stats = getEventStats();
 
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <CalendarDays className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Marketing Calendar</h2>
            <p className="text-[#5A4079]">Plan and schedule marketing activities</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
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
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 gap-6">
 
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#200B43]">{currentMonth}</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                <ChevronLeft className="h-4 w-4 text-[#5A4079]" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]">
                <ChevronRight className="h-4 w-4 text-[#5A4079]" />
              </Button>
            </div>
          </div>

  
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#5A4079] p-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day) => {
              const hasEvent = eventList.some(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === new Date().getMonth());
              return (
                <div
                  key={day}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg
                    ${day > 31 ? 'text-[#958CA7] opacity-40' : 'text-[#200B43]'}
                    ${hasEvent ? 'bg-gradient-to-br from-[#422462] to-[#5A4079] text-white font-semibold shadow-md' : 'hover:bg-[#F0E9FF]/50'}
                    transition-all duration-200 cursor-pointer
                  `}
                >
                  {day > 31 ? day - 31 : day}
                </div>
              );
            })}
          </div>
        </div>
 
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
          <div className="p-6 border-b border-[#937CB4]/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#200B43]">All Events & Meetings</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-sm"
                  value={filterOccasion}
                  onChange={(e) => setFilterOccasion(e.target.value)}
                >
                  <option value="all">All Occasions</option>
                  <option value="Meeting">Meetings</option>
                  <option value="Event">Events</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-[#F0E9FF]/30">
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Event ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Date & Time</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Location</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Organizer</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Attendees</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#422462]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[#937CB4]/10 hover:bg-[#F0E9FF]/30 transition-colors"
                  >
                    <td className="p-4 text-sm font-medium text-[#422462]">{event.id}</td>
                    <td className="p-4 text-sm text-[#200B43] font-medium">{event.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        event.occasion === "Meeting"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-purple-100 text-purple-700 border-purple-300"
                      }`}>
                        {event.occasion}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#5A4079]">
                      <div>{event.date}</div>
                      <div className="text-xs">{event.start_time} - {event.end_time}</div>
                    </td>
                    <td className="p-4 text-sm text-[#5A4079]">{event.location}</td>
                    <td className="p-4 text-sm text-[#200B43]">{event.organizer}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#5A4079]" />
                        <span className="text-sm text-[#200B43]">{(event.attendees || "").split(',').filter(Boolean).length}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleViewEvent(event)}>
                          <Eye className="h-4 w-4 text-[#5A4079]" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F0E9FF]" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4 text-[#5A4079]" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => handleDeleteEvent(event.id)}>
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
      </div>
 
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Event/Meeting" size="lg">
        <form className="space-y-4" onSubmit={handleCreateEvent}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Event/Meeting Title</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Q1 Marketing Strategy Meeting"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Occasion</label>
              <select 
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value as any})}
              >
                <option value="Meeting">Meeting</option>
                <option value="Event">Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Meeting Type</label>
              <select 
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                value={formData.meetingType}
                onChange={(e) => setFormData({...formData, meetingType: e.target.value as any})}
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Start Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">End Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Conference Room A or Virtual - Zoom"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Organizer</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Organizer name"
                value={formData.organizer}
                onChange={(e) => setFormData({...formData, organizer: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Attendees (comma separated)</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., John Doe, Sarah Smith, Mike Johnson"
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Event/Meeting description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
              {isSaving ? "Saving..." : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>
 
      {selectedEvent && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`${selectedEvent.occasion}: ${selectedEvent.title}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Event ID</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Occasion</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedEvent.occasion === "Meeting"
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-purple-100 text-purple-700 border-purple-300"
                }`}>
                  {selectedEvent.occasion}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Meeting Type</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.meetingType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Date</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Start Time</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.start_time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">End Time</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.end_time}</p>
              </div>
            </div>
            
            <div className="border-t border-[#937CB4]/20 pt-4">
              <label className="text-sm font-medium text-[#5A4079] flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <p className="text-[#200B43] font-medium">{selectedEvent.location}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079] flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Organizer
              </label>
              <p className="text-[#200B43] font-medium">{selectedEvent.organizer}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079] flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Attendees ({(selectedEvent.attendees || "").split(',').filter(Boolean).length})
              </label>
              <div className="flex flex-wrap gap-2">
                {(selectedEvent.attendees || "").split(',').filter(Boolean).map((attendee, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30">
                    {attendee.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#5A4079] mb-2">Description</label>
              <p className="text-[#200B43] mt-1">{selectedEvent.description}</p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
              <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079]" onClick={() => { setShowViewModal(false); setShowEditModal(true); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </Button>
            </div>
          </div>
        </Modal>
      )}
 
      {selectedEvent && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Event/Meeting" size="lg">
          <form className="space-y-4" onSubmit={handleUpdateEvent}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Event ID</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.id}
                  readOnly
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg bg-gray-50"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Event/Meeting Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Occasion</label>
                <select 
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.occasion}
                  onChange={(e) => setFormData({...formData, occasion: e.target.value as any})}
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Meeting Type</label>
                <select 
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.meetingType}
                  onChange={(e) => setFormData({...formData, meetingType: e.target.value as any})}
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Start Time</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">End Time</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Organizer</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.organizer}
                  onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Attendees (comma separated)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.attendees}
                  onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-[#422462] to-[#5A4079]">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}