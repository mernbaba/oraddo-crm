const express = require("express");
const employeeResignationController=require("../controllers/employeeResignationController");
// const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/employeeResignation",employeeResignationController.createEmployeeResignation);
router.get("/employeeResignation",employeeResignationController.getAllEmployeeResignation);
router.get("/employeeResignationbyorganization/:id",employeeResignationController.getAllEmployeeResignationbyOrganizationId);
router.get("/employeeResignation/:id",employeeResignationController.getEmployeeResignationById);
router.put("/employeeResignation/:id",employeeResignationController.updateEmployeeResignation);
router.delete("/employeeResignation/:id",employeeResignationController.deleteEmployeeResignation);

module.exports = router;
