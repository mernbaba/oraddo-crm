const gratuityService = require('../services/GratuitySettlementServices');

const createGratuitySettlement = async (req, res) => {
  try {
    const gratuitySettlement = await gratuityService.createGratuitySettlement(req.body);
    res.status(201).json(gratuitySettlement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGratuitySettlements = async (req, res) => {
  try {
    const gratuitySettlements = await gratuityService.getGratuitySettlements();
    res.status(200).json(gratuitySettlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGratuityOrganizId=async(req, res)=>{
  const id=req.params.id;
  try {
    const gratuitySettlements = await gratuityService.getGratuityByOrganizationId(id);
    res.status(200).json(gratuitySettlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const getGratuitySettlementById = async (req, res) => {
  try {
    const gratuitySettlement = await gratuityService.getGratuitySettlementById(req.params.id);
    if (gratuitySettlement) {
      res.status(200).json(gratuitySettlement);
    } else {
      res.status(404).json({ message: 'Gratuity Settlement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGratuitySettlement = async (req, res) => {
  try {
    const gratuitySettlement = await gratuityService.updateGratuitySettlement(req.params.id, req.body);
    res.status(200).json(gratuitySettlement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGratuitySettlement = async (req, res) => {
  try {
    await gratuityService.deleteGratuitySettlement(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGratuitySettlement,
  getGratuitySettlements,
  getGratuityOrganizId,
  getGratuitySettlementById,
  updateGratuitySettlement,
  deleteGratuitySettlement
};


