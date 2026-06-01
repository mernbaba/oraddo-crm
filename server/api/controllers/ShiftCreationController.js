const shiftService = require('../services/ShiftCreationServices');

// Controller for creating a new shift
const createShift = async (req, res) => {
  try {
    const shift = await shiftService.createShift(req.body);
    return res.status(201).json({ message: 'Shift created successfully', data: shift });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller for getting all shifts
const getShifts = async (req, res) => {
  try {
    const shifts = await shiftService.getShifts();
    return res.status(200).json({ data: shifts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller for getting a shift by ID
const getShiftById = async (req, res) => {
  try {
    const shift = await shiftService.getShiftById(req.params.id);
    return res.status(200).json({ data: shift });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Controller for updating a shift
const updateShift = async (req, res) => {
  try {
    const shift = await shiftService.updateShift(req.params.id, req.body);
    return res.status(200).json({ message: 'Shift updated successfully', data: shift });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a shift
const deleteShift = async (req, res) => {
  try {
    await shiftService.deleteShift(req.params.id);
    return res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift
};

