const express=require("express");
const serviceController=require("../controllers/invoiceModuleServiceController");

const router=express.Router();

router.post("/Services",serviceController.createService);
router.get("/Services",serviceController.getServices);
router.get("/servicesByOrgId/:id", serviceController.getServiceByOrgId);
router.get("/Services/:id", serviceController.getServiceById);
router.put("/Services/:id", serviceController.updateService);
router.put("/Services/bulkUpdate", serviceController.bulkUpdateService);

router.delete("/Services/:id", serviceController.deleteService);

router.post('/startInvoiceAutomation', serviceController.startInvoiceAutomation);

module.exports=router;