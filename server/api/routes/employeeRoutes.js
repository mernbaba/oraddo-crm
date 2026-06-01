
const express = require("express");
const router = express.Router();
const {
  createEmployee,
  bulkUpload,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByOrganizationId,
  getOnboardemployeesOrganizationWise,
  getEmployeeWeeklyAttendance,
  getEmployeeByIdforUpdation,
  getEmployeeLevaveById,
  getTeamMembersLeave,
  getEmployeePerformanceById,
  getEmployeeAdvanceSalaryById,
  getTeamLeadEmployees,
  getTeamLeadEmployeesPerformance,
  getTeamLeadEmployeesReport,
  getEmployeesByOrganizationForChat,
  exportEmployees,
  getEmployeeLeaveByYear,
  updateEmployeeProfile,
  getEmployeesForDocumentLetters,
  getEmployeeChangeStatus,
} = require("../controllers/employeeController");
const {
  employeeValidationRules,
  validate,
} = require("../validations/employeeValidations");
const { Middleware } = require("../middleware/authMiddleware");
const multer = require('multer');
//const bulkUploadController = require('../controllers/bulkUploadController');







// Multer storage configuration
const storage = multer.memoryStorage(); // To store file in memory
const upload = multer({ storage });

// Bulk upload route
router.post('/bulk-upload', upload.single('file'), bulkUpload);
router.post("/employees", createEmployee);
router.get("/employees", getEmployees);
router.get("/organization-Employee/:id", getOnboardemployeesOrganizationWise);
router.get("/employeesbyorganization/:id", getEmployeeByOrganizationId);
router.get("/employees/:id", getEmployeeById);
router.get("/teamlead-employees-report/:id", getTeamLeadEmployeesReport);
router.get("/teamlead-employees-performances/:id", getTeamLeadEmployeesPerformance);
router.get("/teamlead-employees/:id", getTeamLeadEmployees);
router.get("/employee-advance-search/:id", getEmployeeAdvanceSalaryById);
router.get("/employee-performance/:id", getEmployeePerformanceById);
router.get("/teamMembers-leave/:id", getTeamMembersLeave);
router.get("/employees-leave/:id", getEmployeeLevaveById);
router.get("/employees-updatation/:id", getEmployeeByIdforUpdation);
router.get("/employees-weekly-attendance/:id", getEmployeeWeeklyAttendance);
router.put(
  "/employees/:id",
  // employeeValidationRules(),
  // validate,
  updateEmployee
);
router.delete("/employees/:id", deleteEmployee);
router.get("/employeesbyorganisationforchat/:id", getEmployeesByOrganizationForChat)
router.get("/export-employees/:id", exportEmployees)
router.get("/getEmployeeLeaveByYear/:id", getEmployeeLeaveByYear)
router.put("/employees/profile/:id", updateEmployeeProfile)
router.get("/employeesForLetters/:id", getEmployeesForDocumentLetters)
router.put("/changeStatus/:id", getEmployeeChangeStatus)

module.exports = router;
