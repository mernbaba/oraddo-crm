const express = require('express');
const projectDetailsController = require('../controllers/projectDetailedController');
const { Middleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/projectDetails', projectDetailsController.createProjectDetails);
router.get('/projectDetails', projectDetailsController.getProjectDetails);
router.get('/projectDetails/:id', projectDetailsController.getProjectDetailsById);
router.put('/projectDetails/:id', projectDetailsController.updateProjectDetails);
router.delete('/projectDetails/:id', projectDetailsController.deleteProjectDetails);

module.exports = router;
