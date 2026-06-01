const LeadCreation = require("../models/leadCreation");
const Datapoints = require("../models/Datapoints");
const {DataTypes} = require("sequelize");

const addFieldToModel = async(data)=>{
    console.log(data,'service Data');
    
    try {
        const {fieldName, fieldType, allowNull}=data;
    LeadCreation.rawAttributes[fieldName]={
        type:DataTypes[fieldType.toUpperCase()],
        allowNull:allowNull
    };
    await LeadCreation.sync({alter:true})
    console.log(`Field "${fieldName}" added to Lead model.`);
    } catch (error) {
        console.log(error,'services');
        
    }
    
}
module.exports={addFieldToModel}
