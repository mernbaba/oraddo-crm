const express = require("express");
const router = express.Router();
const praposalServicesController = require("../controllers/praposalServicesController");
const { Middleware } = require("../middleware/authMiddleware");

router.post("/praposalService", praposalServicesController.createService);
router.get("/praposalService", praposalServicesController.getService);
router.get("/praposalServiceByOrgId/:id", praposalServicesController.getServiceByOrganizationId);
router.get("/praposalService/:id", praposalServicesController.getServiceById);
router.put("/praposalServices/:id", praposalServicesController.updateService);

module.exports = router;
