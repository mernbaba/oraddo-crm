import { StickyNote, Plus, Search, Trash2, Edit, Pin, Calendar, Tag, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  date: string;
  color: string;
}

export function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: "",
    color: "#422462"
  });

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Q1 Marketing Strategy",
      content: "Focus on social media campaigns and influencer partnerships. Allocate budget for paid ads...",
      tags: ["Marketing", "Strategy"],
      pinned: true,
      date: "2024-01-10",
      color: "#422462",
    },
    {
      id: 2,
      title: "Team Meeting Notes",
      content: "Discussed new project timelines. John to handle backend, Sarah on frontend design...",
      tags: ["Meeting", "Project"],
      pinned: true,
      date: "2024-01-09",
      color: "#5A4079",
    },
    {
      id: 3,
      title: "Client Feedback - Tech Corp",
      content: "Client requested additional features: dark mode, export to PDF, and advanced analytics...",
      tags: ["Client", "Feedback"],
      pinned: false,
      date: "2024-01-08",
      color: "#937CB4",
    },
    {
      id: 4,
      title: "Development Tasks",
      content: "1. Fix login bug\n2. Optimize database queries\n3. Update documentation\n4. Code review for PR #124",
      tags: ["Development", "Tasks"],
      pinned: false,
      date: "2024-01-07",
      color: "#958CA7",
    },
    {
      id: 5,
      title: "Budget Planning 2024",
      content: "Review annual budget allocation. Consider increasing marketing spend by 20%...",
      tags: ["Finance", "Planning"],
      pinned: false,
      date: "2024-01-06",
      color: "#422462",
    },
    {
      id: 6,
      title: "Ideas for New Features",
      content: "AI-powered recommendations, automated reporting, mobile app version, API integrations...",
      tags: ["Ideas", "Features"],
      pinned: false,
      date: "2024-01-05",
      color: "#5A4079",
    },
  ]);

  const stats = [
    { label: "Total Notes", value: "24", gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Pinned", value: "6", gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "This Week", value: "8", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Tags", value: "12", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const pinnedNotes = notes.filter(note => note.pinned);
  const regularNotes = notes.filter(note => !note.pinned);

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteForm({
      title: "",
      content: "",
      tags: "",
      color: "#422462"
    });
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
      color: note.color
    });
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    const newNote: Note = {
      id: editingNote ? editingNote.id : notes.length + 1,
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags.split(",").map(tag => tag.trim()),
      pinned: false,
      date: new Date().toISOString().split("T")[0],
      color: noteForm.color
    };

    if (editingNote) {
      setNotes(notes.map(note => note.id === editingNote.id ? newNote : note));
    } else {
      setNotes([...notes, newNote]);
    }

    setShowNoteModal(false);
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleTogglePin = (noteId: number) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <StickyNote className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Notes</h2>
            <p className="text-[#5A4079]">Capture ideas and important information</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={handleAddNote}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
        />
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-5 w-5 text-[#422462]" />
            <h3 className="text-lg font-semibold text-[#200B43]">Pinned Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                style={{ borderTopColor: note.color, borderTopWidth: '3px' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-[#200B43] flex-1">{note.title}</h4>
                    <Pin className="h-4 w-4 text-[#422462] fill-current" />
                  </div>

                  <p className="text-sm text-[#5A4079] mb-3 line-clamp-3">{note.content}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded text-xs bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30"
                      >
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#937CB4]/20">
                    <div className="flex items-center gap-1 text-xs text-[#5A4079]">
                      <Calendar className="h-3 w-3" />
                      <span>{note.date}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 hover:bg-[#F0E9FF]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(note.id);
                        }}
                      >
                        <Pin className="h-3 w-3 text-[#5A4079]" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 hover:bg-[#F0E9FF]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                      >
                        <Edit className="h-3 w-3 text-[#5A4079]" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Notes */}
      <div>
        <h3 className="text-lg font-semibold text-[#200B43] mb-4">All Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularNotes.map((note) => (
            <div
              key={note.id}
              className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              style={{ borderTopColor: note.color, borderTopWidth: '3px' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-[#200B43] flex-1">{note.title}</h4>
                </div>

                <p className="text-sm text-[#5A4079] mb-3 line-clamp-3">{note.content}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs bg-[#F0E9FF] text-[#422462] border border-[#937CB4]/30"
                    >
                      <Tag className="h-3 w-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#937CB4]/20">
                  <div className="flex items-center gap-1 text-xs text-[#5A4079]">
                    <Calendar className="h-3 w-3" />
                    <span>{note.date}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-[#F0E9FF]">
                      <Pin className="h-3 w-3 text-[#5A4079]" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-[#F0E9FF]">
                      <Edit className="h-3 w-3 text-[#5A4079]" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50">
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Modal */}
      <Modal open={showNoteModal} onClose={() => setShowNoteModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#200B43]">{editingNote ? "Edit Note" : "New Note"}</h3>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-[#F0E9FF]" onClick={() => setShowNoteModal(false)}>
              <X className="h-4 w-4 text-[#5A4079]" />
            </Button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            />
            <textarea
              placeholder="Content"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              rows={4}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={noteForm.tags}
              onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            />
            <input
              type="color"
              value={noteForm.color}
              onChange={(e) => setNoteForm({ ...noteForm, color: e.target.value })}
              className="w-10 h-10 p-0 border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={handleSaveNote}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}