const Gratuity_Settlement = require('../models/GratuitySettlement');

const createGratuitySettlement = async (data) => {
  try {
    const gratuitySettlement = await Gratuity_Settlement.create(data);
    return gratuitySettlement;
  } catch (error) {
    throw error;
  }
};

const getGratuitySettlements = async () => {
  try {
    const gratuitySettlements = await Gratuity_Settlement.findAll();
    return gratuitySettlements;
  } catch (error) {
    throw error;
  }
};

const getGratuityByOrganizationId=async(id)=>{
try{
  const gratuitySettle=await Gratuity_Settlement.findAll({where:{organizationID:id}});
  return gratuitySettle;
}catch (error) {
  throw error;
}
}

const getGratuitySettlementById = async (id) => {
  try {
    const gratuitySettlement = await Gratuity_Settlement.findByPk(id);
    return gratuitySettlement;
  } catch (error) {
    throw error;
  }
};

const updateGratuitySettlement = async (id, data) => {
  try {
    const gratuitySettlement = await Gratuity_Settlement.update(data, {
      where: { id: id }
    });
    return gratuitySettlement;
  } catch (error) {
    throw error;
  }
};


const deleteGratuitySettlement = async (id) => {
  try {
    await Gratuity_Settlement.destroy({
      where: { id: id }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createGratuitySettlement,
  getGratuitySettlements,
  getGratuityByOrganizationId,
  getGratuitySettlementById,
  updateGratuitySettlement,
  deleteGratuitySettlement
};
