const express = require('express');
const projectBoardController = require('../controllers/projectBoardCreationController');
const { Middleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/projectBoard', projectBoardController.createProjectBoard);
router.get('/projectBoard', projectBoardController.getProjectBoards);
router.get('/projectBoardByOrganization/:id',projectBoardController.getprojectBoardByOrganization);
router.get('/getProjectTitle/:id',projectBoardController.getProjectTitle)
router.get('/getInprogressProjects/:id',projectBoardController.getInprogressProject)
router.get('/getCompletedProjects/:id',projectBoardController.getCompletedProjects);
router.get('/projectBoard/:id', projectBoardController.getProjectBoardById);
router.put('/projectBoard/:id', projectBoardController.updateProjectBoard);
router.delete('/projectBoard/:id', projectBoardController.deleteProjectBoard);

module.exports = router;
