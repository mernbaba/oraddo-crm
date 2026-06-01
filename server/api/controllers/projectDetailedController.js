const projectDetailsService = require('../services/projectDetailedService');

const createProjectDetails = async (req, res) => {
  try {
    const projectDetailsData = req.body;
    const newProjectDetails = await projectDetailsService.createProjectDetails(projectDetailsData);
    res.status(201).json(newProjectDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const projectDetails = await projectDetailsService.getProjectDetails();
    res.status(200).json(projectDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectDetailsById = async (req, res) => {
  try {
    const id = req.params.id;
    const projectDetails = await projectDetailsService.getProjectDetailsById(id);
    res.status(200).json(projectDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProjectDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const projectDetailsData = req.body;
    const updatedProjectDetails = await projectDetailsService.updateProjectDetails(id, projectDetailsData);
    res.status(200).json(updatedProjectDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProjectDetails = async (req, res) => {
  try {
    const id = req.params.id;
    await projectDetailsService.deleteProjectDetails(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProjectDetails,
  getProjectDetails,
  getProjectDetailsById,
  updateProjectDetails,
  deleteProjectDetails
};
