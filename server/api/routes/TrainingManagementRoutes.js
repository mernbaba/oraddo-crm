const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/TrainingManagementController');

// Create a new training record
router.post('/trainingManagement', trainingController.createTraining);

// Get all training records
router.get('/trainingManagement', trainingController.getTrainings);

// Get a specific training record by ID
router.get('/trainingManagement/:id', trainingController.getTrainingById);

// Update a training record by ID
router.put('/trainingManagement/:id', trainingController.updateTraining);

// Delete a training record by ID
router.delete('/trainingManagement/:id', trainingController.deleteTraining);

module.exports = router;

