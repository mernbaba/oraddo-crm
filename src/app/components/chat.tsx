import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Sparkles, Plus, Users, X, UserPlus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
  color: string;
  isGroup?: boolean;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  avatar?: string;
}

export function Chat() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Create Group Form
  const [groupForm, setGroupForm] = useState({
    groupName: "",
    description: "",
    selectedMembers: [] as string[]
  });

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      lastMessage: "Sure, I'll send over the campaign details",
      time: "2m ago",
      unread: 2,
      online: true,
      avatar: "SJ",
      color: "#422462",
    },
    {
      id: 2,
      name: "Development Team",
      role: "5 members",
      lastMessage: "Mike: The new feature is ready for testing",
      time: "15m ago",
      unread: 0,
      online: true,
      avatar: "DT",
      color: "#5A4079",
      isGroup: true,
    },
    {
      id: 3,
      name: "John Doe",
      role: "Project Manager",
      lastMessage: "Let's schedule a meeting for tomorrow",
      time: "1h ago",
      unread: 1,
      online: false,
      avatar: "JD",
      color: "#937CB4",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Designer",
      lastMessage: "I've updated the mockups",
      time: "3h ago",
      unread: 0,
      online: true,
      avatar: "ER",
      color: "#958CA7",
    },
    {
      id: 5,
      name: "Finance Department",
      role: "8 members",
      lastMessage: "Budget approved for Q2",
      time: "5h ago",
      unread: 0,
      online: false,
      avatar: "FD",
      color: "#422462",
      isGroup: true,
    },
  ]);

  const [chatMessages, setChatMessages] = useState<{ [key: number]: Message[] }>({
    1: [
      {
        id: 1,
        sender: "Sarah Johnson",
        content: "Hi! Did you review the latest marketing proposal?",
        time: "10:30 AM",
        isOwn: false,
        avatar: "SJ",
      },
      {
        id: 2,
        sender: "You",
        content: "Yes, I went through it. The campaign strategy looks solid. I have a few suggestions though.",
        time: "10:32 AM",
        isOwn: true,
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        content: "Great! I'd love to hear your thoughts. Should we set up a quick call?",
        time: "10:33 AM",
        isOwn: false,
        avatar: "SJ",
      },
      {
        id: 4,
        sender: "You",
        content: "Sure, how about 2 PM today?",
        time: "10:35 AM",
        isOwn: true,
      },
      {
        id: 5,
        sender: "Sarah Johnson",
        content: "Perfect! I'll send a calendar invite.",
        time: "10:36 AM",
        isOwn: false,
        avatar: "SJ",
      },
      {
        id: 6,
        sender: "Sarah Johnson",
        content: "Sure, I'll send over the campaign details",
        time: "10:38 AM",
        isOwn: false,
        avatar: "SJ",
      },
    ],
    2: [
      {
        id: 1,
        sender: "Mike Chen",
        content: "Hey team, I've completed the new feature implementation",
        time: "9:15 AM",
        isOwn: false,
        avatar: "MC",
      },
      {
        id: 2,
        sender: "You",
        content: "That's great! Can you share the details?",
        time: "9:20 AM",
        isOwn: true,
      },
      {
        id: 3,
        sender: "Mike Chen",
        content: "The new feature is ready for testing",
        time: "9:45 AM",
        isOwn: false,
        avatar: "MC",
      },
    ],
    3: [
      {
        id: 1,
        sender: "John Doe",
        content: "Let's schedule a meeting for tomorrow",
        time: "Yesterday",
        isOwn: false,
        avatar: "JD",
      },
    ],
    4: [
      {
        id: 1,
        sender: "Emily Rodriguez",
        content: "I've updated the mockups",
        time: "11:30 AM",
        isOwn: false,
        avatar: "ER",
      },
    ],
    5: [
      {
        id: 1,
        sender: "Finance Team",
        content: "Budget approved for Q2",
        time: "8:00 AM",
        isOwn: false,
        avatar: "FT",
      },
    ],
  });

  const availableUsers = [
    { id: 1, name: "Michael Thompson", role: "Developer", email: "michael@company.com" },
    { id: 2, name: "Lisa Anderson", role: "Designer", email: "lisa@company.com" },
    { id: 3, name: "David Chen", role: "Product Manager", email: "david@company.com" },
    { id: 4, name: "Rachel Green", role: "Marketing Specialist", email: "rachel@company.com" },
    { id: 5, name: "Tom Wilson", role: "Sales Manager", email: "tom@company.com" },
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const currentMessages = chatMessages[selectedChat] || [];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: currentMessages.length + 1,
      sender: "You",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setChatMessages({
      ...chatMessages,
      [selectedChat]: [...currentMessages, newMessage]
    });

    // Update last message in conversation
    setConversations(conversations.map(conv => 
      conv.id === selectedChat 
        ? { ...conv, lastMessage: message, time: "Just now", unread: 0 }
        : conv
    ));

    setMessage("");
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colors = ["#422462", "#5A4079", "#937CB4", "#958CA7"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newConversation: Conversation = {
      id: conversations.length + 1,
      name: newChatForm.name,
      role: newChatForm.role,
      lastMessage: "No messages yet",
      time: "Just now",
      unread: 0,
      online: true,
      avatar: newChatForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      color: randomColor,
    };

    setConversations([newConversation, ...conversations]);
    setChatMessages({
      ...chatMessages,
      [newConversation.id]: []
    });
    
    setShowNewChatModal(false);
    setNewChatForm({ name: "", email: "", role: "" });
    setSelectedChat(newConversation.id);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGroup: Conversation = {
      id: conversations.length + 1,
      name: groupForm.groupName,
      role: `${groupForm.selectedMembers.length} members`,
      lastMessage: "Group created",
      time: "Just now",
      unread: 0,
      online: true,
      avatar: groupForm.groupName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      color: "#5A4079",
      isGroup: true,
    };

    setConversations([newGroup, ...conversations]);
    setChatMessages({
      ...chatMessages,
      [newGroup.id]: [
        {
          id: 1,
          sender: "System",
          content: `Group "${groupForm.groupName}" has been created with ${groupForm.selectedMembers.length} members.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
        }
      ]
    });
    
    setShowCreateGroupModal(false);
    setGroupForm({ groupName: "", description: "", selectedMembers: [] });
    setSelectedChat(newGroup.id);
  };

  const toggleMemberSelection = (memberName: string) => {
    setGroupForm({
      ...groupForm,
      selectedMembers: groupForm.selectedMembers.includes(memberName)
        ? groupForm.selectedMembers.filter(m => m !== memberName)
        : [...groupForm.selectedMembers, memberName]
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleStartChatWithUser = (user: typeof availableUsers[0]) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      conv => conv.name.toLowerCase() === user.name.toLowerCase()
    );

    if (existingConversation) {
      // Open existing conversation
      setSelectedChat(existingConversation.id);
      setShowNewChatModal(false);
      setUserSearchTerm("");
    } else {
      // Create new conversation
      const colors = ["#422462", "#5A4079", "#937CB4", "#958CA7"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newConversation: Conversation = {
        id: conversations.length + 1,
        name: user.name,
        role: user.role,
        lastMessage: "No messages yet",
        time: "Just now",
        unread: 0,
        online: true,
        avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        color: randomColor,
      };

      setConversations([newConversation, ...conversations]);
      setChatMessages({
        ...chatMessages,
        [newConversation.id]: []
      });
      
      setShowNewChatModal(false);
      setUserSearchTerm("");
      setSelectedChat(newConversation.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-[#937CB4]/20 flex flex-col">
            {/* Search */}
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
              
              {/* Action Buttons */}
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

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`
                    p-4 border-b border-[#937CB4]/10 cursor-pointer transition-all duration-200
                    ${selectedChat === conv.id ? 'bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50' : 'hover:bg-[#F0E9FF]/30'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: conv.color }}
                      >
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-[#200B43] text-sm truncate">{conv.name}</h4>
                        <span className="text-xs text-[#5A4079] whitespace-nowrap ml-2">{conv.time}</span>
                      </div>
                      <p className="text-xs text-[#5A4079] mb-1">{conv.role}</p>
                      <p className="text-sm text-[#5A4079] truncate">{conv.lastMessage}</p>
                    </div>

                    {conv.unread > 0 && (
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center text-white text-xs font-semibold">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {/* Chat Header */}
            {selectedConversation && (
              <div className="p-4 border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/30 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: selectedConversation.color }}
                      >
                        {selectedConversation.avatar}
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#200B43]">{selectedConversation.name}</h3>
                      <p className="text-xs text-[#5A4079]">
                        {selectedConversation.online ? 'Active now' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 w-9 p-0 hover:bg-[#F0E9FF]"
                      title="Voice Call"
                    >
                      <Phone className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 w-9 p-0 hover:bg-[#F0E9FF]"
                      title="Video Call"
                    >
                      <Video className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 w-9 p-0 hover:bg-[#F0E9FF]"
                      title="More Options"
                    >
                      <MoreVertical className="h-4 w-4 text-[#5A4079]" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-16 w-16 text-[#937CB4] opacity-30 mb-4" />
                  <p className="text-[#5A4079] text-lg font-medium">No messages yet</p>
                  <p className="text-[#958CA7] text-sm mt-2">Start the conversation by sending a message</p>
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[70%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!msg.isOwn && (
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ backgroundColor: selectedConversation?.color }}
                        >
                          {msg.avatar || "U"}
                        </div>
                      )}
                      <div>
                        <div
                          className={`
                            px-4 py-2 rounded-2xl
                            ${msg.isOwn
                              ? 'bg-gradient-to-r from-[#422462] to-[#5A4079] text-white rounded-tr-none'
                              : 'bg-[#F0E9FF] text-[#200B43] rounded-tl-none'
                            }
                          `}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-[#5A4079] mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/30 to-transparent">
              <div className="flex items-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 w-9 p-0 hover:bg-[#F0E9FF]"
                  title="Attach File"
                >
                  <Paperclip className="h-4 w-4 text-[#5A4079]" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F0E9FF]"
                    title="Add Emoji"
                  >
                    <Smile className="h-4 w-4 text-[#5A4079]" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] h-9 w-9 p-0 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
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
          {/* Search Bar */}
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

          {/* User List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-[#937CB4] opacity-30 mx-auto mb-3" />
                <p className="text-[#5A4079]">
                  {userSearchTerm ? "No users found" : "Start typing to search for people"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const existingChat = conversations.find(
                  conv => conv.name.toLowerCase() === user.name.toLowerCase()
                );
                
                return (
                  <div
                    key={user.id}
                    onClick={() => handleStartChatWithUser(user)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gradient-to-r hover:from-[#F0E9FF] hover:to-[#F0E9FF]/50 border-2 border-transparent hover:border-[#937CB4]/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: existingChat?.color || "#937CB4" }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#200B43]">{user.name}</p>
                        <p className="text-xs text-[#5A4079]">{user.role}</p>
                        <p className="text-xs text-[#958CA7]">{user.email}</p>
                      </div>
                    </div>
                    {existingChat ? (
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

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#200B43] mb-2">
              Description
            </label>
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
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => toggleMemberSelection(user.name)}
                  className={`
                    flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
                    ${groupForm.selectedMembers.includes(user.name)
                      ? 'bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 border-2 border-[#937CB4]'
                      : 'hover:bg-[#F0E9FF]/30 border-2 border-transparent'
                    }
                  `}
                >
                  <div>
                    <p className="font-medium text-[#200B43] text-sm">{user.name}</p>
                    <p className="text-xs text-[#5A4079]">{user.role}</p>
                  </div>
                  {groupForm.selectedMembers.includes(user.name) && (
                    <Check className="h-5 w-5 text-[#422462]" />
                  )}
                </div>
              ))}
            </div>
            {groupForm.selectedMembers.length > 0 && (
              <p className="text-xs text-[#5A4079] mt-2">
                {groupForm.selectedMembers.length} member(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowCreateGroupModal(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={groupForm.selectedMembers.length === 0}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] disabled:opacity-50"
            >
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}