const express = require("express");
const reportSubmissionController = require("../controllers/report_submissionController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/reports", reportSubmissionController.createReport);
router.get("/reports", reportSubmissionController.getReports);
router.get("/reportsByOrgId/:id",reportSubmissionController.getReportsByOrgId);
router.get("/reports/:id", reportSubmissionController.getReportById);
router.put("/reports/:id", reportSubmissionController.updateReport);
router.delete("/reports/:id", reportSubmissionController.deleteReport);

module.exports = router;
