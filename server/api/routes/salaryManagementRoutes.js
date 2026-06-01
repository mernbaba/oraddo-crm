const express = require("express");
const salaryManagementController = require("../controllers/salaryManagementController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/salaries", salaryManagementController.createSalary);
router.get("/salaries", salaryManagementController.getSalaries);
router.get("/salariesbyorganization/:id", salaryManagementController.getSalariesByOrganization);
router.get("/salariesyearsbyorganization/:id", salaryManagementController.getSalariesYearsByOrganization);
router.get("/salariesForPreviousMonth/:id", salaryManagementController.salariesForPreviousMonth);
router.get("/salaries/:id", salaryManagementController.getSalaryById);
router.get("/getEmployeesWithoutSalaries/:id/:date", salaryManagementController.getEmployeesWithoutSalaries);
router.put("/salaries/:id", salaryManagementController.updateSalary);
router.delete("/salaries/:id", salaryManagementController.deleteSalary);
router.get("/export-salaries/:id", salaryManagementController.exportSalaries);
router.post("/createAllSalaries", salaryManagementController.createAllSalaries);
router.post("/approveAllSalaries/:id", salaryManagementController.approveAllSalaries);
router.put("/approveSalary/:id", salaryManagementController.approveSalary);
router.delete("/deleteAllSalary/:id", salaryManagementController.deleteAllSalary);
router.delete("/deleteSalary/:id", salaryManagementController.deleteSalaryById);
module.exports = router;
