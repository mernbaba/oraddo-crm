const empNotesService = require('../services/notesServices');

const createEmpNote = async (req, res) => {
  try {
    let payload = req.body;
    console.log('payyyy',payload);
    
    const empNote = await empNotesService.createEmpNote(payload);
    res.status(201).json(empNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEmpNotes = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const empNotes = await empNotesService.getAllEmpNotes();
    res.status(200).json(empNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmpNoteById = async (req, res) => {
  try {
    const empNote = await empNotesService.getEmpNoteById(req.params.id);
    if (empNote) {
      res.status(200).json(empNote);
    } else {
      res.status(404).json({ message: 'Employee note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmpNote = async (req, res) => {
  try {
    const empNote = await empNotesService.updateEmpNote(req.params.id, req.body);
    if (empNote) {
      res.status(200).json(empNote);
    } else {
      res.status(404).json({ message: 'Employee note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmpNote = async (req, res) => {
  try {
    const deleted = await empNotesService.deleteEmpNote(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Employee note deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmpNote,
  getAllEmpNotes,
  getEmpNoteById,
  updateEmpNote,
  deleteEmpNote,
};
