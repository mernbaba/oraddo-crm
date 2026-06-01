const express = require('express');
const { createModule, updateLessonStatusController } = require('../controllers/trainingModuleController');
const { getModuleWithLessons, getModuleByOrgId, assignTraineeAndUpdateLessons } = require('../services/trainingModuleServices')
const router = express.Router();

router.post('/modulecreation', createModule);
router.get('/modulecreation', getModuleWithLessons);
router.get('/moduleorganization/:id',getModuleByOrgId)
router.patch('/modulecreation', updateLessonStatusController);
router.post('/modulecreation/:moduleId', assignTraineeAndUpdateLessons)

module.exports = router;