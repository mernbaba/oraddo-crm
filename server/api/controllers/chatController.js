const parseRequestFiles = require("../../fileUpload/requestedfile");
const messageService = require("../services/ChatService");

const createChatMessage = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);

    // Handle files if they exist
    if (payload.files && Object.keys(payload.files).length > 0) {
      req.body = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        req.body[key] = value[0];
      }
      req.files = payload.files;
    } else {
      req.body = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        req.body[key] = value[0];
      }
    }

    // Ensure senderId is present
    if (!req.body.senderId) {
      return res.status(400).json({ error: "senderId is required." });
    }
    // Pass data to the service
    const { body, files } = req;
    console.log(body, "bbbbbbbb");
    console.log(body.senderId, "senderIDiddid");
    const message = await messageService.createMessage(body, files);
    const parsedReceiverIds = JSON.parse(body.receiverIds);
    if (!req.io) {
      return res.status(500).json({ error: "Socket.IO instance not found." });
    }
        // Emit via sockets to connected receivers
        parsedReceiverIds.forEach((receiverId) => {
          req.io.to(`${receiverId}`).emit("chatsystem", message);
        });

        try {
          const fcmUtil = require("../utils/fcm");
          const disconnected = [];
          // Determine connected socket ids for each receiver (room named by user id)
          const sockets = req.io.sockets.sockets; // Map of socketId -> Socket
          parsedReceiverIds.forEach((rid) => {
            const roomName = `${rid}`;
            const room = req.io.sockets.adapter.rooms.get(roomName);
            if (!room || room.size === 0) {
              disconnected.push(rid);
            }
          });

          if (disconnected.length > 0) {
            const title = message.sender && message.sender.emp_name ? message.sender.emp_name : "New message";
            const bodyText = message.content ? String(message.content).slice(0, 120) : "You have a new message";
            await fcmUtil.sendToUserIds(disconnected, {
              notification: { title, body: bodyText },
              data: { type: "chat", messageId: String(message.id), senderId: String(message.senderId) },
            });
          }
        } catch (err) {
          console.error("Error sending push notifications for chat message:", err);
        }
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating chat message:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getChats();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMessagesById = async (req, res) => {
  try {
    const message = await messageService.getChatById(req.params.id);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMessageById = async (req, res) => {
  try {
    const {id}=req.params
    const payload = await parseRequestFiles(req);

    // Extract fields & files
    const {fields, files} = payload;
    // for (const [key, value] of Object.entries(payload.fields)) {
    //   fields[key] = value[0];
    // }
    // const files = payload.files || {};
        const body = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v[0]]));
    const { senderId, content, receiverId } = body;
    // const { id } = req.params;
    // const { senderId, receiverId } = fields;

if (!senderId) {
  return res.status(400).json({ error: "senderId is required" });
}
    // Call service
const updatedMessage = await messageService.updateMessageContent(
  id,
  senderId,
  { content },   // ✅ send object
  files
);


    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    if(!req.io){
      return res.status(500).join({error:"socket.io instant not found"})
    }
    // Emit socket updates
    req.io.to(`${senderId}`).emit("messageUpdated", updatedMessage);

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ error: error.message });
  }
};


