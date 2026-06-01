const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const groupMessagesController = require("../controllers/groupMessagesController");

// Group Management
router.post("/groups", groupController.createGroup);
router.put("/groups/:id", groupController.updateGroup);
router.get("/groups", groupController.getAllGroups);
router.get("/groupsorganizationId/:id", groupController.getGroupsByOrgId);
router.delete("/groups/:id", groupController.deleteGroup);
router.get("/groupsMembers/:groupId", groupController.getAllMembersInGroup);

// Group Messaging
router.post("/groups/:groupId/messages", groupMessagesController.sendMessageToGroup);
router.get("/groups/:groupId/allmessages", groupMessagesController.getGroupMessages);
router.post("/groups/typing", groupMessagesController.setTypingStatus);
router.put("/groups/:groupId/messages/:messageId", groupMessagesController.updateGroupMessage);
router.delete("/groups/:groupId/messages/:messageId/delete", groupMessagesController.deleteGroupMessage);
router.post("/groups/messages/:messageId/delete-for-me", groupMessagesController.deleteGroupMessageForMeControll);

module.exports = router;
