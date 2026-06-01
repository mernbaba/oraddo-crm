const addServices = require("../services/newDapointCreationServices");


const addNewField = async(req,res)=>{
    try {
        const response = await addServices.addFieldToModel(req.body);
        res.status(201).json({message:response});
    } catch (error) {
        
    }
};

module.exports={addNewField}