const deleteChat = async (req, res) => {
  const { id } = req.params;
  const { senderId, receiverId } = req.body; // Retrieve senderId and receiverId from the request body

  try {
    // Call the service layer to delete the message
    const { message, receiverIds } = await messageService.deleteMessageByIds(
      id,
      senderId,
      receiverId
    );

    // Socket.IO instance check
    if (!req.io) {
      console.error("Socket.IO instance not found.");
      return res.status(500).json({ error: "Socket.IO instance not found." });
    }

    // Notify the sender and receivers about the message deletion
    req.io.to(`${senderId}`).emit("messageDeleted", { id }); // Notify the sender
    receiverIds.forEach((receiverId) => {
      req.io.to(`${receiverId}`).emit("messageDeleted", { id }); // Notify each receiver
    });

    // Respond with success message
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMessageForMe = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(id, userId, "id userId in controller");
  if (!id || !userId) {
    return res
      .status(400)
      .json({ error: "Message ID and User ID are required" });
  }
  try {
    const result = await messageService.deleteMessageForMe(id, userId);
    
    if (!req.io) {
      return res.status(500).json({ error: "Socket.IO instance not found." });
    }
    // Emit only to the user who deleted the message
    req.io.to(`${userId}`).emit("messageDeletedForMe", { messageId: id, userId });

    res.status(200).json({ message: "Message deleted for you." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMessageForEveryone = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  try {
    const result = await messageService.deleteMessageForEveryone(id, userId);
    req.io.emit("messageDeletedForEveryone", result);
    res.status(200).json({ message: "Message deleted for everyone." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUnreadMessages = async (req, res) => {
  try {
    // const { userId } = req.params;
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const unreadData = await messageService.getUnreadMessages(userId);
    res.status(200).json(unreadData);
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({ error: error.message });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { userId, senderId } = req.params;
    await messageService.markMessagesAsRead(userId, senderId);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: error.message });
  }
};

// Reply privately from a group to a specific receiver
const replyPrivateFromGroup = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    const body = Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v[0]]));

    const { groupId, senderId, receiverId, replyToMessageId, content } = body;
    if (!groupId || !senderId || !receiverId || !replyToMessageId) {
      return res.status(400).json({ error: 'groupId, senderId, receiverId and replyToMessageId are required' });
    }

    // Delegate to group service to create a private reply message
    const groupService = require('../services/GroupMessagesService');
    const created = await groupService.sendPrivateReplyFromGroup({
      groupId: parseInt(groupId),
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      replyToMessageId: parseInt(replyToMessageId),
      content: content || null,
      files,
    });

    // Emit via socket to the specific receiver and sender
    if (!req.io) return res.status(500).json({ error: 'Socket.IO instance not found.' });
    req.io.to(`${receiverId}`).emit('privateReply', created);
    req.io.to(`${senderId}`).emit('privateReply', created);

    // Push notify if receiver not connected
    try {
      const fcmUtil = require('../utils/fcm');
      const room = req.io.sockets.adapter.rooms.get(`${receiverId}`);
      if (!room || room.size === 0) {
        const title = created.sender && created.sender.emp_name ? created.sender.emp_name : 'Private reply';
        const bodyText = created.content ? String(created.content).slice(0,120) : 'You have a private reply';
        await fcmUtil.sendToUserIds([receiverId], { notification: { title, body: bodyText }, data: { type: 'private_reply', messageId: String(created.id) } });
      }
    } catch (err) {
      console.error('Error sending FCM for private reply:', err);
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error in replyPrivateFromGroup:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Reply inside a group chat (visible to group members)
const replyInGroup = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    const body = Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v[0]]));

    const { groupId, senderId, replyToMessageId, content } = body;
    if (!groupId || !senderId || !replyToMessageId) {
      return res.status(400).json({ error: 'groupId, senderId and replyToMessageId are required' });
    }

    const groupService = require('../services/GroupMessagesService');
    const created = await groupService.sendGroupReply({
      groupId: parseInt(groupId),
      senderId: parseInt(senderId),
      replyToMessageId: parseInt(replyToMessageId),
      content: content || null,
      files,
    });

    if (!req.io) return res.status(500).json({ error: 'Socket.IO instance not found.' });
    req.io.to(`group_${groupId}`).emit('groupReply', created);

    // Send FCM to group members not connected
    try {
      const fcmUtil = require('../utils/fcm');
      // groupService should return memberIds on created object
      const memberIds = created.groupMemberIds || [];
      const disconnected = [];
      memberIds.forEach((mid) => {
        const room = req.io.sockets.adapter.rooms.get(`${mid}`);
        if (!room || room.size === 0) disconnected.push(mid);
      });
      if (disconnected.length > 0) {
        const title = created.sender && created.sender.emp_name ? created.sender.emp_name : 'Group reply';
        const bodyText = created.content ? String(created.content).slice(0,120) : 'New reply in group';
        await fcmUtil.sendToUserIds(disconnected, { notification: { title, body: bodyText }, data: { type: 'group_reply', messageId: String(created.id) } });
      }
    } catch (err) {
      console.error('Error sending FCM for group reply:', err);
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error in replyInGroup:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Reply inside a personal chat
const replyInPersonalChat = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    const body = Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v[0]]));

    const { senderId, receiverId, replyToMessageId, content } = body;
    if (!senderId || !receiverId || !replyToMessageId) {
      return res.status(400).json({ error: 'senderId, receiverId and replyToMessageId are required' });
    }

    // Use chat service to create a message with reply metadata
    const created = await messageService.createMessage({
      senderId: parseInt(senderId),
      receiverIds: JSON.stringify([parseInt(receiverId)]),
      content: content || null,
      replyToMessageId: parseInt(replyToMessageId),
      replyType: 'personal',
    }, files);

    if (!req.io) return res.status(500).json({ error: 'Socket.IO instance not found.' });
    req.io.to(`${receiverId}`).emit('personalReply', created);
    req.io.to(`${senderId}`).emit('personalReply', created);

    try {
      const fcmUtil = require('../utils/fcm');
      const room = req.io.sockets.adapter.rooms.get(`${receiverId}`);
      if (!room || room.size === 0) {
        const title = created.sender && created.sender.emp_name ? created.sender.emp_name : 'Reply';
        const bodyText = created.content ? String(created.content).slice(0,120) : 'You have a reply';
        await fcmUtil.sendToUserIds([receiverId], { notification: { title, body: bodyText }, data: { type: 'personal_reply', messageId: String(created.id) } });
      }
    } catch (err) {
      console.error('Error sending FCM for personal reply:', err);
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error in replyInPersonalChat:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const result = await messageService.getConversationMessages(
      parseInt(senderId, 10),
      parseInt(receiverId, 10)
    );
    // Best-effort live push to both participants
    try {
      if (req.io) {
        req.io.to(`${senderId}`).emit("conversation", { messages: result });
        req.io.to(`${receiverId}`).emit("conversation", { messages: result });
      }
    } catch (emitErr) {
      console.error("getConversation emit failed (non-fatal):", emitErr.message);
    }
    res.status(200).json({ messages: result });
  } catch (error) {
    console.error("Error in getConversation controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getChatPartners = async (req, res) => {
  try {
    const { userId } = req.params;
    const partners = await messageService.getChatPartners(parseInt(userId, 10));
    res.status(200).json({ partners });
  } catch (error) {
    console.error("getChatPartners error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatMessage,
  getMessages,
  getMessagesById,
  getConversation,
  updateMessageById,
  deleteChat,
  deleteMessageForMe,
  deleteMessageForEveryone,
  replyPrivateFromGroup,
  replyInGroup,
  replyInPersonalChat,
  getUnreadMessages,
  markMessagesAsRead,
  getChatPartners
};
