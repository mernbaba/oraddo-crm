const projectBoardService = require('../services/projectBoardCreationService');

const createProjectBoard = async (req, res) => {
  try {
    const projectBoardData = req.body;
    const newProjectBoard = await projectBoardService.createProjectBoard(projectBoardData);
    res.status(201).json(newProjectBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectBoards = async (req, res) => {
  try {
    // const page = req.query.page;
    // const limit = req.query.limit;
    const projectBoards = await projectBoardService.getProjectBoards();
    res.status(200).json(projectBoards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getprojectBoardByOrganization = async (req, res) => {
  const id = req.params.id

  try {
    const projectBoards = await projectBoardService.getProjectsByOrganization(id);
    res.status(200).json(projectBoards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getProjectTitle = async (req, res) => {
  const id = req.params.id
  try {
    const projectBoards = await projectBoardService.getProjectTitle(id);
    res.status(200).json(projectBoards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const getInprogressProject = async (req, res) => {
  const id = req.params.id
  try {
    const projectBoards = await projectBoardService.getInprogressProject(id);
    res.status(200).json(projectBoards);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getCompletedProjects = async (req, res) => {
  const id = req.params.id
  try {
    const { page = 0, pageSize = 10, search = "" } = req.query
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const projectBoards = await projectBoardService.getCompletedProjects(id, pageInt, pageSizeInt, search);
    res.status(200).json(projectBoards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const getProjectBoardById = async (req, res) => {
  try {
    const id = req.params.id;
    const projectBoard = await projectBoardService.getProjectBoardById(id);
    res.status(200).json(projectBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProjectBoard = async (req, res) => {
  try {
    const id = req.params.id;
    const projectBoardData = req.body;
    const updatedProjectBoard = await projectBoardService.updateProjectBoard(id, projectBoardData);
    res.status(200).json(updatedProjectBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProjectBoard = async (req, res) => {
  try {
    const id = req.params.id;
    await projectBoardService.deleteProjectBoard(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProjectBoard,
  getProjectBoards,
  getprojectBoardByOrganization,
  getProjectBoardById,
  updateProjectBoard,
  deleteProjectBoard,
  getCompletedProjects,
  getInprogressProject,
  getProjectTitle
};
