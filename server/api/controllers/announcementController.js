const announcementService = require("../services/announcementService");
const parseRequestFiles = require("../../fileUpload/requestedfile");
const employeeService = require("../services/employeeService");
const fcmUtil = require("../utils/fcm");

const createAnnouncement = async (req, res) => {
  try {
  const payload = await parseRequestFiles(req);
    let { fields, files } = payload;

    // Normalize: convert any array values to plain strings
    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    });

      const response = await announcementService.createAnnouncement(fields, files);

      // Socket and FCM notification logic
      if (req.io && response.organizationID) {
        const orgId = response.organizationID;
        const roomName = `org_${orgId}`;
        
        // Emit to all clients in the organization room
        req.io.to(roomName).emit("announcement_created", response);

        // Send FCM to offline users
        try {
          const employees = await employeeService.getEmployeeByOrganizationId(orgId);
          const employeeIds = employees.map(emp => emp.id);

          const offline = [];
          employeeIds.forEach((empId) => {
            const userRoom = req.io.sockets.adapter.rooms.get(`${empId}`);
            if (!userRoom || userRoom.size === 0) {
              offline.push(empId);
            }
          });

          if (offline.length > 0) {
            const senderName = response.senderDetails ? response.senderDetails.emp_name : 'Someone';
            await fcmUtil.sendToUserIds(offline, {
              notification: { title: `${senderName} posted an announcement`, body: response.content },
              data: { type: "announcement", announcementId: String(response.id), orgId: String(orgId) , senderName: senderName },
            });
          }
        } catch (fcmError) {
          console.error("Error sending FCM for new announcement:", fcmError);
        }
      }

      return res
      .status(201)
      .json({ message: "Announcement created successfully", data: response });
  } catch (error) {
    console.error("Error in controller (createAnnouncement):", error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementService.getAnnouncements();
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error in controller (getAllAnnouncements):", error);
    return res.status(500).json({ message: error.message });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.getAnnouncementById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    return res.status(200).json(announcement);
  } catch (error) {
    console.error("Error in controller (getAnnouncementById):", error);
    return res.status(500).json({ message: error.message });
  }
};

const getAnnouncementsByOrgId = async (req, res) => {
  try {
    const { orgId } = req.params;
    const announcements = await announcementService.getAnnouncementsByOrgId(
      orgId
    );
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error in controller (getAnnouncementsByOrgId):", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = await parseRequestFiles(req); 
    let { fields, files } = payload;

    // Normalize array values
    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) fields[key] = fields[key][0];
    });

    const response = await announcementService.updateAnnouncement(id, fields, files);

    // Socket notification for update
    if (req.io && response.organizationID) {
      const orgId = response.organizationID;
      const roomName = `org_${orgId}`;
      req.io.to(roomName).emit("announcement_updated", response);
      // Note: FCM for updates can be noisy. Sending only socket events is often sufficient.
      // If you need FCM for updates, you can add similar logic as in createAnnouncement.
    }

    return res
      .status(200)
      .json({ message: "Announcement updated successfully", data: response });
  } catch (error) {
    console.error("❌ Error in controller (updateAnnouncement):", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    // We need the announcement details (like orgId) before deleting.
    const announcement = await announcementService.getAnnouncementById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await announcementService.deleteAnnouncement(id);

    if (req.io && announcement.organizationID) {
      req.io.to(`org_${announcement.organizationID}`).emit("announcement_deleted", { id, organizationID: announcement.organizationID });
    }
    return res
      .status(200)
      .json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error in controller (deleteAnnouncement):", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByOrgId,
  updateAnnouncement,
  deleteAnnouncement,
};
