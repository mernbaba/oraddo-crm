const express = require('express');
const router = express.Router();
const datapointsController = require('../controllers/datapointsController');

// Create a new datapoint
router.post('/datapointcreate', datapointsController.createDatapoint);
// Get all datapoints
router.get('/datapoint/all', datapointsController.getAllDatapoints);

// Get a specific datapoint by ID
router.get('/datapoint/:id', datapointsController.getDatapointById);

// Update a datapoint by ID
router.put('/datapoints', datapointsController.updateDatapoint);

// Delete a datapoint by ID
router.delete('/datapoint/:id', datapointsController.deleteDatapoint);

module.exports = router;
