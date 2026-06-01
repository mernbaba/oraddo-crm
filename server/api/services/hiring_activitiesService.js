const hiring_activities = require("../models/hiring_activities");
const uploadFile = require("../../fileUpload/fileupload");
const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");
const { Op } = require("sequelize");

const createHiringActivity = async (hiring_data, files) => {
  try {
    console.log("welcome to file upload", files, files.resume[0].mimetype);
    const file = files.resume[0];
    console.log("fileeee", file);
    const data = await uploadFile(file, ALLOWED_EMP_DOC_TYPES);
    console.log("after file upload", hiring_data, data.url);
    if (data.success) hiring_data.resume = data.url;
    const activity = await hiring_activities.create(hiring_data);
    return activity;
  } catch (error) {
    throw error;
  }
};

const getHiringActivities = async (page, limit) => {
  try {
    // const offset = (page-1)*offset;
    const activities = await hiring_activities.findAll();
    return activities;
  } catch (error) {
    throw error;
  }
};

const getHiringActivitiesByOrgID = async (id, page, pageSize, search) => {
  try {
    const offset = page * pageSize;
    console.log(id, "idddd");
    let whereEMPCondition = {
      organizationID: id,
    }; // Ensure this is always an object
    if (search) {
      whereEMPCondition.job_position = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }
    // const offset = (page-1)*offset;
    const activitiesCount = await hiring_activities.count({
      where: whereEMPCondition,
    });

    const activities = await hiring_activities.findAll({
      where: whereEMPCondition,
      limit: pageSize,
      offset: offset,
      order:[["createdAt", "DESC"]],
    });
    return { activities, totalCount: activitiesCount };
  } catch (error) {
    throw error;
  }
};

const hiringActivitiesforDashobard = async (id) => {
  try {
    // const offset = page * pageSize;
    // console.log(id, "idddd")
    let whereEMPCondition = {
      organizationID: id,
    }; // Ensure this is always an object
    // if (search) {
    //   whereEMPCondition.job_position = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    // }
    // const offset = (page-1)*offset;
    // const activitiesCount = await hiring_activities.count({ where: whereEMPCondition });

    const activities = await hiring_activities.findAll({
      where: whereEMPCondition,
    });
    return activities;
  } catch (error) {
    throw error;
  }
};

const getHiringActivityById = async (id) => {
  try {
    const activity = await hiring_activities.findByPk(id);
    return activity;
  } catch (error) {
    throw error;
  }
};

const updateHiringActivity = async (id, data) => {
  try {
    const activity = await hiring_activities.update(data, {
      where: { id: id },
    });
    return activity;
  } catch (error) {
    throw error;
  }
};

const deleteHiringActivity = async (id) => {
  try {
    await hiring_activities.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createHiringActivity,
  getHiringActivities,
  getHiringActivitiesByOrgID,
  hiringActivitiesforDashobard,
  getHiringActivityById,
  updateHiringActivity,
  deleteHiringActivity,
};
