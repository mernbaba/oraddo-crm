import { StickyNote, Plus, Search, Trash2, Edit, Pin, Calendar, Tag, Sparkles, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "./ui/modal";
import { notesService, EmpNote } from "../services/notesService";

// UI-level note shape. `pinned` is the only client-only field — the
// server's employee_notes table has no `pinned` column. `tags` and `color`
// live on the server now (see notesServices + notes model), so they are
// read straight from the API and not stored in localStorage.
interface Note extends Omit<EmpNote, "color"> {
  color: string;
  pinned: boolean;
}

const DEFAULT_COLORS = ["#422462", "#5A4079", "#937CB4", "#958CA7"];

function colorFor(seed: number) {
  return DEFAULT_COLORS[Math.abs(seed) % DEFAULT_COLORS.length];
}

function deriveTitle(content: string, fallback?: string | null) {
  if (fallback && fallback.trim().length > 0) return fallback;
  // Fall back to the first non-empty line of the note body
  const firstLine = content?.split("\n").find((l) => l.trim().length > 0) ?? "";
  return firstLine.slice(0, 60) || "Untitled note";
}

function toUI(n: EmpNote): Note {
  const safeTags = Array.isArray(n.tags)
    ? n.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];
  return {
    ...n,
    title: deriveTitle(n.notes ?? "", n.title),
    tags: safeTags,
    color: typeof n.color === "string" && n.color.trim().length > 0
      ? n.color
      : colorFor(n.id ?? 0),
    pinned: false,
  };
}

function tagsToCsv(tags: string[]) {
  return tags.join(", ");
}

