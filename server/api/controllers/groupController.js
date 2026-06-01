const parseRequestFiles = require("../../fileUpload/requestedfile");
const groupService = require("../services/GroupService");

const createGroup = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    
    // Convert fields array to object
    const data = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    const { groupName, groupDescription, adminId, assignedMembers, organizationID } = data;

    // Handle single image file (assuming your parseRequestFiles returns files.image)
    let imageFile = null;
    if (files && files.image && files.image.length > 0) {
      imageFile = files.image[0]; // Single file
    }
if (files?.image) {
  console.log("Single image file:", files.image[0]);
} else {
  console.log("❌ No image file received from parseRequestFiles");
}
    // Validate required fields
    let membersArray = assignedMembers;
    if (typeof assignedMembers === 'string') {
      try {
        membersArray = JSON.parse(assignedMembers);
      } catch (e) {
        return res.status(400).json({ error: "Invalid assignedMembers format" });
      }
    }

    if (!groupName || !adminId || !Array.isArray(membersArray) || membersArray.length === 0) {
      return res.status(400).json({
        error: "groupName, adminId, and assignedMembers (array) are required",
      });
    }

    // Create group with file
    const newGroup = await groupService.createGroupChat(
      { groupName, groupDescription, adminId, assignedMembers: membersArray, organizationID },
      imageFile
    );

    // Emit socket events
    if (req.io && Array.isArray(membersArray)) {
      membersArray.forEach((memberId) => {
        req.io.to(`${memberId}`).emit("groupChat", {
          groupId: newGroup.id,
          groupName: newGroup.groupName,
          organizationID: newGroup.organizationID,
        });
      });
    }

    res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ error: error.message });
  }
};


const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle multipart form data
    const payload = await parseRequestFiles(req);
    const { fields, files } = payload;
    
    // Convert fields to object
    const data = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    // Handle single image file
    let imageFile = null;
    if (files && files.image && files.image.length > 0) {
      imageFile = files.image[0];
    }

    console.log("Update data:", data);
    console.log("Image file:", imageFile ? "Present" : "None");
    

    // Update group with file
    const updatedGroup = await groupService.updateGroupChat(id, data, imageFile);

    // Emit socket events
    if (req.io) {
      const memberIds = updatedGroup.members ? updatedGroup.members.map(m => m.id) : [];
      memberIds.forEach(memberId => {
        req.io.to(`${memberId}`).emit("groupUpdated", {
          groupId: updatedGroup.id,
          groupName: updatedGroup.groupName,
        });
      });
    }

    console.log("Group updated successfully");
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Update group error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGroupsByOrgId=async(req, res)=>{
  const id=req.params.id;
  try{
    const groups= await groupService.getGroupsByOrganizationId(id);
    res.status(200).json(groups);
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await groupService.deleteGroupChat(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMembersInGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await groupService.getGroupMembers(groupId);
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGroup,
  updateGroup,
  getAllGroups,
  getGroupsByOrgId,
  deleteGroup,
  getAllMembersInGroup,
};
