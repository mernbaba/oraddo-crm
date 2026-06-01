const { where } = require('sequelize');
const praposalSerService = require('../models/praposalServices');

const createService = async (data) => {
  try {
    console.log("jnxjnjnj", data);
    try {
      const praposalService = await praposalSerService.create(data);
      return praposalService;
    } catch (error) {
      console.log("errrrrrr", error);
      
    }

  } catch (error) {
    throw error;
  }
};


const getAllService = async () => {
  try {
    const praposalService = await praposalSerService.findAll();
    return praposalService;
  } catch (error) {
    throw error;
  }
};

const getAllServicesByOrganigationId=async(id,page,pageSize)=>{
  try{
    const proposalService=await praposalSerService.findAll({where:{organizationID:id}});
    return proposalService;
  }catch(error){
    throw error;
  }
}
const getServiceById = async (id) => {
  try {
    const praposalService = await praposalSerService.findByPk(id);
    return praposalService;
  } catch (error) {
    throw error;
  }
};

const updateService = async (id, data) => {
  
  try {
  
    try {
      console.log(id,data,'seserrrrrrrrrrrrrr');
    
      const praposalService = await praposalSerService.update(data, {
        where: { id: id },
      });
      console.log(praposalService,'hello');
      
      return praposalService;
    } catch (error) {
      console.log(error,'errrrrr');
      
    }
   
  } catch (error) {
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    await praposalSerService.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createService,
  getAllService,
  getAllServicesByOrganigationId,
  getServiceById,
  updateService,
  deleteService,
};
