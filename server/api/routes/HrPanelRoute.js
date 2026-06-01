const express = require("express");
const router = express.Router();
const HrPanelController = require("../controllers/HrPanelController");

router.post("/panelData", HrPanelController.createPanelData);
router.get("/panelData", HrPanelController.getAllPanelData);
router.get("/panelData/:id", HrPanelController.getAllPanelDataById);
router.put("/panelData/:id", HrPanelController.updatePanelData);
router.delete("/panelData/:id", HrPanelController.deletePanelData);

module.exports = router;
