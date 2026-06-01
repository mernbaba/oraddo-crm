const express = require("express");
const router = express.Router();

const marketingMeetingsController = require("../controllers/marketingMeetingsController");

router.post(
  "/createMarketingMeetings",
  marketingMeetingsController.creationMeetingMark
);
router.get(
  "/allMarketingMeetings",
  marketingMeetingsController.getAllMeetingMark
);
router.get(
  "/marketingMeetingbyorganization/:id",
  marketingMeetingsController.getAllMeetingMarkbyorganisation
);
router.get(
  "/marketingMeeting/:id",
  marketingMeetingsController.getByIdMeetingMark
);
router.put(
  "/marketingMeeting/:id",
  marketingMeetingsController.meetingMarkUpdate
);
router.delete(
  "/marketingMeeting/:id",
  marketingMeetingsController.deleteMeetingMark
);

module.exports = router;
