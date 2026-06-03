const express = require("express");
const sequelize = require("../../config/database");
const router = express.Router();
const { Op } = require("sequelize");
const GroupMessage = require("../models/GroupMessages");
const GroupChat = require("../models/GroupModel");
const { Message, MessageVisibility } = require("../models/ChatModel");
const Emp_onboarding = require("../models/Emp_onboarding");
const EmployeeDocument = require("../models/empDocuments");
const uploadFile = require("../../fileUpload/fileupload");
const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");

const uploadFiles = async (files) => {
  const uploadPromises = files?.map((file) =>
    uploadFile(file, ALLOWED_EMP_DOC_TYPES)
  );
  try {
    const results = await Promise.all(uploadPromises);
    console.log(results, "results");
    const uploadedData = {
      image_URL: results[0].success ? results[0].url : null,

      // other_documents : results[1].success ? results[1].url : null
    };
    console.log(uploadedData, "datauploaded");
    return uploadedData;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
};

const createMessage = async (data, files) => {
  try {
    console.log(data.senderId, "senderIddddd");
    if (files && files.other_documents && files.other_documents.length > 0) {
      console.log("Files are being uploaded");
      const uploadData = await uploadFiles([files.other_documents[0]]);
      console.log("Upload Data:", uploadData);
      data.other_documents = uploadData.image_URL;
    }

    const { receiverIds, replyToMessageId, ...messageData } = data;

    if (replyToMessageId) {
      const originalMessage = await Message.findByPk(replyToMessageId);
      if (originalMessage) {
        messageData.replyContent = originalMessage.content;
        messageData.replyToMessageId = originalMessage.id;
      }
    }

    // Include senderId explicitly
    const message = await Message.create({
      ...messageData,
      senderId: data.senderId,
      
    });

    const parsedReceiverIds = JSON.parse(receiverIds);

    const receivers = await Emp_onboarding.findAll({
      where: { id: parsedReceiverIds },
    });

    if (receivers.length !== parsedReceiverIds.length) {
      throw new Error("Invalid receiver IDs");
    }

    await message.addReceivers(receivers);
    await Promise.all(
      parsedReceiverIds.map((receiverId) =>
        MessageVisibility.create({
          messageId: message.id,
          userId: receiverId,
          isDeleted: false,
          isRead: false, // Initially unread
        })
      )
    );

    // Fetch the message with sender and receiver details
    const messageWithDetails = await Message.findByPk(message.id, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        { model: Emp_onboarding, as: "receivers", attributes: ["id", "emp_name"] },
        {
          model: Message,
          as: 'replyTo',
          include: [{ model: Emp_onboarding, as: 'sender', attributes: ['id', 'emp_name'] }],
          required: false,
        },
        {
          model: GroupMessage,
          as: 'replyToGroupMessage',
          include: [
            { model: Emp_onboarding, as: 'sender', attributes: ['id', 'emp_name'] },
             {
              model: GroupChat,
              as: 'group',
              attributes: ['id', 'groupName'],
            },
          ],
          required: false,
        },
      ],
    });

    // return messageWithDetails;
    return {
   message: messageWithDetails,
   receiverIds: parsedReceiverIds,
};
  } catch (error) {
    console.error("Error creating message:", error.message);
    throw error;
  }
};

const getChats = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        { model: Emp_onboarding, as: "sender" },
        { model: Emp_onboarding, as: "receivers" },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving messages" });
  }
};

const getChatById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByPk(id, {
      include: [
        { model: Emp_onboarding, as: "sender" },
        { model: Emp_onboarding, as: "receivers" },
        {
          model: MessageVisibility,
          required: false, // Include messages not marked as deleted for these users
        },
      ],
    });
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Error retrieving message" });
  }
};

