const parseRequestFiles = require("../../fileUpload/requestedfile");
const groupService = require("../services/GroupMessagesService");

const sendMessageToGroup = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    const { groupId, senderId, content } = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    // if (!groupId || !senderId || !content) {
    //   return res
    //     .status(400)
    //     .json({ error: "groupId, senderId, and content are required." });
    // }

        if (!groupId || !senderId || (!content && (!files || Object.keys(files).length === 0))) {
      return res.status(400).json({ 
        error: "groupId, senderId, and either content or files are required." 
      });
    }

    const newMessage = await groupService.sendGroupMessage(
      groupId,
      parseInt(senderId),
      content || "",
      files
    );

    // Emit only to group members
if (req.io) {
      req.io.to(`group_${groupId}`).emit("groupMessage", newMessage);
    } else {
      console.warn("Socket.IO instance not found in request");
    }

    // Send push notifications to group members who are not currently connected to the group room
    try {
      const fcmUtil = require("../utils/fcm");
      // Fetch group members to get their ids and tokens
      const groupService = require("../services/GroupService");
      const group = await groupService.getGroupMembers(groupId);
      const memberIds = group.members.map((m) => m.id).filter((id) => id !== parseInt(senderId));

      const offline = [];
      memberIds.forEach((mid) => {
        const room = req.io.sockets.adapter.rooms.get(`${mid}`);
        if (!room || room.size === 0) offline.push(mid);
      });

      if (offline.length > 0) {
        const title = newMessage.sender?.emp_name || "New group message";
        const bodyText = newMessage.content ? String(newMessage.content).slice(0, 120) : "New message in group";
        await fcmUtil.sendToUserIds(offline, {
          notification: { title, body: bodyText },
          data: { type: "group_message", groupId: String(groupId), messageId: String(newMessage.id) },
        });
      }
    } catch (err) {
      console.error("Error sending group push notifications:", err);
    }

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ error: error.message });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await groupService.getGroupMessages(groupId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const setTypingStatus = (req, res) => {
  try {
    const { groupId, senderId, isTyping } = req.body;
    if (!groupId || !senderId) {
      return res.status(400).json({ error: "Missing groupId or senderId" });
    }
    req.io.to(`group_${groupId}`).emit("groupTyping", {
      groupId,
      senderId,
      isTyping,
    });
    res.status(200).json({ message: "Typing status broadcasted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Optional: Delete message for everyone in group
const deleteGroupMessage = async (req, res) => {
  try {
    const { messageId, groupId, senderId } = req.body;
    if (!messageId || !groupId || !senderId)
      return res.status(400).json({ error: "Missing required fields" });

    const result = await groupService.deleteGroupMessageForEveryone(
      messageId,
      senderId
    );

  if (req.io) {
      req.io.to(`group_${groupId}`).emit("groupMessageDeleted", {
        messageId,
        groupId,
      });
    } else {
      console.warn("Socket.IO instance not found in request");
    }

    res.status(200).json({ message: "Group message deleted for everyone" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGroupMessage = async (req, res) => {
  try {
    const { messageId, groupId } = req.params;
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    const body = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v[0]]));
    const { senderId, content } = body;

    if (!senderId) {
      return res.status(400).json({ error: "senderId is required." });
    }

    const updatedMessage = await groupService.updateGroupMessage(
      parseInt(messageId),
      parseInt(senderId),
      content,
      files
    );

    if (!req.io) {
      return res.status(500).json({ error: "Socket.IO instance not found." });
    }

    // Emit to the entire group room
    req.io.to(`group_${groupId}`).emit("groupMessageUpdated", updatedMessage);

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating group message:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteGroupMessageForMeControll = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    const result = await groupService.deleteGroupMessageForMe(parseInt(messageId), parseInt(userId));

    if (!req.io) {
      return res.status(500).json({ error: "Socket.IO instance not found." });
    }

    // Emit only to the user who deleted the message
    req.io.to(`${userId}`).emit("groupMessageDeletedForMe", result);

    res.status(200).json({ message: "Message deleted for you successfully." });
  } catch (error) {
    console.error("Error deleting group message for me:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessageToGroup,
  getGroupMessages,
  setTypingStatus,
  deleteGroupMessage,
  updateGroupMessage,
  deleteGroupMessageForMeControll,
};
