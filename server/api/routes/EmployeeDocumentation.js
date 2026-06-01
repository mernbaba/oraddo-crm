const express = require('express');
const router = express.Router();
const employeeDocumentationController = require('../controllers/EmployeeDocumentationController');

router.get('/employeeDocumentation', employeeDocumentationController.getEmployeeDocumentation);
router.get('/employeeDocumentationByOrganization/:id', employeeDocumentationController.getEmployeeDocumentationByOrgId);
router.post('/employeeDocumentation', employeeDocumentationController.createEmployeeDocumentation);
router.put('/employeeDocumentation/:id', employeeDocumentationController.updateEmployeeDocumentation);
router.delete('/employeeDocumentation/:id', employeeDocumentationController.deleteEmployeeDocumentation);  

module.exports = router;