const getConversation = async (req, res) => {
  const { senderId, receiverId } = req.params;
  const parsedSenderId = parseInt(senderId, 10);
if (isNaN(parsedSenderId) || isNaN(receiverId)) {
  return res.status(400).json({ error: "Invalid sender or receiver" });
}

  try {
    const filteredMessages = await getConversationMessages(parsedSenderId, parseInt(receiverId, 10));

    req.io
      .to(`user_${parsedSenderId}`)
      .emit("conversation", { messages: filteredMessages });
    req.io
      .to(`user_${receiverId}`)
      .emit("conversation", { messages: filteredMessages });
    res.json({ messages: filteredMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving messages" });
  }
};

// Pure: returns the conversation between two users without touching the
// response object. Used by the controller and reusable from other callers
// (e.g. a future socket consumer).
const getConversationMessages = async (parsedSenderId, parsedReceiverId) => {
  if (!Number.isFinite(parsedSenderId) || !Number.isFinite(parsedReceiverId)) {
    throw new Error("Invalid sender or receiver");
  }
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: parsedSenderId, "$receivers.id$": parsedReceiverId },
        { senderId: parsedReceiverId, "$receivers.id$": parsedSenderId },
      ],
      isDeletedForEveryone: false,
    },
    include: [
      { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
      { model: Emp_onboarding, as: "receivers", attributes: ["id", "emp_name"] },
      {
        model: MessageVisibility,
        where: { userId: [parsedSenderId, parsedReceiverId] },
        required: false,
      },
      {
        model: Message,
        as: 'replyTo',
        include: [{ model: Emp_onboarding, as: 'sender', attributes: ['id', 'emp_name'] }],
        required: false,
      },
      {
        model: GroupMessage,
        as: 'replyToGroupMessage',
        include: [
          { model: Emp_onboarding, as: 'sender', attributes: ['id', 'emp_name'] },
          { model: GroupChat, as: 'group', attributes: ['id', 'groupName'] },
        ],
        required: false,
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return messages.filter((msg) => {
    const visibility = msg.MessageVisibilities?.find(
      (v) => v.userId === parsedSenderId
    );
    return (
      msg.isDeletedForEveryone !== true &&
      (!visibility || !visibility.isDeleted)
    );
  });
};

const updateMessageContent = async (messageId, senderId, fields, files) => {
  try {
    const message = await Message.findByPk(messageId);

    if (!message) return null;

    if (message.senderId !== Number(senderId)) {
      throw new Error("You are not authorized to edit this message");
    }

    let updatedData = {};

    // Update content only if provided
    if (fields.content !== undefined) {
      updatedData.content = fields.content;
    }

    // Update file if provided
    if (files && files.other_documents && files.other_documents.length > 0) {
      // Upload new file
      const uploaded = await uploadFile(
        files.other_documents[0],
        ALLOWED_EMP_DOC_TYPES
      );

      if (!uploaded.success) {
        throw new Error("File upload failed: " + uploaded.message);
      }

      updatedData.other_documents = uploaded.url;
    }

    // Apply updates
    await message.update(updatedData);

    // Return updated with sender details
    const updatedMessage = await Message.findByPk(messageId, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        { model: Emp_onboarding, as: "receivers", attributes: ["id", "emp_name"] },
      ],
    });

    return updatedMessage;
  } catch (error) {
    console.error("Error updating message with files:", error);
    throw error;
  }
};


const deleteMessageByIds = async (messageId, senderId, receiverId) => {
  try {
    // Fetch the message with its associated receivers
    const message = await Message.findByPk(messageId, {
      include: [{ model: Emp_onboarding, as: "receivers" }],
    });

    if (!message) {
      throw new Error("Message not found.");
    }

    // Check if the senderId and receiverId match the message's sender and receivers
    if (
      message.senderId !== senderId ||
      !message.receivers.some((receiver) => receiver.id === receiverId)
    ) {
      throw new Error("SenderId and receiverId do not match the message.");
    }

    const receiverIds = message.receivers.map((receiver) => receiver.id); // Extract all receiver IDs
    await message.setReceivers([]); // Unlink receivers from the message
    await message.destroy(); // Delete the message

    return { message, receiverIds };
  } catch (error) {
    throw error;
  }
};

const deleteMessageForMe = async (messageId, userId) => {
  console.log(messageId, userId, "message idddd");
  if (!messageId || !userId) {
    throw new Error("Message ID and User ID are required");
  }
  const parsedMessageId = parseInt(messageId, 10);
  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedMessageId) || isNaN(parsedUserId)) {
    throw new Error("Invalid Message ID or User ID");
  }
  try {
    const message = await Message.findByPk(parsedMessageId, {
      include: [{ model: Emp_onboarding, as: "receivers" }],
    });
    if (!message) {
      throw new Error("Message not found");
    }
    const isParticipant =
      message.senderId === parsedUserId ||
      message.receivers.some((r) => r.id === parsedUserId);
    if (!isParticipant) {
      // Fixed logic
      throw new Error("You are not authorized to delete this message.");
    }
    await MessageVisibility.upsert({
      messageId: parsedMessageId,
      userId: parsedUserId,
      isDeleted: true,
    });
    return { messageId: parsedMessageId, userId: parsedUserId };
  } catch (error) {
    console.error("Error in deleteMessageForMe:", error);
    throw error;
  }
};

