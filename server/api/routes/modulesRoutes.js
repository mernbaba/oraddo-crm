const express = require('express');
const ModulesController = require('../controllers/modulesController');

const router = express.Router();

router.post('/dep_modules', ModulesController.createModule);
router.post('/dep_modules/bulk', ModulesController.createModulesBulk);
router.get('/dep_modules', ModulesController.getModules);
router.get('/dep_modules/:id', ModulesController.getModuleById);
router.put('/dep_modules/:id', ModulesController.updateModule);
router.delete('/dep_modules/:id', ModulesController.deleteModule);

module.exports = router;