const express = require("express");
const managementController = require("../controllers/leadManagementController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/managements", managementController.createManagement);
router.get("/managements",managementController.getManagements);
router.get("/managementOrganizationId/:id",managementController.getManagementByOrgId);
router.get("/managements/:id", managementController.getManagementById);
router.put("/managements/:id", managementController.updateManagement);
router.delete("/managements/:id", managementController.deleteManagement);

module.exports = router;
