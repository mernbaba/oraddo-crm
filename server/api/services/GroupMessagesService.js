// const GroupMessage = require("../models/GroupMessages");
const GroupChat = require("../models/GroupModel");
const Emp_onboarding = require("../models/Emp_onboarding");
const { Message } = require("../models/ChatModel");
const uploadFile = require("../../fileUpload/fileupload");
const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");
// services/GroupMessagesService.js
const GroupMessage = require("../models/GroupMessages");
const GroupMessageVisibility = require("../models/GroupMessageVisibility");
// const GroupMessageVisibility = require(".../model"); // <-- correct import

// Handle file upload if exists
const uploadFiles = async (filesArray) => {
  if (!filesArray || filesArray.length === 0) return [];
  const uploadPromises = filesArray.map((file) =>
    uploadFile(file, ALLOWED_EMP_DOC_TYPES)
  );
  const results = await Promise.all(uploadPromises);
  return results.filter((r) => r.success).map((r) => r.url);
};

// Send message to a group
const sendGroupMessage = async (groupId, senderId, content, files) => {
  try {
    const group = await GroupChat.findByPk(groupId, {
      include: [{ model: Emp_onboarding, as: "members" }],
    });
    if (!group) throw new Error("Group not found.");

    // Check if sender is in group
    const isMember =
      group.members.some((m) => m.id === senderId) ||
      group.adminId === senderId;
    if (!isMember) throw new Error("Sender is not part of this group.");

    let fileUrls = [];
    if (files && files.other_documents?.length > 0) {
      fileUrls = await uploadFiles(files.other_documents);
    }

    const newMessage = await GroupMessage.create({
      groupId,
      senderId,
      content: content || null,
      other_documents: fileUrls.join(",") || null,
    });

    return await GroupMessage.findByPk(newMessage.id, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        { model: GroupChat, as: "chatGroup" },
      ],
    });
  } catch (error) {
    console.error("Error sending group message:", error);
    throw error;
  }
};

// Send a reply inside a group (visible to all group members)
const sendGroupReply = async ({
  groupId,
  senderId,
  replyToMessageId,
  content,
  files,
}) => {
  try {
    const group = await GroupChat.findByPk(groupId, {
      include: [{ model: Emp_onboarding, as: "members" }],
    });
    if (!group) throw new Error("Group not found.");

    const isMember =
      group.members.some((m) => m.id === senderId) ||
      group.adminId === senderId;
    if (!isMember) throw new Error("Sender is not part of this group.");

    let fileUrls = [];
    if (files && files.other_documents?.length > 0) {
      fileUrls = await uploadFiles(files.other_documents);
    }

    let originalMessage = null;
    if (replyToMessageId) {
      originalMessage = await GroupMessage.findByPk(replyToMessageId);
    }

    const newMessage = await GroupMessage.create({
      groupId,
      senderId,
      content: content || null,
      other_documents: fileUrls.join(",") || null,
      replyToMessageId: replyToMessageId || null,
      replyType: "group",
      replyContent: originalMessage ? originalMessage.content : null,
    });

    const messageWithDetails = await GroupMessage.findByPk(newMessage.id, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        { model: GroupChat, as: "group" },
        {
          model: GroupMessage,
          as: "replyTo",
          include: [
            {
              model: Emp_onboarding,
              as: "sender",
              attributes: ["id", "emp_name"],
            },
          ],
        },
      ],
    });
    // Attach member ids for controller's FCM logic
    messageWithDetails.groupMemberIds = group.members.map((m) => m.id);
    return messageWithDetails;
  } catch (error) {
    console.error("Error sending group reply:", error);
    throw error;
  }
};

