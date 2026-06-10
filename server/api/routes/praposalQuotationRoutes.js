const express = require("express");
const praposalController = require("../controllers/proposalQuotationController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();
// console.log("routessssss");

router.post("/praposals", praposalController.createPraposal);
router.post("/praposals/ai/generate", praposalController.generateProposalAi);
router.post('/updateServcies', praposalController.updateService);
router.get("/praposalOrganizationId/:id", praposalController.getPraposalByOrgId);
router.get("/praposalsformanagement/:id", praposalController.getProposalByOrgIdForBilling);
router.get("/proposalsformanagementtableData/:id", praposalController.getproposalByOrgIdForTable);
router.get("/praposals", praposalController.getPraposal);
router.get("/praposals/:id", praposalController.getPraposalById);
router.put("/praposals/:id", praposalController.updatePraposal);
router.delete("/praposals/:id", praposalController.deletePraposal);

module.exports = router;
