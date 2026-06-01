const express = require("express");
const holidayCreationController = require("../controllers/holiday_creationController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/holidays", holidayCreationController.createHoliday);
router.get("/holidays", holidayCreationController.getHolidays);
router.get("/holidaysgetbyorganizationid/:id", holidayCreationController.getHolidaysByOrganizationId);
router.get("/holidays/:id", holidayCreationController.getHolidayById);
router.put("/holidays/:id", holidayCreationController.updateHoliday);
router.delete("/holidays/:id", holidayCreationController.deleteHoliday);

module.exports = router;
