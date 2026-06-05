const GroupChat = require("../models/GroupModel");
const Emp_onboarding = require("../models/Emp_onboarding");
const uploadFile = require("../../fileUpload/fileupload");
const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");


// Handle file upload if exists
const uploadFiles = async (filesArray) => {
  if (!filesArray || filesArray.length === 0) return [];
  const uploadPromises = filesArray.map((file) => uploadFile(file, ALLOWED_EMP_DOC_TYPES));
  const results = await Promise.all(uploadPromises);
  return results.filter(r => r.success).map(r => r.url);
};
function getAllFuncs(toCheck) {
  const props = [];
  let obj = toCheck;
  try {
    do {
      props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));
    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
    });
  } catch (error) {
    console.log("errorrrrr", error);
  }
}
// console.log(getAllFuncs, "getOwnMethods");


// Handle single file upload
const handleSingleFileUpload = async (file) => {
  if (!file) return null;
  try {
    const result = await uploadFile(file, ALLOWED_EMP_DOC_TYPES);
    return result.success ? result.url : null;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
};

// Parse JSON string to array safely
const parseMembersArray = (membersString) => {
  if (!membersString) return [];
  try {
    const parsed = JSON.parse(membersString);
    return Array.isArray(parsed) ? parsed.map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
  } catch (error) {
    console.error("Error parsing members:", error);
    return [];
  }
};

const createGroupChat = async (data, file = null) => {
  const { assignedMembers, adminId, groupName, groupDescription, organizationID } = data;

  try {
    // Handle single file upload
    const imageUrl = await handleSingleFileUpload(file);

    // Create group with image URL
    const group = await GroupChat.create({
      groupName,
      groupDescription,
      adminId: parseInt(adminId),
      organizationID,
      image_URL: imageUrl || null,
    });

    // Parse members if string, ensure array
    let membersArray = assignedMembers;
    if (typeof assignedMembers === 'string') {
      membersArray = parseMembersArray(assignedMembers);
    }

    if (!Array.isArray(membersArray) || membersArray.length === 0) {
      throw new Error("assignedMembers must be a non-empty array");
    }

    // Add assigned members to the group
    const members = await Emp_onboarding.findAll({
      where: { id: membersArray },
    });

    if (members.length === 0) {
      throw new Error("No valid members found to assign to the group");
    }

    await group.addMembers(members);

    // Return group with members
    const groupWithMembers = await GroupChat.findByPk(group.id, {
      include: [
        { model: Emp_onboarding, as: "members", through: { attributes: [] } },
        { model: Emp_onboarding, as: "admin" }
      ]
    });

    return {
      id: groupWithMembers.id,
      groupName: groupWithMembers.groupName,
      organizationID: groupWithMembers.organizationID,
      groupDescription: groupWithMembers.groupDescription,
      adminId: groupWithMembers.adminId,
      image_URL: groupWithMembers.image_URL,
      members: groupWithMembers.members.map(member => ({
        id: member.id,
        name: member.emp_name || member.name,
      })),
    };
  } catch (error) {
    throw new Error("Error creating group chat: " + error.message);
  }
};


const updateGroupChat = async (id, data, file = null) => {
  try {

     const existingGroup = await GroupChat.findByPk(id);
    if (!existingGroup) throw new Error("Group not found");

    // Parse form data
    const {
      groupName,
      groupDescription,
      adminId,
      addMembers: addMembersRaw,
      removeMembers: removeMembersRaw,
      organizationID
    } = data;

    // Parse JSON strings for members
    const addMembers = parseMembersArray(addMembersRaw);
    const removeMembers = parseMembersArray(removeMembersRaw);

    console.log("Parsed data:", { groupName, adminId, addMembers, removeMembers });

    // Handle single file upload
    const imageUrl = await handleSingleFileUpload(file);

    // Prepare update payload
  const updatePayload = {
      groupName: groupName !== undefined ? groupName : existingGroup.groupName,
      groupDescription: groupDescription !== undefined ? groupDescription : existingGroup.groupDescription,
      adminId: adminId !== undefined ? parseInt(adminId) : existingGroup.adminId,
      organizationID: organizationID !== undefined ? organizationID : existingGroup.organizationID
    };

    // Add image URL if file uploaded
    if (imageUrl) {
      updatePayload.image_URL = imageUrl;
    }

    // Remove undefined values
    Object.keys(updatePayload).forEach(key => 
      updatePayload[key] === undefined && delete updatePayload[key]
    );

    // Update group basic properties
    const [updated] = await GroupChat.update(updatePayload, { where: { id } });
    
    if (!updated) {
      throw new Error("Group not found");
    }

    const updatedGroup = await GroupChat.findByPk(id, {
      include: [
        { model: Emp_onboarding, as: "members", through: { attributes: [] } },
        { model: Emp_onboarding, as: "admin" }
      ]
    });

    // Add new members
    if (addMembers.length > 0) {
      const newMembers = await Emp_onboarding.findAll({ where: { id: addMembers } });
      if (newMembers.length > 0) {
        await updatedGroup.addMembers(newMembers);
      }
    }

    // Remove members
    if (removeMembers.length > 0) {
      await updatedGroup.removeMembers(removeMembers);
    }

    // Reload to get fresh data with updated members
    await updatedGroup.reload({
      include: [
        { model: Emp_onboarding, as: "members", through: { attributes: [] } },
        { model: Emp_onboarding, as: "admin" }
      ]
    });

    return updatedGroup;
  } catch (error) {
    console.error("Update error:", error);
    throw new Error("Error updating group chat: " + error.message);
  }
};

const getAllGroups = async () => {
  try {
    const groups = await GroupChat.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: "members", // Include group members
          // attributes: ["emp_id", "emp_name"],
          through: { attributes: [] }, // Exclude join table details
        },
        {
          model: Emp_onboarding,
          as: "admin", // Include admin details
          // attributes: ["emp_id", "emp_name"],
        },
      ],
    });

    return groups;
  } catch (error) {
    throw new Error("Error fetching groups: ", error.message);
  }
};

const getGroupsByOrganizationId=async(id)=>{
  try{
    const groups= await GroupChat.findAll({
      where:{organizationID:id},
      include: [
        {
          model: Emp_onboarding,
          as: "members", // Include group members
          // attributes: ["emp_id", "emp_name"],
          through: { attributes: [] }, // Exclude join table details
        },
        {
          model: Emp_onboarding,
          as: "admin", // Include admin details
          // attributes: ["emp_id", "emp_name"],
        },
      ],
    });
    return groups;
  }catch(error){
    throw new Error('error fetcging groupss')
  }
}

const deleteGroupChat = async (id) => {
  try {
    const deleted = await GroupChat.destroy({ where: { id } });

    if (!deleted) {
      throw new Error("Group not found");
    }

    return { message: "Group deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting group chat: ", error.message);
  }
};

const getGroupMembers = async (groupId) => {
  try {
    const group = await GroupChat.findByPk(groupId, {
    include: [
        {
          model: Emp_onboarding,
          as: "members",
          attributes: ["id", "emp_name"],
          through: { attributes: [] }, // hides join table fields
        },
        {
          model: Emp_onboarding,
          as: "admin",
          attributes: ["id", "emp_name"], // admin details
        },
      ],
      order: [["createdAt", "ASC"]],

    });

    if (!group) {
      throw new Error("Group not found");
    }

    return group;
  } catch (error) {
    throw new Error("Error fetching group Members: ", error.message);
  }
};

module.exports = {
  createGroupChat,
  updateGroupChat,
  getAllGroups,
  getGroupsByOrganizationId,
  deleteGroupChat,
  getGroupMembers,
};