// Send a private reply from group to a single receiver
const sendPrivateReplyFromGroup = async ({
  groupId,
  senderId,
  receiverId,
  replyToMessageId,
  content,
  files,
}) => {
  try {
    const group = await GroupChat.findByPk(groupId, {
      include: [{ model: Emp_onboarding, as: "members" }],
    });
    if (!group) throw new Error("Group not found.");

    const isMember =
      group.members.some((m) => m.id === senderId) ||
      group.adminId === senderId;
    if (!isMember) throw new Error("Sender is not part of this group.");

    // Ensure receiver is part of group
    const isReceiverMember =
      group.members.some((m) => m.id === receiverId) ||
      group.adminId === receiverId;
    if (!isReceiverMember)
      throw new Error("Receiver is not part of this group.");

    let fileUrls = [];
    if (files && files.other_documents?.length > 0) {
      fileUrls = await uploadFiles(files.other_documents);
    }

    let originalGroupMessage = null;
    if (replyToMessageId) {
      originalGroupMessage = await GroupMessage.findByPk(replyToMessageId);
    }

    const personalMessage = await Message.create({
      content: content || null,
      senderId,
      other_documents: fileUrls.join(",") || null,
      replyType: "private",
      replyContent: originalGroupMessage
        ? originalGroupMessage.content
        : content || null,
      replyToGroupMessageId: originalGroupMessage
        ? originalGroupMessage.id
        : null,
    });

    // Associate receiver
    const receiver = await Emp_onboarding.findByPk(receiverId);
    if (!receiver) throw new Error("Receiver not found");
    await personalMessage.addReceivers([receiver]);

    // Return personal message with sender and receivers
    const messageWithDetails = await Message.findByPk(personalMessage.id, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        {
          model: Emp_onboarding,
          as: "receivers",
          attributes: ["id", "emp_name"],
        },
        {
          model: GroupMessage,
          as: "replyToGroupMessage",
          include: [
            {
              model: Emp_onboarding,
              as: "sender",
              attributes: ["id", "emp_name"],
            },
            {
              model: GroupChat,
              as: "group",
              attributes: ["id", "groupName"],
            },
          ],
        },
      ],
    });

    return messageWithDetails;
  } catch (error) {
    console.error("Error sending private reply from group:", error);
    throw error;
  }
};

// Get all messages in a group
const getGroupMessages = async (groupId) => {
  try {
    return await GroupMessage.findAll({
      where: { groupId, isDeletedForEveryone: false },
      include: [
        {
          model: Emp_onboarding,
          as: "sender",
          attributes: ["id", "emp_name"],
        },
        {
          model: GroupMessage,
          as: "replyTo", // This alias must be defined in the model association
          include: [
            {
              model: Emp_onboarding,
              as: "sender",
              attributes: ["id", "emp_name"],
            },
          ],
        },
    //     {
    //         include: [
    //   {
    //     model: GroupMessageVisibility,
    //     as: "visibility",
    //     where: { userId, isDeleted: false },
    //     required: false,
    //   },
    // ],
    //     }
      ],
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    throw new Error("Error fetching group messages: " + error.message);
  }
};

const deleteGroupMessageForEveryone = async (messageId, senderId) => {
  const message = await GroupMessage.findByPk(messageId);
  if (!message) throw new Error("Message not found");
  if (message.senderId !== senderId)
    throw new Error("Only sender can delete the message for everyone");

  await GroupMessage.update(
    { isDeletedForEveryone: true },
    { where: { id: messageId } }
  );
  return messageId;
};

const updateGroupMessage = async (messageId, senderId, content, files) => {
  try {
    const message = await GroupMessage.findByPk(messageId);
    if (!message) {
      throw new Error("Group message not found.");
    }

    if (message.senderId !== senderId) {
      throw new Error("You are not authorized to edit this message.");
    }

    if (content) {
      message.content = content;
    }

    if (files && files.other_documents?.length > 0) {
      const fileUrls = await uploadFiles(files.other_documents);
      message.other_documents = fileUrls.join(",") || null;
    }

    await message.save();

    return await GroupMessage.findByPk(message.id, {
      include: [
        { model: Emp_onboarding, as: "sender", attributes: ["id", "emp_name"] },
        { model: GroupChat, as: "chatGroup" },
        {
          model: GroupMessage,
          as: "replyTo",
          include: [
            {
              model: Emp_onboarding,
              as: "sender",
              attributes: ["id", "emp_name"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error updating group message:", error);
    throw error;
  }
};

const deleteGroupMessageForMe = async (messageId, userId) => {
  const message = await GroupMessage.findByPk(messageId);
  if (!message) throw new Error("Message not found");

  // Record deletion for this user
  await GroupMessageVisibility.upsert({
    messageId,
    userId,
    isDeleted: true,
  });

  return { messageId, userId };
};

module.exports = {
  sendGroupMessage,
  getGroupMessages,
  deleteGroupMessageForEveryone,
  sendGroupReply,
  sendPrivateReplyFromGroup,
  updateGroupMessage,
  deleteGroupMessageForMe,
};
