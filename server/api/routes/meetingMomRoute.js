const express = require("express");
const router = express.Router();
const meeting_mom = require("../controllers/meetingMomController");



router.post("/meetingMom",meeting_mom.creationMeetingMom);
router.get("/meetingMom",meeting_mom.getAllMeetingMomData);
router.get("/meetingMom/:id",meeting_mom.getByIdMeetingMom);
router.put("/meetingMom/:id",meeting_mom.meetingMomUpdate);
router.delete("/meetingMom/:id",meeting_mom.deleteMeetingMom);

module.exports = router;