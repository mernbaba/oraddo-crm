const trainingService = require('../services/TrainingManagementServices');

// Controller to create a new training record
const createTraining = async (req, res) => {
  try {
    const training = await trainingService.createTraining(req.body);
    return res.status(201).json({ message: 'Training created successfully', data: training });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to get all training records
const getTrainings = async (req, res) => {
  try {
    const trainings = await trainingService.getTrainings();
    return res.status(200).json({ data: trainings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to get a specific training record by ID
const getTrainingById = async (req, res) => {
  try {
    const training = await trainingService.getTrainingById(req.params.id);
    return res.status(200).json({ data: training });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Controller to update a training record
const updateTraining = async (req, res) => {
  try {
    const training = await trainingService.updateTraining(req.params.id, req.body);
    return res.status(200).json({ message: 'Training updated successfully', data: training });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to delete a training record
const deleteTraining = async (req, res) => {
  try {
    await trainingService.deleteTraining(req.params.id);
    return res.status(200).json({ message: 'Training deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTraining,
  getTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining
};
