const sprintService = require('../services/projectSprintService');

const createSprint = async (req, res) => {
  try {
    const { title, duration_from, duration_to, status } = req.body;
    // Basic validation
    if (!title || !duration_from || !duration_to || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sprintData = req.body;
    const newSprint = await sprintService.createSprint(sprintData);
    res.status(201).json(newSprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSprints = async (req, res) => {
  try {
    const { organizationID } = req.query;
    const sprints = await sprintService.getSprints(organizationID);
    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSprintById = async (req, res) => {
  try {
    const id = req.params.id;
    const sprint = await sprintService.getSprintById(id);
    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSprint = async (req, res) => {
  try {
    const id = req.params.id;
    const sprintData = req.body;
    const updatedSprint = await sprintService.updateSprint(id, sprintData);
    res.status(200).json(updatedSprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSprint = async (req, res) => {
  try {
    const id = req.params.id;
    await sprintService.deleteSprint(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint
};
