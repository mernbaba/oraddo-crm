const supportService = require("../services/supportService");

const createTicket = async (req, res) => {
  try {
    const { name, email, subject, description } = req.body;
    if (!name || !email || !subject || !description) {
      return res.status(400).json({
        error: "name, email, subject and description are required",
      });
    }
    const ticket = await supportService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const { employeeId, organizationId } = req.query;
    const tickets = await supportService.getAllTickets({
      employeeId,
      organizationId,
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await supportService.getTicketById(req.params.id);
    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Support ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    if (!req.body || !req.body.content) {
      return res.status(400).json({ error: "content is required" });
    }
    const ticket = await supportService.addMessage(req.params.id, req.body);
    if (ticket) {
      res.status(201).json(ticket);
    } else {
      res.status(404).json({ message: "Support ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await supportService.updateTicket(req.params.id, req.body);
    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Support ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const deleted = await supportService.deleteTicket(req.params.id);
    if (deleted) {
      res.status(200).json({ message: "Support ticket deleted successfully" });
    } else {
      res.status(404).json({ message: "Support ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  addMessage,
  updateTicket,
  deleteTicket,
};
