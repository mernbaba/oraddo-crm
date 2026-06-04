import api from '../api';

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type MessageSender = "user" | "support";

export interface SupportMessage {
  id: number;
  ticketId: number;
  sender: MessageSender;
  senderName: string | null;
  content: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportTicket {
  id: number;
  ticketCode: string | null;
  name: string;
  email: string;
  subject: string;
  issueType: string;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  stepsToReproduce: string | null;
  browserInfo: string | null;
  employeeId?: number | null;
  organizationId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  messages: SupportMessage[];
}

export interface CreateTicketPayload {
  name: string;
  email: string;
  subject: string;
  issueType: string;
  priority: TicketPriority;
  description: string;
  stepsToReproduce?: string;
  browserInfo?: string;
  // Owner context — forwarded so the ticket is scoped to the current employee
  // / organization (mirrors how the notes module passes employeeId).
  employeeId?: number;
  organizationId?: number;
}

export interface AddMessagePayload {
  content: string;
  sender?: MessageSender;
  senderName?: string;
  attachments?: string[];
}

export const supportService = {
  // Create a new support ticket
  createTicket: (payload: CreateTicketPayload) => {
    return api.post('/api/supportTickets', payload);
  },

  // Get all tickets, optionally scoped to an employee / organization
  getTickets: (filters?: { employeeId?: number; organizationId?: number }) => {
    const params: Record<string, number> = {};
    if (filters?.employeeId != null) params.employeeId = filters.employeeId;
    if (filters?.organizationId != null) params.organizationId = filters.organizationId;
    return api.get('/api/supportTickets', { params });
  },

  // Get a single ticket with its conversation thread
  getTicketById: (id: number) => {
    return api.get(`/api/supportTickets/${id}`);
  },

  // Append a message to a ticket's conversation
  addMessage: (id: number, payload: AddMessagePayload) => {
    return api.post(`/api/supportTickets/${id}/messages`, payload);
  },

  // Update a ticket's status / priority
  updateTicket: (id: number, payload: { status?: TicketStatus; priority?: TicketPriority }) => {
    return api.put(`/api/supportTickets/${id}`, payload);
  },

  // Delete a ticket
  deleteTicket: (id: number) => {
    return api.delete(`/api/supportTickets/${id}`);
  },
};
