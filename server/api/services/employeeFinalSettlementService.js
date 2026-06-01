const Final_Settlement = require("../models/employeeFinalSettlement");

const CreateFinalSettlements = async (data) =>{
    try{
      const finalsettlemet = await  Final_Settlement.create(data)
      return finalsettlemet
    }catch(err){
        throw err;
    }
};

const getFinalSettlements = async ()=>{
    try{
        const finalsettlemet = await Final_Settlement.findAll();
        return finalsettlemet;
    }catch(err){
        throw err;
    }
};
const getFinalSettlementOrgId=async(id)=>{
    try{
        const finalSettlement=await Final_Settlement.findAll({where:{organizationID:id}});
        return finalSettlement;
    }catch(error){
        throw error
    }
}
const getFinalSettlementsById = async (id)=>{
    try{
        const finalsettlemet = await Final_Settlement.findBypk(id);
        return finalsettlemet;
    }catch(err){
        throw err;
    }
} 

const updateFinalSettlement = async (id,data)=>{
    try{
        const finalsettlemet = await Final_Settlement.update(data,{
            where:{
                id:id
            }
        });
        return finalsettlemet
    }catch(err){
        throw err
    }
}

const deleteFinalSettlement = async (id)=>{
    try{
     await Final_Settlement.destroy({
        where:{id:id}
     })
    }catch(err){
        throw err;
    }
};

module.exports = {
    CreateFinalSettlements,
    getFinalSettlements,
    getFinalSettlementOrgId,
    getFinalSettlementsById,
    updateFinalSettlement,
    deleteFinalSettlement
}