const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendenceController");
const { Middleware } = require("../middleware/authMiddleware");
const { route } = require("./leavesCreationRoutes");

router.post("/punch-in", attendanceController.punchIn);
router.post("/punch-out", attendanceController.punchOut);
router.post("/salaryGenerate", attendanceController.generateSalaryPayslip);
router.get("/attendence", attendanceController.getAttendenceData);
router.get(
  "/attendance-weekly/:id",
  attendanceController.getWeeklyAttendenceOfOrganization
);
router.get(
  "/attendencebyorganizaton/:id",
  attendanceController.getAttendenceDatabyOrganizationId
);
router.get(
  "/latepunchinbyorganization/:id",
  attendanceController.getLatePunchInByOrganization
);
router.get(
  "/getTodaysAttendencesbyOrganization/:id",
  attendanceController.getTodaysAttendancebyOrganization
);
router.get("/getWeekData/:id", attendanceController.getWeekAttendanceData);
router.post(
  "/monthlyAttendence",
  attendanceController.getMonthlyAttendanceData
);
router.get("/attendence/:id", attendanceController.getAttendenceById);
router.get(
  "/attendenceRecent/:id",
  attendanceController.getRecentAttendenceById
);
router.put("/attendence/:id", attendanceController.updateAttences);
router.put("/lateAttendance/:id", attendanceController.updateLateAttendance);
// router.post("/monthlyAttendence", attendanceController.getMonthlyAttendanceData);
router.get(
  "/getallattendancebyorganization/:id",
  attendanceController.getAllAttendanceByOrganization
);

router.get(
  "/getAttendenceByYear/:id",
  attendanceController.getAttendenceByYear
);
router.get("/exportAttendence/:id", attendanceController.exportAttendanceData);

router.post("/autoCreateAttendance", attendanceController.CreateAutoAttendance);
router.get(
  "/getAutoCreatedAtt/:id",
  attendanceController.getAutoCreatedAttendanceByOrgId
);
router.put(
  "/updateAutoCreatedAtt/:id",
  attendanceController.updateAutoCreatedAttendanceById
);
router.put(
  "/updateAutoCreatedAttByOrgId/:id",
  attendanceController.updateAutoCreatedAttendanceByOrgId
);
router.get(
  "/getAutoAttendance/:id",
  attendanceController.getAutoAttendanceByOrgId
);
router.get(
  "/getAbsentAutoAttendance/:id",
  attendanceController.getAbsentAutoAttendanceByOrgId
);

module.exports = router;
