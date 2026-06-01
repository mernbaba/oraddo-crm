const express = require("express");
const marketingStrategiesController = require("../controllers/marketingStrategiesController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/marketing-strategies",
  marketingStrategiesController.createStrategy
);
router.get(
  "/marketing-strategies",
  marketingStrategiesController.getStrategies
);
router.get(
  "/marketing-strategiesbyorganization/:id",
  marketingStrategiesController.getStrategiesByOrganization
);
router.get(
  "/marketing-strategies/:id",
  marketingStrategiesController.getStrategyById
);
router.put(
  "/marketing-strategies/:id",
  marketingStrategiesController.updateStrategy
);
router.delete(
  "/marketing-strategies/:id",
  marketingStrategiesController.deleteStrategy
);

module.exports = router;
