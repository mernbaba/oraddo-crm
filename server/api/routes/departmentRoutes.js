const express = require('express');
const departmentController = require('../controllers/departmentsController');

const router = express.Router();


router.post('/departments', departmentController.createDepartment);
router.post('/updateDepModules', departmentController.updateDepModule);
router.get('/departments', departmentController.getDepartments);
router.get('/departments/:id', departmentController.getDepartmentById);
router.put('/departments/:id', departmentController.updateDepartment);
router.delete('/departments/:id', departmentController.deleteDepartment);

module.exports = router;
