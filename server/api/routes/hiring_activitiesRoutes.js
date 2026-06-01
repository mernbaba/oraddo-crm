const express = require("express");
const hiringActivitiesController = require("../controllers/hiring_activitiesController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/hiring-activities",
  hiringActivitiesController.createHiringActivity
);
router.get(
  "/hiring-activities",
  hiringActivitiesController.getHiringActivities
);
router.get(
  "/hiringActivitiesByOrgId/:id",
  hiringActivitiesController.getHiringActivitiesByOrgId
);
router.get("/hiringActivitiesforDashobard/:id",hiringActivitiesController.hiringActivitiesforDashobard)

router.get(
  "/hiring-activities/:id",
  hiringActivitiesController.getHiringActivityById
);
router.put(
  "/hiring-activities/:id",
  hiringActivitiesController.updateHiringActivity
);
router.delete(
  "/hiring-activities/:id",
  hiringActivitiesController.deleteHiringActivity
);

module.exports = router;
