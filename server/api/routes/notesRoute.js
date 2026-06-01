const express = require('express');
const router = express.Router();
const empNotesController = require('../controllers/notesController');
const { Middleware } = require('../middleware/authMiddleware');

// Create a new employee note
router.post('/empNotes', empNotesController.createEmpNote);

// Get all employee notes
router.get('/empNotes', empNotesController.getAllEmpNotes);

// Get an employee note by ID
router.get('/empNotes/:id', empNotesController.getEmpNoteById);

// Update an employee note by ID
router.put('/empNotes/:id', empNotesController.updateEmpNote);

// Delete an employee note by ID
router.delete('/empNotes/:id', empNotesController.deleteEmpNote);

module.exports = router;

