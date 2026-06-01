const express = require("express");
const salaryAdvanceController = require("../controllers/salary_advance");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/salary-advances", salaryAdvanceController.createSalaryAdvance);
router.get("/salary-advances", salaryAdvanceController.getSalaryAdvances);
router.get("/salary-advancesbyorganization/:id", salaryAdvanceController.getSalaryAdvancesByOrganizationId);
router.get(
  "/salary-advances/:id",
  salaryAdvanceController.getSalaryAdvanceById
);
router.put("/salary-advances/:id", salaryAdvanceController.updateSalaryAdvance);
router.delete(
  "/salary-advances/:id",
  salaryAdvanceController.deleteSalaryAdvance
);

module.exports = router;
