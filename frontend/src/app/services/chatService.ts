import api from '../api';

// ── 1:1 Chat ──────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: number;
  content: string | null;
  senderId: number;
  other_documents?: string | null;
  isDeletedForEveryone?: boolean;
  createdAt: string;
  updatedAt?: string;
  sender?: { id: number; emp_name: string };
  receivers?: { id: number; emp_name: string }[];
  replyToMessageId?: number | null;
  replyContent?: string | null;
}

export interface GroupChatMessage {
  id: number;
  groupId: number;
  senderId: number;
  content: string | null;
  other_documents?: string | null;
  isDeletedForEveryone?: boolean;
  createdAt: string;
  updatedAt?: string;
  sender?: { id: number; emp_name: string };
}

export interface ChatGroup {
  id: number;
  groupName: string;
  groupDescription?: string | null;
  adminId: number;
  organizationID?: string | null;
  image_URL?: string | null;
  members?: { id: number; emp_name: string }[];
  admin?: { id: number; emp_name: string };
  createdAt?: string;
  updatedAt?: string;
}

export const chatService = {
  // 1:1 — get all messages in a thread between two users
  getConversation: (senderId: number, receiverId: number) => {
    return api.get<{ messages: ChatMessage[] }>(
      `/api/conversation/${senderId}/${receiverId}`
    );
  },

  // 1:1 — list every 1:1 partner the user has ever exchanged messages
  // with, plus the most recent message in each thread. Used to build
  // the chat rail on a fresh page load.
  getChatPartners: (userId: number) => {
    return api.get<{
      partners: Array<{
        partnerId: number;
        lastMessage: string;
        lastAt: string | null;
      }>;
    }>(`/api/messages/partners/${userId}`);
  },

  // 1:1 — send a message. The server expects multipart/form-data
  // (the controller uses formidable). We send a FormData blob.
  sendMessage: (data: {
    senderId: number;
    receiverIds: number[];
    content: string;
  }) => {
    const form = new FormData();
    form.append("senderId", String(data.senderId));
    form.append("content", data.content);
    form.append("receiverIds", JSON.stringify(data.receiverIds));
    // The 1:1 send endpoint returns the bare message object.
    return api.post<ChatMessage>(
      "/api/messages",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // Groups — list all groups (optionally filtered by organization)
  getGroups: (orgId?: number | string) => {
    if (orgId !== undefined && orgId !== null) {
      return api.get<ChatGroup[]>(`/api/groupsorganizationId/${orgId}`);
    }
    return api.get<ChatGroup[]>("/api/groups");
  },

  // Groups — get messages for a specific group
  // The server returns a bare array, not a wrapped object.
  getGroupMessages: (groupId: number) => {
    return api.get<GroupChatMessage[]>(
      `/api/groups/${groupId}/allmessages`
    );
  },

  // Groups — send a message to a group (multipart/form-data)
  sendGroupMessage: (data: {
    groupId: number;
    senderId: number;
    content: string;
  }) => {
    const form = new FormData();
    form.append("groupId", String(data.groupId));
    form.append("senderId", String(data.senderId));
    form.append("content", data.content);
    // The send endpoint returns { message, data: <GroupChatMessage> }.
    return api.post<{ message: string; data: GroupChatMessage }>(
      `/api/groups/${data.groupId}/messages`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // Groups — create a new group (multipart/form-data)
  createGroup: (data: {
    groupName: string;
    groupDescription?: string;
    adminId: number;
    organizationID?: string | number;
    assignedMembers: number[];
  }) => {
    const form = new FormData();
    form.append("groupName", data.groupName);
    if (data.groupDescription) {
      form.append("groupDescription", data.groupDescription);
    }
    form.append("adminId", String(data.adminId));
    if (data.organizationID !== undefined && data.organizationID !== null) {
      form.append("organizationID", String(data.organizationID));
    }
    form.append("assignedMembers", JSON.stringify(data.assignedMembers));
    return api.post<{ message: string; group: ChatGroup }>("/api/groups", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