const deleteMessageForEveryone = async (messageId, userId) => {
  try {
    const message = await Message.findByPk(messageId, {
      include: [{ model: Emp_onboarding, as: "receivers" }],
    });

    if (!message) {
      throw new Error("Message not found.");
    }

    // Only sender can delete for everyone (adjust this logic as needed)
    if (message.senderId !== userId) {
      throw new Error("Only the sender can delete this message for everyone.");
    }

    // Mark as deleted for everyone
    await Message.update(
      { isDeletedForEveryone: true },
      { where: { id: messageId } }
    );
    
    // hide for all receivers
    await MessageVisibility.update(
  { isDeleted: true },
  { where: { messageId } }
);


    const receiverIds = message.receivers.map((r) => r.id);
    return { messageId, senderId: userId, receiverIds };
  } catch (error) {
    console.error("Error in deleteMessageForEveryone:", error);
    throw error;
  }
};

const getUnreadMessages = async (userId) => {
  try {
    const unreadMessages = await MessageVisibility.findAll({
      where: {
        userId: userId,
        isRead: false,
        isDeleted: false,
      },
      include: [
        {
          model: Message,
          where: { isDeletedForEveryone: false },
          include: [{ model: Emp_onboarding, as: "sender" }],
        },
      ],
    });

    const unreadSenderIds = [
      ...new Set(
        unreadMessages
          .filter((mv) => mv.Message.senderId !== userId)
          .map((mv) => mv.Message.senderId)
      ),
    ];

    return { unreadSenderIds };
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    throw error;
  }
};

const markMessagesAsRead = async (userId, senderId) => {
  try {
    await MessageVisibility.update(
      { isRead: true },
      {
        where: {
          userId: userId,
          isRead: false,
          isDeleted: false,
          messageId: {
            [Op.in]: sequelize.literal(
              `(SELECT id FROM MessageTable WHERE senderId = ${senderId} AND isDeletedForEveryone = false)`
            ),
          },
        },
      }
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

// Return the set of 1:1 chat partners the given user has ever exchanged
// non-deleted messages with, plus the most recent message and timestamp
// for each partner. Used to build the chat rail on a fresh page load.
const getChatPartners = async (userId) => {
  if (!Number.isFinite(userId)) throw new Error("Invalid userId");

  // Pull every non-deleted 1:1 message the user is part of, joined with
  // its receivers, and reduce in code to one row per partner.
  const messages = await Message.findAll({
    where: {
      isDeletedForEveryone: false,
      [Op.or]: [
        { senderId: userId },
        { "$receivers.id$": userId },
      ],
    },
    attributes: ["id", "senderId", "content", "other_documents", "createdAt"],
    include: [
      { model: Emp_onboarding, as: "receivers", attributes: ["id"], through: { attributes: [] } },
    ],
    order: [["createdAt", "DESC"]],
  });

  const partners = new Map();
  for (const m of messages) {
    const receiverIds = (m.receivers || []).map((r) => r.id);
    // The "other side" of the conversation: if I sent it, it's every
    // receiver. If I received it, the partner is the sender.
    const otherIds = m.senderId === userId
      ? receiverIds.filter((id) => id !== userId)
      : [m.senderId];

    for (const otherId of otherIds) {
      if (otherId === userId) continue;
      if (partners.has(otherId)) continue; // already have the newest
      partners.set(otherId, {
        partnerId: otherId,
        lastMessage: m.content || (m.other_documents ? "📎 Attachment" : ""),
        lastAt: m.createdAt,
      });
    }
  }

  return Array.from(partners.values());
};

module.exports = {
  createMessage,
  getChats,
  getChatById,
  getConversation,
  getConversationMessages,
  updateMessageContent,
  deleteMessageByIds,
  deleteMessageForMe,
  deleteMessageForEveryone,
  getUnreadMessages,
  markMessagesAsRead,
  getChatPartners,
};
