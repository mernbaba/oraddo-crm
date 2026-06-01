const datapointsService = require('../services/datapointsService');

// Controller to create a new datapoint
const createDatapoint = async (req, res) => {
  try {
    const datapoint = await datapointsService.createDatapoint(req.body);
    console.log("jdhfuidfguifwr", datapoint);
    
    return res.status(201).json({ message: 'Datapoint created successfully', data: datapoint });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Controller to get all datapoints
const getAllDatapoints = async (req, res) => {
  try {
    console.log("knjddkd",res);
    const datapoints = await datapointsService.getAllDatapoints();
    return res.status(200).json({ data: datapoints });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to get a specific datapoint by ID
const getDatapointById = async (req, res) => {
  try {
   
    
    const datapoint = await datapointsService.getDatapointById(req.params.id);
    return res.status(200).json({ data: datapoint });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Controller to update a datapoint by ID
const updateDatapoint = async (req, res) => {
  try {
    console.log("reqsssss", req.body);
    const {ids, data} = req.body;
    console.log("idsss", ids, data);
    const datapoint = await datapointsService.updateDatapoint(ids, data);
    return res.status(200).json({ message: 'Datapoint updated successfully', data: datapoint });
  } catch (error) {
    console.log(error,"hghvgf");
    
    return res.status(500).json({ message: error.message });
  }
};

// Controller to delete a datapoint by ID
const deleteDatapoint = async (req, res) => {
  try {
    await datapointsService.deleteDatapoint(req.params.id);
    return res.status(200).json({ message: 'Datapoint deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDatapoint,
  getAllDatapoints,
  getDatapointById,
  updateDatapoint,
  deleteDatapoint
};
