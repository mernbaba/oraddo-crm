const Shift_Creation = require('../models/ShiftCreation');

// Create a new shift
const createShift = async (data) => {
  try {
    const shift = await Shift_Creation.create(data);
    return shift;
  } catch (error) {
    throw new Error('Error creating shift. Please try again.');
  }
};

// Retrieve all shifts
const getShifts = async () => {
  try {
    const shifts = await Shift_Creation.findAll();
    return shifts;
  } catch (error) {
    throw new Error('Error fetching shifts. Please try again.');
  }
};

// Retrieve a shift by ID
const getShiftById = async (id) => {
  try {
    const shift = await Shift_Creation.findByPk(id);
    if (!shift) throw new Error('Shift not found');
    return shift;
  } catch (error) {
    throw new Error(`Error fetching shift with ID ${id}`);
  }
};

// Update a shift
const updateShift = async (id, data) => {
  try {
    const shift = await Shift_Creation.update(data, { where: { id } });
    if (shift[0] === 0) throw new Error('Shift not found or no changes made');
    return shift;
  } catch (error) {
    throw new Error(`Error updating shift with ID ${id}`);
  }
};

// Delete a shift
const deleteShift = async (id) => {
  try {
    const rowsDeleted = await Shift_Creation.destroy({ where: { id } });
    if (rowsDeleted === 0) throw new Error('Shift not found');
  } catch (error) {
    throw new Error(`Error deleting shift with ID ${id}`);
  }
};

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift
};

