const express = require('express');
const sprintController = require('../controllers/projectSprintController');
const { Middleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sprints', sprintController.createSprint);
router.get('/sprints',sprintController.getSprints);
router.get('/sprints/:id', sprintController.getSprintById);
router.put('/sprints/:id', sprintController.updateSprint);
router.delete('/sprints/:id', sprintController.deleteSprint);

module.exports = router;
