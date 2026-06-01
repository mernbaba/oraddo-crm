const express = require("express");
const emp_satisfaction_survey=require("../controllers/employeeSatisfactionSurveyController");
// const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/empSatisfactionSurvey",emp_satisfaction_survey.createEmployeeSurvey);
router.get("/empSatisfactionSurvey",emp_satisfaction_survey.getAllEmployeeSurvey);
router.get("/empSatisfactionSurvey/:id",emp_satisfaction_survey.getEmployeeSurveyById);
router.put("/empSatisfactionSurvey/:id",emp_satisfaction_survey.updateEmployeeSurvey);
router.delete("/empSatisfactionSurvey/:id",emp_satisfaction_survey.deleteEmployeeSurvey);

module.exports = router;
