const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/attendenceMeetingsController');
const authenticateUser = require('../middleware/meetingAuthMiddleware');


router.post('/meetings', meetingController.createMeeting);
// router.get('/:meetingLink',meetingController.accessMeeting, authenticateUser);
router.get('/meetings', meetingController.getMeetings);

router.get('/meetingsbyorganizationId/:id', meetingController.getMeetingsbyOrganizationId);
router.get('/meetings/:id', meetingController.getMeetingById);
router.put('/meetings/:id', meetingController.updateMeeting);
router.delete('/meetings/:id', meetingController.deleteMeeting);

module.exports = router;
