import { CalendarDays, Plus, ChevronLeft, ChevronRight, Sparkles, Clock, MapPin, Users, Video, Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";

export function MarketingCalendar() {
  const [currentMonth] = useState("January 2024");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const events = [
    { 
      id: "EVT-001",
      title: "Q1 Marketing Strategy Meeting", 
      date: "2024-01-15",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      type: "Meeting",
      location: "Conference Room A",
      meetingType: "In-Person",
      attendees: ["John Doe", "Sarah Smith", "Mike Johnson", "Emily Davis"],
      description: "Quarterly marketing strategy planning session to discuss goals, budgets, and campaign priorities for Q1 2024.",
      organizer: "Sarah Smith",
      color: "#422462"
    },
    { 
      id: "EVT-002",
      title: "Product Launch Event", 
      date: "2024-01-18",
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      type: "Event",
      location: "Grand Ballroom",
      meetingType: "In-Person",
      attendees: ["John Doe", "Sarah Smith", "Mike Johnson", "Emily Davis", "Alex Wilson", "Jessica Lee"],
      description: "Official launch event for our new AI-powered product suite. Includes presentations, demos, and networking.",
      organizer: "John Doe",
      color: "#5A4079"
    },
    { 
      id: "EVT-003",
      title: "Content Team Sync", 
      date: "2024-01-20",
      startTime: "9:00 AM",
      endTime: "9:45 AM",
      type: "Meeting",
      location: "Virtual - Zoom",
      meetingType: "Virtual",
      attendees: ["Sarah Smith", "Emily Davis", "Jessica Lee"],
      description: "Weekly content team synchronization to review blog posts, social media content, and upcoming campaigns.",
      organizer: "Emily Davis",
      color: "#937CB4"
    },
    { 
      id: "EVT-004",
      title: "Client Presentation - Tech Corp", 
      date: "2024-01-22",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      type: "Meeting",
      location: "Virtual - Google Meet",
      meetingType: "Virtual",
      attendees: ["John Doe", "Sarah Smith", "Mike Johnson"],
      description: "Present marketing proposal and strategy to Tech Corp executives.",
      organizer: "Mike Johnson",
      color: "#422462"
    },
    { 
      id: "EVT-005",
      title: "Industry Conference 2024", 
      date: "2024-01-25",
      startTime: "8:00 AM",
      endTime: "6:00 PM",
      type: "Event",
      location: "Convention Center",
      meetingType: "In-Person",
      attendees: ["John Doe", "Sarah Smith", "Mike Johnson", "Emily Davis", "Alex Wilson"],
      description: "Annual marketing and technology conference with keynote speakers, workshops, and networking opportunities.",
      organizer: "John Doe",
      color: "#5A4079"
    },
    { 
      id: "EVT-006",
      title: "Social Media Planning Session", 
      date: "2024-01-28",
      startTime: "3:00 PM",
      endTime: "4:00 PM",
      type: "Meeting",
      location: "Conference Room B",
      meetingType: "Hybrid",
      attendees: ["Sarah Smith", "Emily Davis", "Jessica Lee", "Alex Wilson"],
      description: "Plan social media campaigns for February and review January performance metrics.",
      organizer: "Sarah Smith",
      color: "#937CB4"
    },
  ];

  const filteredEvents = events.filter((event) => {
    const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filterType === "all" || event.type === filterType;
    return searchMatch && typeMatch;
  });

  const handleViewEvent = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const stats = [
    { label: "Total Events", value: "24", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Meetings", value: "18", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Events This Month", value: "6", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Team Members", value: "12", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  // Simple calendar grid (7x5 = 35 days)
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Calendar and Events Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Calendar */}
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

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#5A4079] p-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day) => {
              const hasEvent = events.some(e => new Date(e.date).getDate() === day);
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

        {/* Campaign List */}
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
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
                        event.type === "Meeting"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-purple-100 text-purple-700 border-purple-300"
                      }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#5A4079]">
                      <div>{event.date}</div>
                      <div className="text-xs">{event.startTime} - {event.endTime}</div>
                    </td>
                    <td className="p-4 text-sm text-[#5A4079]">{event.location}</td>
                    <td className="p-4 text-sm text-[#200B43]">{event.organizer}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#5A4079]" />
                        <span className="text-sm text-[#200B43]">{event.attendees.length}</span>
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
      </div>

      {/* Create Event/Meeting Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Event/Meeting" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Event/Meeting Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Q1 Marketing Strategy Meeting"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Type</label>
              <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                <option value="Meeting">Meeting</option>
                <option value="Event">Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Meeting Type</label>
              <select className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">Start Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">End Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Conference Room A or Virtual - Zoom"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Organizer</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Organizer name"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Attendees (comma separated)</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., John Doe, Sarah Smith, Mike Johnson"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Event/Meeting description..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20 sticky bottom-0 bg-white">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-[#422462] to-[#5A4079]">Create Event</Button>
          </div>
        </form>
      </Modal>

      {/* View Event/Meeting Modal */}
      {selectedEvent && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`${selectedEvent.type}: ${selectedEvent.title}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Event ID</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">Type</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedEvent.type === "Meeting"
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-purple-100 text-purple-700 border-purple-300"
                }`}>
                  {selectedEvent.type}
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
                <p className="text-[#200B43] font-medium">{selectedEvent.startTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#5A4079]">End Time</label>
                <p className="text-[#200B43] font-medium">{selectedEvent.endTime}</p>
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
                Attendees ({selectedEvent.attendees.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.attendees.map((attendee, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30">
                    {attendee}
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

      {/* Edit Event/Meeting Modal */}
      {selectedEvent && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Event/Meeting" size="lg">
          <form className="space-y-4">
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
                  defaultValue={selectedEvent.title}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Type</label>
                <select defaultValue={selectedEvent.type} className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                  <option value="Meeting">Meeting</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Meeting Type</label>
                <select defaultValue={selectedEvent.meetingType} className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]">
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Date</label>
                <input
                  type="date"
                  defaultValue={selectedEvent.date}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">Start Time</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.startTime}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">End Time</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.endTime}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Location</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.location}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Organizer</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.organizer}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Attendees (comma separated)</label>
                <textarea
                  rows={2}
                  defaultValue={selectedEvent.attendees.join(", ")}
                  className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
                <textarea
                  rows={4}
                  defaultValue={selectedEvent.description}
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