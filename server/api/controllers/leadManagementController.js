const managementService = require("../services/leadManagementService");

const createManagement = async (req, res) => {
  try {
    const management = await managementService.createManagement(req.body);
    res.status(201).json(management);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getManagements = async (req, res) => {
  try {
    const managements = await managementService.getManagements();
    res.status(200).json(managements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getManagementByOrgId=async(req, res)=>{
  const id=req.params.id
  const { page = 0, pageSize = 10, month, year} = req.query;  // Capture search query
  const pageInt = parseInt(page, 10);
  const parseYear = year ? parseInt(year, 10) : null;
  const pageSizeInt = parseInt(pageSize, 10);
  try {
    const managements = await managementService.getManagementsByOrgId(id,pageInt,pageSizeInt,parseYear, month);
    res.status(200).json(managements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getManagementById = async (req, res) => {
  try {
    const management = await managementService.getManagementById(req.params.id);
    if (management) {
      res.status(200).json(management);
    } else {
      res.status(404).json({ message: "Management record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateManagement = async (req, res) => {
  try {
    const management = await managementService.updateManagement(
      req.params.id,
      req.body
    );
    res.status(200).json(management);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteManagement = async (req, res) => {
  try {
    await managementService.deleteManagement(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createManagement,
  getManagements,
  getManagementByOrgId,
  getManagementById,
  updateManagement,
  deleteManagement,
};
