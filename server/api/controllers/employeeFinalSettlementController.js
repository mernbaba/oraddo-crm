const FinalSettlementService = require("../services/employeeFinalSettlementService");
// console.log("entre in Controller");

const CreateFinalSettlements = async (req,res)=>{
   
    
    try{
        const finalsettlemet = await FinalSettlementService.CreateFinalSettlements(req.body)
        res.status(201).json(finalsettlemet);

    }catch(err){
        res.status(500).json({err:err.message})
        console.log(err,"cont....");
        
    }
};

const getFinalSettlements = async (req,res) =>{
  try{
    const  finalsettlemet = await FinalSettlementService.getFinalSettlements();
    res.status(200).json(finalsettlemet)
  }catch(err){
    res.status(500).json({err : err.message})
  }
}

const getFinalSettlOrgId=async(req, res)=>{
    const id=req.params.id
    try{
const finalSettlement=await FinalSettlementService.getFinalSettlementOrgId(id);
res.status(200).json(finalSettlement)
    }catch(error){
res.status(500).json({error:error.message})
    }
}


const getFinalSettlementsById = async (req,res) =>{
    try{
        const finalsettlemet = await FinalSettlementService.getFinalSettlements(req.params.id);
        if(finalsettlemet){
            res.status(200).json()
        }else{
            res.status(400).json({ message : 'Gratuitty Settle not found' })
        }
    }catch(err){
      res.status(500).json({ err : err.message})
    }
}

const updateFinalSettlement = async () =>{
    try{
        const finalsettlemet = await FinalSettlementService.updateFinalSettlement(req.params.id, req.body);
        res.status(200).json(finalsettlemet);
    }catch(err){
        res.status(500).json({err: err.message});
    }
};

const deleteFinalSettlement = async () =>{
    try{
        await FinalSettlementService.deleteFinalSettlement(req.params.id);
        res.staus(204).end();
    }catch(err){
        res.status(500).json({errr: err.message})
    }
};

module.exports= {
    CreateFinalSettlements,
    getFinalSettlements,
    getFinalSettlOrgId,
    getFinalSettlementsById,
    updateFinalSettlement,
    deleteFinalSettlement
}

