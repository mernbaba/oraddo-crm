const express = require('express');
const employeeDocumentController = require('../controllers/empDocumentsController');
const { Middleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/employeeDocuments', employeeDocumentController.createEmployeeDocument);
router.get('/employeeDocuments', employeeDocumentController.getEmployeeDocuments);
router.get('/employeeDocuments/:id', employeeDocumentController.getEmployeeDocumentById);
router.put('/employeeDocuments/:id',employeeDocumentController.updateEmployeeDocument);
router.delete('/employeeDocuments/:id', employeeDocumentController.deleteEmployeeDocument);

module.exports = router;
