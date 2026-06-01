const uploadFile = require("../../fileUpload/fileupload");
const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");
const Announcement = require("../models/announcement");
const Emp_onboarding = require("../models/Emp_onboarding");

const uploadFiles = async (files) => {
  const uploadPromises = files?.map((file) =>
    uploadFile(file, ALLOWED_EMP_DOC_TYPES)
  );
  const results = await Promise.all(uploadPromises);
  return results[0]?.success ? results[0].url : null;
};

const createAnnouncement = async (body, files) => {
  try {
    const { content, senderId, organizationID } = body;
    // const uploadedFile = await uploadFiles(files);

    let fileUrl = null;
    if (files && files.other_documents?.length > 0) {
      fileUrl = await uploadFiles([files.other_documents[0]]);
    }
    const newAnnouncement = await Announcement.create({
      senderId,
      content,
      other_documents: fileUrl,
      organizationID: organizationID || null,
    });

    // Fetch the full announcement with sender details to return
    const fullAnnouncement = await Announcement.findByPk(newAnnouncement.id, {
      include: [
        {
          model: Emp_onboarding,
          as: "senderDetails",
          attributes: ["id", "emp_name", "image_URL"],
        },
      ],
    });

    console.log("✅ Announcement saved successfully:", fullAnnouncement.toJSON());
    return fullAnnouncement;
  } catch (error) {
    console.error("❌ Error while creating announcement:", error.message);
    throw new Error("Error creating announcement. Please try again.");
  }
};

const getAnnouncements = async () => {
  try {
    return await Announcement.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: Emp_onboarding,
          as: "senderDetails",
          attributes: ["id", "emp_name", "image_URL"],
        },
      ],
    });
  } catch (error) {
    throw new Error("Error fetching announcements");
  }
};

const getAnnouncementById = async (id) => {
  try {
    return await Announcement.findByPk(id,{
         include: [
            {
              model: Emp_onboarding, 
              as: "senderDetails",
              attributes: ["id", "emp_name", "image_URL"],
            },]
    });
  } catch (error) {
    throw new Error("Error fetching announcement by ID");
  }
};

const getAnnouncementsByOrgId = async (orgId) => {
  try {
    return await Announcement.findAll({ where: { organizationID: orgId },
     include: [
            {
              model: Emp_onboarding, 
              as: "senderDetails",
              attributes: ["id", "emp_name", "image_URL"],
            },] });
  } catch (error) {
    throw new Error("Error fetching announcements by organization ID");
  }
};

const updateAnnouncement = async (id, body, files) => {
  try {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error("Announcement not found");

    let fileUrl = announcement.other_documents;

    // ✅ Handle new file upload if provided
    if (files && files.other_documents?.length > 0) {
      fileUrl = await uploadFiles([files.other_documents[0]]);
    }

    await announcement.update({
      content: body.content ?? announcement.content,
      senderId: body.senderId ?? announcement.senderId,
      organizationID: body.organizationID ?? announcement.organizationID,
      other_documents: fileUrl,
    });

    // Reload the instance to get the updated data with associations
    await announcement.reload({
      include: [
        {
          model: Emp_onboarding,
          as: "senderDetails",
          attributes: ["id", "emp_name", "image_URL"],
        },
      ],
    });

    console.log("✅ Announcement updated successfully:", announcement.toJSON());
    return announcement;
  } catch (error) {
    console.error(`❌ Error updating announcement ID ${id}:`, error.message);
    throw new Error("Error updating announcement. Please try again.");
  }
};

const deleteAnnouncement = async (id) => {
  try {
    const deleted = await Announcement.destroy({ where: { id } });
    if (!deleted) throw new Error("Announcement not found");
    return true;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw new Error("Error deleting announcement");
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementsByOrgId,
  updateAnnouncement,
  deleteAnnouncement,
};
