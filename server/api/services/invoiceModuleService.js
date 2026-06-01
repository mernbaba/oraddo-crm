const invoiceModule = require("../models/invoiceModule");

const create_invoice_module = async(data)=>{
    try {
        const resData = await invoiceModule.create(data);
        return resData;
    } catch (error) {
        console.log(error,'invoice module not store in DB');
        
    }
};

const getAllInvoiceModule = async()=>{
    try {
        const resModules = await invoiceModule.findAll();
        return resModules;
    } catch (error) {
        console.log(error,"invoice modules not fetched");
        
    }
};
const getInvoicesModulesByOrgID=async(id)=>{
    try {
        const resModules = await invoiceModule.findAll({where:{organizationID:id}});
        return resModules;
    } catch (error) {
        console.log(error,"invoice modules not fetched");
        
    }
}

const getInvoiceById = async(id)=>{
    try {
        const resById = await invoiceModule.findByPk(id);
        return resById;
    } catch (error) {
        console.log(error,"not fetched data by id");
    }
};

const updateInvoice = async(id,data)=>{
    try {
        const resUpdate = await invoiceModule.update(data,{
            where:{id:id},
            returning: true
        });
        return resUpdate;
    } catch (error) {
        console.log(error,"module not update");
    }
};

const deleteInvoice = async(id)=>{
    try {
        const resDelete = await invoiceModule.destroy({
            where:{id:id}
        });
        return resDelete;
    } catch (error) {
        console.log(error,'invoice is not delete');
    }
};

module.exports={
    create_invoice_module,
    getAllInvoiceModule,
    getInvoicesModulesByOrgID,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
}