const SupportTicket = require("../models/supportTicket");
const SupportMessage = require("../models/supportMessage");

const ALLOWED_PRIORITIES = ["low", "medium", "high", "urgent"];
const ALLOWED_STATUSES = ["open", "in-progress", "resolved", "closed"];

// Normalize a message row for the API: decode the JSON `attachments` blob
// back into an array so the client never has to parse it.
const messageToApi = (row) => {
  if (!row) return row;
  const plain =
    typeof row.get === "function" ? row.get({ plain: true }) : { ...row };
  let attachments = [];
  if (Array.isArray(plain.attachments)) {
    attachments = plain.attachments;
  } else if (
    typeof plain.attachments === "string" &&
    plain.attachments.trim().length > 0
  ) {
    try {
      const parsed = JSON.parse(plain.attachments);
      attachments = Array.isArray(parsed) ? parsed : [];
    } catch {
      attachments = [];
    }
  }
  return { ...plain, attachments };
};

// Normalize a ticket row for the API, including its nested messages.
const ticketToApi = (row) => {
  if (!row) return row;
  const plain =
    typeof row.get === "function" ? row.get({ plain: true }) : { ...row };
  const messages = Array.isArray(plain.messages)
    ? plain.messages.map(messageToApi)
    : [];
  return { ...plain, messages };
};

const sanitizePriority = (value) =>
  ALLOWED_PRIORITIES.includes(value) ? value : "medium";

const sanitizeStatus = (value) =>
  ALLOWED_STATUSES.includes(value) ? value : "open";

// Create a ticket plus its opening message (seeded from the description).
const createTicket = async (payload = {}) => {
  const ticket = await SupportTicket.create({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    issueType: payload.issueType || "Bug/Error",
    priority: sanitizePriority(payload.priority),
    status: "open",
    description: payload.description,
    stepsToReproduce: payload.stepsToReproduce || null,
    browserInfo: payload.browserInfo || null,
    employeeId: payload.employeeId ?? null,
    organizationId: payload.organizationId ?? null,
  });

  // Derive the human-facing code from the generated id (TECH-1001, …).
  ticket.ticketCode = `TECH-${1000 + ticket.id}`;
  await ticket.save();

  // Seed the conversation with the user's initial description.
  if (payload.description) {
    await SupportMessage.create({
      ticketId: ticket.id,
      sender: "user",
      senderName: payload.name || "User",
      content: payload.description,
      attachments: null,
    });
  }

  return getTicketById(ticket.id);
};

// List tickets, optionally scoped to an employee and/or organization.
const getAllTickets = async (filters = {}) => {
  const where = {};
  if (filters.employeeId != null && filters.employeeId !== "") {
    where.employeeId = filters.employeeId;
  }
  if (filters.organizationId != null && filters.organizationId !== "") {
    where.organizationId = filters.organizationId;
  }

  const tickets = await SupportTicket.findAll({
    where,
    include: [{ model: SupportMessage, as: "messages" }],
    order: [
      ["createdAt", "DESC"],
      [{ model: SupportMessage, as: "messages" }, "createdAt", "ASC"],
    ],
  });
  return tickets.map(ticketToApi);
};

const getTicketById = async (id) => {
  const ticket = await SupportTicket.findByPk(id, {
    include: [{ model: SupportMessage, as: "messages" }],
    order: [[{ model: SupportMessage, as: "messages" }, "createdAt", "ASC"]],
  });
  return ticket ? ticketToApi(ticket) : null;
};

// Append a message to an existing ticket's thread.
const addMessage = async (ticketId, payload = {}) => {
  const ticket = await SupportTicket.findByPk(ticketId);
  if (!ticket) return null;

  await SupportMessage.create({
    ticketId: ticket.id,
    sender: payload.sender === "support" ? "support" : "user",
    senderName: payload.senderName || ticket.name || "User",
    content: payload.content,
    attachments:
      Array.isArray(payload.attachments) && payload.attachments.length > 0
        ? JSON.stringify(payload.attachments)
        : null,
  });

  return getTicketById(ticket.id);
};

// Update mutable ticket fields (currently status / priority).
const updateTicket = async (id, payload = {}) => {
  const ticket = await SupportTicket.findByPk(id);
  if (!ticket) return null;

  const updates = {};
  if (payload.status !== undefined) updates.status = sanitizeStatus(payload.status);
  if (payload.priority !== undefined)
    updates.priority = sanitizePriority(payload.priority);

  await ticket.update(updates);
  return getTicketById(id);
};

const deleteTicket = async (id) => {
  await SupportMessage.destroy({ where: { ticketId: id } });
  return SupportTicket.destroy({ where: { id } });
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  addMessage,
  updateTicket,
  deleteTicket,
};
