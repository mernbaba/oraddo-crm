const praposalService = require("../services/praposalSerService");

const createService = async (req, res) => {
  try {
    console.log("controlleeerrr",req.body);
    
    const praposalServices = await praposalService.createService(req.body);
    res.status(201).json(praposalServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const praposalServices = await praposalService.getAllService();
    res.status(200).json(praposalServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getServiceByOrganizationId=async(req,res)=>{
  const id=req.params.id
  try{
  const proposalService=await praposalService.getAllServicesByOrganigationId(id);
  res.status(200).json(proposalService);
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const getServiceById = async (req, res) => {
  try {
    const praposalServices = await praposalService.getServiceById(
      req.params.id
    );
    if (praposalServices) {
      res.status(200).json(praposalServices);
    } else {
      res.status(404).json({ message: "DepModule not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  
  
  try {
    const depModule = await praposalService.updateService(
      req.params.id,
      req.body
    );
    console.log(req.body,"controller update");
    res.status(200).json(depModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await praposalService.deleteService(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createService,
  getService,
  getServiceByOrganizationId,
  getServiceById,
  updateService,
  deleteService,
};
