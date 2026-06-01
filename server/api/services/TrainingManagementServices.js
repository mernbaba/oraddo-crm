const Training_Management = require('../models/trainingManagement');

// Create a new training record
const createTraining = async (data) => {
  try {
    const training = await Training_Management.create(data);
    return training;
  } catch (error) {
    throw new Error('Error creating training record. Please try again.');
  }
};

// Retrieve all training records
const getTrainings = async () => {
  try {
    const trainings = await Training_Management.findAll();
    return trainings;
  } catch (error) {
    throw new Error('Error fetching training records. Please try again.');
  }
};

// Retrieve a training record by ID
const getTrainingById = async (id) => {
  try {
    const training = await Training_Management.findByPk(id);
    if (!training) throw new Error('Training record not found');
    return training;
  } catch (error) {
    throw new Error(`Error fetching training record with ID ${id}`);
  }
};

// Update a training record
const updateTraining = async (id, data) => {
  try {
    const training = await Training_Management.update(data, { where: { id } });
    if (training[0] === 0) throw new Error('Training record not found or no changes made');
    return training;
  } catch (error) {
    throw new Error(`Error updating training record with ID ${id}`);
  }
};

// Delete a training record
const deleteTraining = async (id) => {
  try {
    const rowsDeleted = await Training_Management.destroy({ where: { id } });
    if (rowsDeleted === 0) throw new Error('Training record not found');
  } catch (error) {
    throw new Error(`Error deleting training record with ID ${id}`);
  }
};

module.exports = {
  createTraining,
  getTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining
};


