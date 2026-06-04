const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

// Create a new support ticket
router.post("/supportTickets", supportController.createTicket);

// Get all support tickets (optionally filtered via ?employeeId= & ?organizationId=)
router.get("/supportTickets", supportController.getAllTickets);

// Get a single support ticket (with its conversation thread)
router.get("/supportTickets/:id", supportController.getTicketById);

// Append a message to a ticket's conversation
router.post("/supportTickets/:id/messages", supportController.addMessage);

// Update a ticket (status / priority)
router.put("/supportTickets/:id", supportController.updateTicket);

// Delete a ticket and its messages
router.delete("/supportTickets/:id", supportController.deleteTicket);

module.exports = router;
