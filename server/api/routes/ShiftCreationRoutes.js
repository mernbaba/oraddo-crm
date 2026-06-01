const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/ShiftCreationController');

// Create a new shift
router.post('/Shift', shiftController.createShift);

// Get all shifts
router.get('/Shift', shiftController.getShifts);

// Get a specific shift by ID
router.get('/Shift/:id', shiftController.getShiftById);

// Update a specific shift by ID
router.put('/Shift/:id', shiftController.updateShift);

// Delete a specific shift by ID
router.delete('/Shift/:id', shiftController.deleteShift);

module.exports = router;
