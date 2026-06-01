const express = require("express");
const revenueController = require("../controllers/RevenueCreationController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/revenues", revenueController.createRevenue);
router.get("/revenues", revenueController.getAllRevenues);
router.get("/revenuesbyorganization/:id", revenueController.getAllRevenuesbyOrganizationId);
router.get("/revenues/:id", revenueController.getRevenueById);
router.put("/revenues/:id", revenueController.updateRevenue);
router.delete("/revenues/:id", revenueController.deleteRevenue);

module.exports = router;
