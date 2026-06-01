const HrPanelService = require("../services/HrPanelService");

const createPanelData = async (req, res) => {
  console.log(req.body, "Request received:");
  try {
    const PanelData = await HrPanelService.createPanelData(req.body);
    res.status(201).json(PanelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPanelData = async (req, res) => {
  try {
    const PanelData = await HrPanelService.getAllPanelData();
    console.log(PanelData, "PanelDataaaaa");  
    res.status(200).json(PanelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPanelDataById = async (req, res) => {
  try {
    const orgId = req.params.id;
    const PanelData = await HrPanelService.getAllPanelDataById(orgId);
    // if (PanelData) {
      res.status(200).json(PanelData);
    // } else {
    //   res.status(404).json({ message: "panel Data not found" });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updatePanelData = async (req, res) => {
  console.log("PUT /panelData/:id called");
  console.log("Params organizationID:", req.params.id);
  console.log("Request body:", req.body);
  try {
    const PanelData = await HrPanelService.updatePanelData(
      req.params.id,
      req.body
    );
    if (PanelData) {
      res.status(200).json(PanelData);
    } else {
      res.status(404).json({ message: "Panel Data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePanelData = async (req, res) => {
  try {
    const PanelData = await HrPanelService.deletePanelData(req.params.id);
    if (PanelData) {
      res.status(200).json({ message: "Panel Data deleted successfully" });
    } else {
      res.status(404).json({ message: "panel Data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPanelData,
  getAllPanelData,
  getAllPanelDataById,
  updatePanelData,
  deletePanelData,
};
