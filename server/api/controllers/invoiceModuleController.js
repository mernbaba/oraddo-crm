const { response } = require("express");
const invoiceServiceModule = require("../services/invoiceModuleService");


const createModule = async(req,res)=>{
    const data = req.body;
    try {
        const resControll = await invoiceServiceModule.create_invoice_module(data);
        res.status(201).json({response:resControll});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const getModulePoints = async(req,res)=>{
    try {
        const resModuleData = await invoiceServiceModule.getAllInvoiceModule();
        res.status(200).json({response:resModuleData});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const getModulesPointsByOrgId=async(req,res)=>{
    const id=req.params.id
    try{
        const resModuleData=await invoiceServiceModule.getInvoicesModulesByOrgID(id);
        res.status(200).json({resModuleData});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}
const getModuleById = async(req,res)=>{
    const Id = req.params.id;
    try {
        const resById = await invoiceServiceModule.getInvoiceById(Id);
        res.status(200).json({response:resById});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const updateModuleById = async(req,res)=>{
    const Id = req.params.id;
    console.log(Id,req.body,'lsjlakjsl');
    
    try {
        const resUpdate = await invoiceServiceModule.updateInvoice(Id,req.body);
        res.status(200).json({response:resUpdate});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
const deleteInvoiceModule = async(req,res)=>{
    const Id = req.params.id;
    try {
        const deleteRes = await invoiceServiceModule.deleteInvoice(Id);
        res.status(204).json({response:deleteRes});
    } catch (error) {
       res.status(500).json({error:error.message});
    }
}

module.exports = {
    createModule,
    getModulePoints,
    getModulesPointsByOrgId,
    getModuleById,
    updateModuleById,
    deleteInvoiceModule
}