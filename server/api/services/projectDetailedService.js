const ProjectDetails = require('../models/projectDetails');

const createProjectDetails = async (data) => {
  try {
    const projectDetails = await ProjectDetails.create(data);
    return projectDetails;
  } catch (error) {
    throw error;
  }
};

const getProjectDetails = async () => {
  try {
    const projectDetails = await ProjectDetails.findAll();
    return projectDetails;
  } catch (error) {
    throw error;
  }
};

const getProjectDetailsById = async (id) => {
  try {
    const projectDetails = await ProjectDetails.findByPk(id);
    if (!projectDetails) {
      throw new Error('Project Details not found');
    }
    return projectDetails;
  } catch (error) {
    throw error;
  }
};

const updateProjectDetails = async (id, data) => {
  try {
    const [updated] = await ProjectDetails.update(data, {
      where: { id: id }
    });
    if (!updated) {
      throw new Error('Project Details not found');
    }
    const updatedProjectDetails = await ProjectDetails.findByPk(id);
    return updatedProjectDetails;
  } catch (error) {
    throw error;
  }
};

const deleteProjectDetails = async (id) => {
  try {
    const deleted = await ProjectDetails.destroy({
      where: { id: id }
    });
    if (!deleted) {
      throw new Error('Project Details not found');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProjectDetails,
  getProjectDetails,
  getProjectDetailsById,
  updateProjectDetails,
  deleteProjectDetails
};
