import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Sparkles, Plus, Users, X, UserPlus, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "./ui/modal";
import { chatService, ChatGroup, ChatMessage, GroupChatMessage } from "../services/chatService";
import { employeeService, Employee } from "../services/employeeService";

const PALETTE = ["#422462", "#5A4079", "#937CB4", "#958CA7", "#7B5E9C", "#A893C4"];

function colorFor(seed: number | string) {
  const n = typeof seed === "string" ? hashStr(seed) : Math.abs(seed);
  return PALETTE[n % PALETTE.length];
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

function timeLabel(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString();
}

function relativeTime(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

// One "conversation" entry shown in the left rail. May be a 1:1 chat
// (otherUserId set) or a group (groupId set).
interface RailEntry {
  key: string;
  kind: "private" | "group";
  id: number;
  name: string;
  subtitle: string;
  lastMessage: string;
  lastAt: string | null;
  color: string;
}

interface RenderedMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  time: string;
  isOwn: boolean;
  avatarInitials: string;
  color: string;
}

export function Chat() {
  // ── Current user / org context ─────────────────────────────────────────
  const currentUser = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("userData");
      return raw ? (JSON.parse(raw) as Record<string, any>) : null;
    } catch {
      return null;
    }
  }, []);
  const myId: number | undefined = currentUser?.id ?? currentUser?.employeeId;
  const orgId: number | string | undefined =
    currentUser?.organizationId ?? currentUser?.organizationID;
  const myName: string =
    currentUser?.emp_name || currentUser?.fullName || "You";

  // ── State ────────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // selected rail entry key, like "p:42" or "g:7"
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [groupForm, setGroupForm] = useState({
    groupName: "",
    description: "",
    selectedMemberIds: [] as number[],
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Last activity per conversation (rail preview)
  const [lastByConvo, setLastByConvo] = useState<Record<string, { content: string; at: string | null }>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ── Load initial data: employees + groups ────────────────────────────
  useEffect(() => {
    if (myId === undefined) {
      setError("Could not identify the current user. Please log in again.");
      setLoadingMeta(false);
      return;
    }

    const load = async () => {
      setLoadingMeta(true);
      setError(null);
      try {
        const [empRes, grpRes, partnersRes] = await Promise.all([
          orgId !== undefined
            ? employeeService.getOnboardEmployees(Number(orgId))
            : Promise.resolve({ data: [] as Employee[] }),
          chatService.getGroups(orgId),
          chatService.getChatPartners(myId),
        ]);
        const empList: Employee[] = Array.isArray(empRes.data) ? empRes.data : [];
        const grpList: ChatGroup[] = Array.isArray(grpRes.data) ? grpRes.data : [];
        const partners: Array<{ partnerId: number; lastMessage: string; lastAt: string | null }> =
          Array.isArray((partnersRes.data as any)?.partners) ? (partnersRes.data as any).partners : [];
        setEmployees(empList.filter((e) => e.id !== myId));
        setGroups(grpList);

        // Seed the rail preview with both groups (placeholder text) and
        // existing 1:1 partners. The latter is what keeps 1:1 chats from
        // disappearing after a refresh.
        const initial: Record<string, { content: string; at: string | null }> = {};
        grpList.forEach((g) => {
          initial[`g:${g.id}`] = { content: g.groupDescription || "Group created", at: g.createdAt || null };
        });
        partners.forEach((p) => {
          initial[`p:${p.partnerId}`] = { content: p.lastMessage, at: p.lastAt };
        });
        setLastByConvo(initial);
      } catch (err: any) {
        console.error("Failed to load chat data", err);
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load chat data."
        );
      } finally {
        setLoadingMeta(false);
      }
    };
    load();
  }, [myId, orgId]);

  // ── Fetch each group's most recent message for the rail preview ──────
  useEffect(() => {
    if (groups.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const g of groups) {
        try {
          const res = await chatService.getGroupMessages(g.id);
          // Backend returns a bare array of messages.
          const data: any = res.data;
          const list: GroupChatMessage[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.messages)
            ? data.messages
            : [];
          if (cancelled) return;
          if (list.length > 0) {
            const last = list[list.length - 1];
            setLastByConvo((prev) => ({
              ...prev,
              [`g:${g.id}`]: {
                content: last.content || (last.other_documents ? "📎 Attachment" : ""),
                at: last.createdAt,
              },
            }));
          }
        } catch {
          // Best-effort: leave the seed we already have.
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [groups]);

  // ── Build the rail ───────────────────────────────────────────────────
  const rail: RailEntry[] = useMemo(() => {
    const privateEntries: RailEntry[] = employees
      .filter((e) => e.id !== myId)
      .map<RailEntry | null>((e) => {
        const last = lastByConvo[`p:${e.id}`];
        // Only show 1:1 chats that have at least one message. The
        // chatPartners endpoint seeds `lastByConvo` for the current
        // user on a fresh load, so this filter is the difference
        // between "chat thread is here" and "no thread, hide it".
        if (!last) return null;
        return {
          key: `p:${e.id}`,
          kind: "private",
          id: e.id,
          name: e.emp_name || e.personal_email || `Employee #${e.id}`,
          subtitle: e.position || e.role || "",
          lastMessage: last.content,
          lastAt: last.at,
          color: colorFor(e.id),
        };
      })
      .filter((x): x is RailEntry => x !== null);

    const groupEntries: RailEntry[] = groups.map<RailEntry>((g) => {
      const last = lastByConvo[`g:${g.id}`];
      const memberCount = g.members?.length ?? 0;
      return {
        key: `g:${g.id}`,
        kind: "group",
        id: g.id,
        name: g.groupName,
        subtitle: `${memberCount} member${memberCount === 1 ? "" : "s"}`,
        lastMessage: last?.content || g.groupDescription || "Group created",
        lastAt: last?.at ?? g.createdAt ?? null,
        color: colorFor(g.id),
      };
    });

    // Stable sort: most recent activity first
    return [...privateEntries, ...groupEntries].sort((a, b) => {
      const ta = a.lastAt ? new Date(a.lastAt).getTime() : 0;
      const tb = b.lastAt ? new Date(b.lastAt).getTime() : 0;
      return tb - ta;
    });
  }, [employees, groups, lastByConvo, myId]);

  // Auto-select the first rail entry on first load
  useEffect(() => {
    if (selectedKey === null && rail.length > 0) {
      setSelectedKey(rail[0].key);
    }
  }, [rail, selectedKey]);

  // ── Selected entry + helper to load its thread ──────────────────────
  const selectedEntry = rail.find((r) => r.key === selectedKey) || null;

  const loadThread = async (entry: RailEntry) => {
    if (myId === undefined) return;
    setLoadingMessages(true);
    setError(null);
    try {
      if (entry.kind === "private") {
        const res = await chatService.getConversation(myId, entry.id);
        const list: ChatMessage[] = Array.isArray(res.data?.messages)
          ? res.data.messages
          : [];
        const otherEmp = employees.find((e) => e.id === entry.id);
        const otherColor = colorFor(entry.id);
        const otherName = otherEmp?.emp_name || otherEmp?.personal_email || `Employee #${entry.id}`;
        setMessages(
          list.map((m) => decorateMessage(m, myId, myName, otherName, otherColor))
        );
        if (list.length > 0) {
          const last = list[list.length - 1];
          setLastByConvo((prev) => ({
            ...prev,
            [`p:${entry.id}`]: {
              content: last.content || (last.other_documents ? "📎 Attachment" : ""),
              at: last.createdAt,
            },
          }));
        }
      } else {
        const res = await chatService.getGroupMessages(entry.id);
        // Backend returns a bare array of messages.
        const gdata: any = res.data;
        const list: GroupChatMessage[] = Array.isArray(gdata)
          ? gdata
          : Array.isArray(gdata?.messages)
          ? gdata.messages
          : [];
        setMessages(
          list.map((m) => decorateGroupMessage(m, myId, myName, colorFor(m.senderId || 0)))
        );
        if (list.length > 0) {
          const last = list[list.length - 1];
          setLastByConvo((prev) => ({
            ...prev,
            [`g:${entry.id}`]: {
              content: last.content || (last.other_documents ? "📎 Attachment" : ""),
              at: last.createdAt,
            },
          }));
        }
      }
    } catch (err: any) {
      console.error("Failed to load conversation", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load conversation."
      );
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedEntry) {
      loadThread(selectedEntry);
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  // Scroll to bottom whenever the message list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loadingMessages]);

  // ── Send message ────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!draft.trim() || !selectedEntry || myId === undefined) return;
    const text = draft.trim();
    setSending(true);
    setError(null);
    try {
      if (selectedEntry.kind === "private") {
        const res = await chatService.sendMessage({
          senderId: myId,
          receiverIds: [selectedEntry.id],
          content: text,
        });
        // 1:1 send: backend returns the bare message object.
        const created: ChatMessage | undefined = res.data;
        if (created) {
          const otherEmp = employees.find((e) => e.id === selectedEntry.id);
          const otherName = otherEmp?.emp_name || otherEmp?.personal_email || `Employee #${selectedEntry.id}`;
          const decorated = decorateMessage(created, myId, myName, otherName, colorFor(selectedEntry.id));
          setMessages((prev) => [...prev, decorated]);
          setLastByConvo((prev) => ({
            ...prev,
            [`p:${selectedEntry.id}`]: { content: text, at: created.createdAt || new Date().toISOString() },
          }));
        }
      } else {
        const res = await chatService.sendGroupMessage({
          groupId: selectedEntry.id,
          senderId: myId,
          content: text,
        });
        // Group send: backend returns { message: "Message sent successfully",
        // data: <GroupChatMessage> }. Pull the message object out of `data`.
        const created: GroupChatMessage | undefined = (res.data as any)?.data;
        if (created) {
          const decorated = decorateGroupMessage(created, myId, myName, colorFor(myId));
          setMessages((prev) => [...prev, decorated]);
          setLastByConvo((prev) => ({
            ...prev,
            [`g:${selectedEntry.id}`]: { content: text, at: created.createdAt || new Date().toISOString() },
          }));
        }
      }
      setDraft("");
    } catch (err: any) {
      console.error("Failed to send message", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // ── Create group ────────────────────────────────────────────────────
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (myId === undefined) return;
    if (!groupForm.groupName.trim() || groupForm.selectedMemberIds.length === 0) return;
    setCreatingGroup(true);
    setError(null);
    try {
      const res = await chatService.createGroup({
        groupName: groupForm.groupName.trim(),
        groupDescription: groupForm.description.trim() || undefined,
        adminId: myId,
        organizationID: orgId !== undefined ? String(orgId) : undefined,
        assignedMembers: groupForm.selectedMemberIds,
      });
      const newGroup: ChatGroup | undefined = res.data?.group;
      if (newGroup) {
        setGroups((prev) => [newGroup, ...prev]);
        setLastByConvo((prev) => ({
          ...prev,
          [`g:${newGroup.id}`]: {
            content: newGroup.groupDescription || "Group created",
            at: newGroup.createdAt || new Date().toISOString(),
          },
        }));
        setSelectedKey(`g:${newGroup.id}`);
      }
      setShowCreateGroupModal(false);
      setGroupForm({ groupName: "", description: "", selectedMemberIds: [] });
    } catch (err: any) {
      console.error("Failed to create group", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to create group."
      );
    } finally {
      setCreatingGroup(false);
    }
  };

  // ── Start a 1:1 chat with an employee (creates an empty local entry) ─
  const handleStartChatWithUser = (user: Employee) => {
    if (myId === undefined) return;
    const key = `p:${user.id}`;
    setLastByConvo((prev) => {
      if (prev[key]) return prev; // existing thread
      return { ...prev, [key]: { content: "Say hi 👋", at: new Date().toISOString() } };
    });
    setSelectedKey(key);
    setShowNewChatModal(false);
    setUserSearchTerm("");
  };

  const toggleMemberSelection = (memberId: number) => {
    setGroupForm((prev) => {
      const has = prev.selectedMemberIds.includes(memberId);
      return {
        ...prev,
        selectedMemberIds: has
          ? prev.selectedMemberIds.filter((m) => m !== memberId)
          : [...prev.selectedMemberIds, memberId],
      };
    });
  };

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rail;
    return rail.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.lastMessage.toLowerCase().includes(q)
    );
  }, [rail, searchTerm]);

  const filteredUsers = useMemo(() => {
    const q = userSearchTerm.trim().toLowerCase();
    return employees.filter(
      (u) =>
        (u.emp_name || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q) ||
        (u.personal_email || "").toLowerCase().includes(q) ||
        (u.position || "").toLowerCase().includes(q)
    );
  }, [employees, userSearchTerm]);

  if (myId === undefined) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" />
        <span>Please sign in to use chat.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* ── Left rail ─────────────────────────────────────────────── */}
          <div className="border-r border-[#937CB4]/20 flex flex-col min-h-0">
            <div className="p-4 border-b border-[#937CB4]/20 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowNewChatModal(true)}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] text-xs h-9"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Chat
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowCreateGroupModal(true)}
                  className="bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#937CB4] text-xs h-9"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Create Group
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              {loadingMeta ? (
                <div className="flex items-center justify-center py-10 text-[#5A4079] text-sm">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading…
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#5A4079]">
                  <MessageCircle className="h-10 w-10 mx-auto text-[#937CB4] opacity-40 mb-2" />
                  {rail.length === 0
                    ? "No conversations yet. Start a new chat or create a group."
                    : "No matches for your search."}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.key}
                    onClick={() => setSelectedKey(conv.key)}
                    className={`
                      p-4 border-b border-[#937CB4]/10 cursor-pointer transition-all duration-200
                      ${selectedKey === conv.key ? 'bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50' : 'hover:bg-[#F0E9FF]/30'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: conv.color }}
                        >
                          {initials(conv.name)}
                        </div>
                        {conv.kind === "private" && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-[#200B43] text-sm truncate flex items-center gap-1">
                            {conv.kind === "group" && <Users className="h-3 w-3 text-[#5A4079]" />}
                            {conv.name}
                          </h4>
                          <span className="text-xs text-[#5A4079] whitespace-nowrap ml-2">
                            {relativeTime(conv.lastAt || undefined)}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A4079] mb-1">{conv.subtitle}</p>
                        <p className="text-sm text-[#5A4079] truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right pane ────────────────────────────────────────────── */}
          <div className="md:col-span-2 flex flex-col min-h-0">
            {error && (
              <div className="m-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">{error}</div>
                <button onClick={() => setError(null)} aria-label="Dismiss">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {selectedEntry && (
              <div className="p-4 border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/30 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: selectedEntry.color }}
                      >
                        {initials(selectedEntry.name)}
                      </div>
                      {selectedEntry.kind === "private" && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#200B43] flex items-center gap-1">
                        {selectedEntry.kind === "group" && <Users className="h-4 w-4 text-[#5A4079]" />}
                        {selectedEntry.name}
                      </h3>
                      <p className="text-xs text-[#5A4079]">
                        {selectedEntry.kind === "private" ? "Active now" : selectedEntry.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-[#F0E9FF]" title="Voice Call">
                      <Phone className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-[#F0E9FF]" title="Video Call">
                      <Video className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-[#F0E9FF]" title="More Options">
                      <MoreVertical className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {!selectedEntry ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-[#937CB4] opacity-30 mb-3" />
                  <p className="text-[#5A4079]">Select a conversation to start chatting.</p>
                </div>
              ) : loadingMessages ? (
                <div className="flex items-center justify-center py-12 text-[#5A4079]">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading messages…
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-16 w-16 text-[#937CB4] opacity-30 mb-4" />
                  <p className="text-[#5A4079] text-lg font-medium">No messages yet</p>
                  <p className="text-[#958CA7] text-sm mt-2">Send the first message below.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!msg.isOwn && (
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ backgroundColor: msg.color }}
                        >
                          {msg.avatarInitials}
                        </div>
                      )}
                      <div>
                        <div
                          className={`
                            px-4 py-2 rounded-2xl
                            ${msg.isOwn
                              ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white rounded-tr-none'
                              : 'bg-[#F0E9FF] text-[#200B43] rounded-tl-none'}
                          `}
                        >
                          {!msg.isOwn && selectedEntry?.kind === "group" && (
                            <p className="text-[11px] font-semibold text-[#5A4079] mb-0.5">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-[#5A4079] mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/30 to-transparent">
              <div className="flex items-end gap-2">
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-[#F0E9FF]" title="Attach File" disabled>
                  <Paperclip className="h-4 w-4 text-[#5A4079]" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={selectedEntry ? "Type a message..." : "Select a conversation to start typing"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={!selectedEntry || sending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] disabled:opacity-50"
                  />
                  <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F0E9FF]" title="Add Emoji" disabled>
                    <Smile className="h-4 w-4 text-[#5A4079]" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!draft.trim() || !selectedEntry || sending}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] h-9 w-9 p-0 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Chat modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={showNewChatModal}
        onClose={() => {
          setShowNewChatModal(false);
          setUserSearchTerm("");
        }}
        title="Start New Chat"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
            <input
              type="text"
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              placeholder="Search for people to chat with..."
              className="w-full pl-10 pr-4 py-3 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              autoFocus
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loadingMeta ? (
              <div className="flex items-center justify-center py-6 text-[#5A4079] text-sm">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading employees…
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-[#937CB4] opacity-30 mx-auto mb-3" />
                <p className="text-[#5A4079]">
                  {userSearchTerm ? "No users found" : "Start typing to search for people"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const hasThread = !!lastByConvo[`p:${user.id}`];
                return (
                  <div
                    key={user.id}
                    onClick={() => handleStartChatWithUser(user)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gradient-to-r hover:from-[#F0E9FF] hover:to-[#F0E9FF]/50 border-2 border-transparent hover:border-[#937CB4]/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: colorFor(user.id) }}
                      >
                        {initials(user.emp_name || user.personal_email || `Employee #${user.id}`)}
                      </div>
                      <div>
                        <p className="font-medium text-[#200B43]">{user.emp_name || user.personal_email}</p>
                        <p className="text-xs text-[#5A4079]">{user.role}{user.position ? ` · ${user.position}` : ""}</p>
                        {user.personal_email && (
                          <p className="text-xs text-[#958CA7]">{user.personal_email}</p>
                        )}
                      </div>
                    </div>
                    {hasThread ? (
                      <div className="flex items-center gap-1 text-xs text-[#5A4079] bg-[#F0E9FF] px-2 py-1 rounded">
                        <MessageCircle className="h-3 w-3" />
                        <span>Open Chat</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462]"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* ── Create Group modal ────────────────────────────────────────── */}
      <Modal
        isOpen={showCreateGroupModal}
        onClose={() => {
          if (!creatingGroup) setShowCreateGroupModal(false);
        }}
        title="Create Group Chat"
        size="md"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#200B43] mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupForm.groupName}
              onChange={(e) => setGroupForm({ ...groupForm, groupName: e.target.value })}
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#200B43] mb-2">Description</label>
            <textarea
              value={groupForm.description}
              onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-[#937CB4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              placeholder="Brief description of the group"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#200B43] mb-2">
              Add Members <span className="text-red-500">*</span>
            </label>
            <div className="border border-[#937CB4]/30 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {loadingMeta ? (
                <div className="flex items-center justify-center py-3 text-[#5A4079] text-sm">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading…
                </div>
              ) : employees.length === 0 ? (
                <p className="text-xs text-[#5A4079] text-center py-3">No employees to add.</p>
              ) : (
                employees.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleMemberSelection(user.id)}
                    className={`
                      flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
                      ${groupForm.selectedMemberIds.includes(user.id)
                        ? 'bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]'
                        : 'hover:bg-[#F0E9FF]/30 border-2 border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: colorFor(user.id) }}
                      >
                        {initials(user.emp_name || `Employee #${user.id}`)}
                      </div>
                      <div>
                        <p className="font-medium text-[#200B43] text-sm">{user.emp_name || user.personal_email}</p>
                        <p className="text-xs text-[#5A4079]">{user.role}</p>
                      </div>
                    </div>
                    {groupForm.selectedMemberIds.includes(user.id) && (
                      <Check className="h-5 w-5 text-[#422462]" />
                    )}
                  </div>
                ))
              )}
            </div>
            {groupForm.selectedMemberIds.length > 0 && (
              <p className="text-xs text-[#5A4079] mt-2">
                {groupForm.selectedMemberIds.length} member(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateGroupModal(false)}
              disabled={creatingGroup}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={groupForm.selectedMemberIds.length === 0 || creatingGroup}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] disabled:opacity-50"
            >
              {creatingGroup ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────
function decorateMessage(
  m: ChatMessage,
  myId: number,
  myName: string,
  otherName: string,
  otherColor: string
): RenderedMessage {
  const isOwn = m.senderId === myId;
  return {
    id: m.id,
    senderId: m.senderId,
    senderName: isOwn ? myName : m.sender?.emp_name || otherName,
    content: m.content || (m.other_documents ? "📎 Attachment" : ""),
    time: timeLabel(m.createdAt),
    isOwn,
    avatarInitials: isOwn ? initials(myName) : initials(m.sender?.emp_name || otherName),
    color: isOwn ? "#422462" : otherColor,
  };
}

function decorateGroupMessage(
  m: GroupChatMessage,
  myId: number,
  myName: string,
  myColor: string
): RenderedMessage {
  const isOwn = m.senderId === myId;
  return {
    id: m.id,
    senderId: m.senderId,
    senderName: isOwn ? myName : m.sender?.emp_name || `User #${m.senderId}`,
    content: m.content || (m.other_documents ? "📎 Attachment" : ""),
    time: timeLabel(m.createdAt),
    isOwn,
    avatarInitials: isOwn ? initials(myName) : initials(m.sender?.emp_name || `User #${m.senderId}`),
    color: isOwn ? myColor : colorFor(m.senderId || 0),
  };
}
