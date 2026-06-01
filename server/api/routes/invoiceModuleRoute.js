const express = require("express");
const route = express.Router();
const invoiceModuleRoute = require("../controllers/invoiceModuleController");


route.post("/createModule",invoiceModuleRoute.createModule);
route.get("/getModulesPoints",invoiceModuleRoute.getModulePoints);
route.get("/modulePointsByOrgId/:id",invoiceModuleRoute.getModulesPointsByOrgId);
route.put("/createModule/:id",invoiceModuleRoute.updateModuleById);
route.get("/createModule/:id",invoiceModuleRoute.getModuleById);
route.delete("/createModule/:id",invoiceModuleRoute.deleteInvoiceModule);


module.exports = route;