const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// List all 1:1 messages (debug / fallback)
router.get("/messages", chatController.getMessages);

// Get the conversation thread between two users
router.get("/conversation/:senderId/:receiverId", chatController.getConversation);

// Get a single message
router.get("/messages/:id", chatController.getMessagesById);

// Send a new 1:1 message (multipart because the controller uses formidable)
router.post("/messages", chatController.createChatMessage);

// Edit a message
router.put("/messages/:id", chatController.updateMessageById);

// Delete (full) a chat message
router.delete("/messages/:id", chatController.deleteChat);

// Delete for me / for everyone
router.post("/messages/:id/delete-for-me", chatController.deleteMessageForMe);
router.post("/messages/:id/delete-for-everyone", chatController.deleteMessageForEveryone);

// Unread
router.get("/unread/:userId", chatController.getUnreadMessages);
router.post("/read/:userId/:senderId", chatController.markMessagesAsRead);

// 1:1 conversation partners (used to seed the chat rail)
router.get("/messages/partners/:userId", chatController.getChatPartners);

module.exports = router;
