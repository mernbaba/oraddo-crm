const EmpNotes = require('../models/notes');
const SharedNotes = require("../models/SharedNotesModel");

// Normalize a note row for the API:
// - `tags` lives in the DB as a JSON string; expose it as an array of
//   trimmed, non-empty strings (or null when unset).
// - Leave `color` as a plain string.
const toApi = (row) => {
  if (!row) return row;
  const plain =
    typeof row.get === "function" ? row.get({ plain: true }) : { ...row };
  let tags = null;
  if (Array.isArray(plain.tags)) {
    tags = plain.tags;
  } else if (typeof plain.tags === "string" && plain.tags.trim().length > 0) {
    try {
      const parsed = JSON.parse(plain.tags);
      tags = Array.isArray(parsed) ? parsed : null;
    } catch {
      // Stored value was never valid JSON — treat it as a single legacy tag
      // so we don't silently drop the user's data.
      tags = [plain.tags];
    }
  }
  return { ...plain, tags: tags ? tags.map((t) => String(t).trim()).filter(Boolean) : [] };
};

// Normalize an incoming payload. Coerce `tags` to a JSON string for storage
// and drop anything we don't want persisted.
const fromApi = (payload) => {
  if (!payload) return payload;
  const out = { ...payload };
  if (Object.prototype.hasOwnProperty.call(out, "tags")) {
    if (Array.isArray(out.tags)) {
      out.tags = JSON.stringify(
        out.tags.map((t) => String(t).trim()).filter(Boolean)
      );
    } else if (out.tags == null || out.tags === "") {
      out.tags = null;
    } else if (typeof out.tags === "string") {
      out.tags = JSON.stringify(
        out.tags.split(",").map((t) => t.trim()).filter(Boolean)
      );
    }
  }
  if (out.color === "") out.color = null;
  return out;
};

const createEmpNote = async (noteData) => {
  console.log(noteData, "servicenote");
  try {
    const empNote = await EmpNotes.create(fromApi(noteData));

    // Only seed a SharedNotes row if the caller actually supplied an
    // employeeId. The previous implementation always tried to insert one,
    // which violated the FK `allowNull: false` constraint and turned every
    // un-owned note (e.g. ones created from the employee portal without a
    // logged-in employee context) into a 500.
    if (empNote && noteData.employeeId) {
      try {
        const sharedNote = await SharedNotes.create({
          noteId: empNote.id,
          sharedWithEmployeeId: noteData.employeeId,
        });
        console.log("sharedNote", sharedNote);
      } catch (shareErr) {
        // Don't let a share-row failure abort the whole create — the note
        // itself is the primary record and has already been written.
        console.error("SharedNotes create failed (non-fatal):", shareErr.message);
      }
    }
    return toApi(empNote);
  } catch (error) {
    throw new Error('Error creating employee note: ' + (error?.message || error));
  }
};

const getAllEmpNotes = async (page, limit) => {
  try {
    const empNotes = await EmpNotes.findAll();
    return empNotes.map(toApi);
  } catch (error) {
    throw new Error('Error retrieving employee notes');
  }
};

const getEmpNoteById = async (id) => {
  console.log("id", id);
  try {
    const empNotes = await EmpNotes.findAll({ where: { employeeId: id } });
    return empNotes.map(toApi);
  } catch (error) {
    throw new Error('Error retrieving employee note by ID');
  }
};

const updateEmpNote = async (id, noteData) => {
  try {
    const [updated] = await EmpNotes.update(fromApi(noteData), { where: { id } });
    if (updated) {
      const updatedEmpNote = await EmpNotes.findByPk(id);
      return toApi(updatedEmpNote);
    }
    throw new Error('Employee note not found');
  } catch (error) {
    throw new Error('Error updating employee note: ' + (error?.message || error));
  }
};

const deleteEmpNote = async (id) => {
  try {
    // Clean up any share rows pointing at this note so we don't leave
    // dangling FKs behind.
    try {
      await SharedNotes.destroy({ where: { noteId: id } });
    } catch (shareErr) {
      console.error("SharedNotes cleanup failed (non-fatal):", shareErr.message);
    }
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
