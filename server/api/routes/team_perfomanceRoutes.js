const express = require("express");
const teamPerformanceController = require("../controllers/team_perfomanceContoller");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/team-performances",
  teamPerformanceController.createTeamPerformance
);
router.get("/team-performances", teamPerformanceController.getTeamPerformances);

router.get("/team-performancesbyorganization/:id", teamPerformanceController.getTeamPerformancesByOrganizationId);

router.get(
  "/team-performances/:id",
  teamPerformanceController.getTeamPerformanceById
);
router.put(
  "/team-performances/:id",
  teamPerformanceController.updateTeamPerformance
);
router.delete(
  "/team-performances/:id",
  teamPerformanceController.deleteTeamPerformance
);
router.get("/getEmployeesWithoutPerformance/:id", teamPerformanceController.getEmployeesWithoutPerformance);

module.exports = router;
