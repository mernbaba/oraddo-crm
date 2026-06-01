const EmpNotes = require('../models/notes');
const SharedNotes = require("../models/SharedNotesModel");
const createEmpNote = async (noteData) => {
  console.log(noteData, "servicenote")
  try {
    const empNote = await EmpNotes.create(noteData);

    const data = {
      noteId: empNote.id,
      sharedWithEmployeeId: noteData.employeeId,
      // sharedByEmployeeId: noteData.sharedByEmployeeId,
    };
    if (empNote) {
      const sharedNote = await SharedNotes.create(data);
      console.log("sharedNote", sharedNote);
    }
    console.log("emopppp", empNote);
    return empNote;
  } catch (error) {
    throw new Error('Error creating employee note');
  }
};

const getAllEmpNotes = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const empNotes = await EmpNotes.findAll();
    return empNotes;
  } catch (error) {
    throw new Error('Error retrieving employee notes');
  }
};

const getEmpNoteById = async (id) => {
  console.log("id", id)
  try {
    const empNote = await EmpNotes.findAll({ where: { employeeId: id } });
    return empNote;
  } catch (error) {
    throw new Error('Error retrieving employee note by ID');
  }
};

const updateEmpNote = async (id, noteData) => {
  try {
    const [updated] = await EmpNotes.update(noteData, { where: { id } });
    if (updated) {
      const updatedEmpNote = await EmpNotes.findByPk(id);
      return updatedEmpNote;
    }
    throw new Error('Employee note not found');
  } catch (error) {
    throw new Error('Error updating employee note');
  }
};

const deleteEmpNote = async (id) => {
  try {
    const deleted = await EmpNotes.destroy({ where: { id } });
    return deleted;
  } catch (error) {
    throw new Error('Error deleting employee note');
  }
};

module.exports = {
  createEmpNote,
  getAllEmpNotes,
  getEmpNoteById,
  updateEmpNote,
  deleteEmpNote,
};