function csvToTags(csv: string): string[] {
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: "",
    color: "#422462",
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  // Pinned ids are UI-only (no `pinned` column on the server). Persist in
  // localStorage so the user's pinned notes survive a refresh.
  const PIN_STORAGE_KEY = "notes:pinned";
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(PIN_STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as number[]) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(Array.from(pinnedIds)));
    } catch {
      // ignore storage errors (quota / private mode)
    }
  }, [pinnedIds]);

  // Current user (for employeeId on create). Falls back to localStorage.
  const currentUser = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("userData");
      return raw ? (JSON.parse(raw) as Record<string, any>) : null;
    } catch {
      return null;
    }
  }, []);
  const employeeId: number | undefined =
    currentUser?.id ?? currentUser?.employeeId ?? undefined;

  // ── Load notes from the API on mount ──────────────────────────────────────
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notesService.getAllNotes();
      const raw: EmpNote[] = Array.isArray(res.data) ? res.data : [];
      setNotes(raw.map(toUI));
    } catch (err: any) {
      console.error("Failed to load notes", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  // `pinned` is the only field merged in at render time. `tags` and `color`
  // come straight from the server.
  const decoratedNotes = useMemo(() => {
    return notes.map((n) => ({ ...n, pinned: pinnedIds.has(n.id) }));
  }, [notes, pinnedIds]);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return decoratedNotes.filter((n) => {
      if (!q) return true;
      return (
        (n.title || "").toLowerCase().includes(q) ||
        (n.notes || "").toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [decoratedNotes, searchQuery]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const regularNotes = filteredNotes.filter((n) => !n.pinned);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday-start

  const stats = useMemo(() => {
    const total = notes.length;
    const pinned = notes.filter((n) => pinnedIds.has(n.id)).length;
    const thisWeek = notes.filter((n) => {
      if (!n.createdAt) return false;
      const d = new Date(n.createdAt);
      return d >= startOfWeek;
    }).length;
    const tagSet = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
    return { total, pinned, thisWeek, tags: tagSet.size };
  }, [notes, pinnedIds]);

  const statCards = useMemo(
    () => [
      { label: "Total Notes", value: stats.total, gradient: "from-[#422462] to-[#5A4079]" },
      { label: "Pinned", value: stats.pinned, gradient: "from-[#5A4079] to-[#937CB4]" },
      { label: "This Week", value: stats.thisWeek, gradient: "from-[#937CB4] to-[#5A4079]" },
      { label: "Tags", value: stats.tags, gradient: "from-[#422462] to-[#937CB4]" },
    ],
    [stats]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddNote = () => {
    setEditingNote(null);
    setNoteForm({ title: "", content: "", tags: "", color: "#422462" });
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title ?? "",
      content: note.notes ?? "",
      tags: tagsToCsv(note.tags ?? []),
      color: note.color ?? "#422462",
    });
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!noteForm.content.trim()) {
      setError("Note content is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const apiPayload = {
      title: noteForm.title.trim() || null,
      notes: noteForm.content,
      tags: csvToTags(noteForm.tags),
      color: noteForm.color || null,
    };
    try {
      if (editingNote) {
        const res = await notesService.updateNote(editingNote.id, apiPayload);
        const updated: Note = toUI(res.data);
        // Preserve local pinned state across the update.
        updated.pinned = pinnedIds.has(updated.id);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const res = await notesService.createNote({
          ...apiPayload,
          employeeId,
          sharedByEmployeeId: employeeId,
        });
        const created: Note = toUI(res.data);
        setNotes((prev) => [created, ...prev]);
      }
      setShowNoteModal(false);
    } catch (err: any) {
      console.error("Failed to save note", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      const validationMsg = Array.isArray(data?.errors)
        ? data.errors.map((e: any) => e?.msg).filter(Boolean).join("; ")
        : "";
      setError(
        validationMsg ||
          data?.error ||
          data?.message ||
          (status ? `Server returned ${status}` : "") ||
          err?.message ||
          "Failed to save note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    setActionId(noteId);
    setError(null);
    try {
      await notesService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setPinnedIds((prev) => {
        if (!prev.has(noteId)) return prev;
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
    } catch (err: any) {
      console.error("Failed to delete note", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to delete note."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleTogglePin = (noteId: number) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) next.delete(noteId);
      else next.add(noteId);
      return next;
    });
  };

  const renderNoteCard = (note: Note) => {
    const isPinned = note.pinned;
    const isBusy = actionId === note.id;
    return (
      <div
        key={note.id}
        className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
        style={{ borderTopColor: note.color, borderTopWidth: '3px' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-[#200B43] flex-1">{note.title || "Untitled note"}</h4>
            {isPinned && <Pin className="h-4 w-4 text-[#422462] fill-current" />}
          </div>

          <p className="text-sm text-[#5A4079] mb-3 line-clamp-3 whitespace-pre-wrap">
            {note.notes}
          </p>

          {note.tags.length > 0 && (
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
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[#937CB4]/20">
            <div className="flex items-center gap-1 text-xs text-[#5A4079]">
              <Calendar className="h-3 w-3" />
              <span>
                {note.createdAt
                  ? new Date(note.createdAt).toISOString().split("T")[0]
                  : ""}
              </span>
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
                disabled={isBusy}
                title={isPinned ? "Unpin" : "Pin"}
              >
                <Pin className={`h-3 w-3 ${isPinned ? "text-[#422462]" : "text-[#5A4079]"}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-[#F0E9FF]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNote(note);
                }}
                disabled={isBusy}
                title="Edit"
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
                disabled={isBusy}
                title="Delete"
              >
                {isBusy ? (
                  <Loader2 className="h-3 w-3 text-red-600 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 text-red-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">

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
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
          onClick={handleAddNote}
          disabled={saving}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            className="text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#937CB4]" />
                ) : (
                  stat.value
                )}
              </h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

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

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#5A4079]">
          <Loader2 className="h-6 w-6 mr-2 animate-spin" />
          Loading notes…
        </div>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="h-5 w-5 text-[#422462]" />
                <h3 className="text-lg font-semibold text-[#200B43]">Pinned Notes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-[#200B43] mb-4">
              {pinnedNotes.length > 0 ? "All Notes" : "Notes"}
            </h3>
            {regularNotes.length === 0 && pinnedNotes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#937CB4]/30 bg-white/60 px-6 py-12 text-center text-[#5A4079]">
                <StickyNote className="h-10 w-10 mx-auto mb-2 text-[#937CB4]" />
                <p className="font-medium text-[#200B43]">No notes yet</p>
                <p className="text-sm">Click "New Note" to capture your first idea.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularNotes.map(renderNoteCard)}
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        open={showNoteModal}
        onClose={() => {
          if (!saving) setShowNoteModal(false);
        }}
        title={editingNote ? "Edit Note" : "New Note"}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title (optional)"
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
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#5A4079]">Accent</label>
            <input
              type="color"
              value={noteForm.color}
              onChange={(e) => setNoteForm({ ...noteForm, color: e.target.value })}
              className="w-10 h-10 p-0 border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button
            className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
            onClick={handleSaveNote}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
