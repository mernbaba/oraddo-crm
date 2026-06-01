// const express = require('express');
// const notificationController = require('../controllers/notificationController');

// const router = express.Router();

// router.post('/notifications', notificationController.createNotification);
// router.get('/notifications', notificationController.getNotifications);
// router.get('/notifications/:id', notificationController.getNotificationById);
// router.put('/notifications/:id', notificationController.updateNotification);
// router.delete('/notifications/:id', notificationController.deleteNotification);

// module.exports = router;


const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Routes for notifications
router.post('/notifications', notificationController.createNotification);

router.get('/notifications',notificationController.getAllNotifications)
router.get('/notifications/:adminId', notificationController.getNotificationsForAdmin);
router.post('/notifications/:id/read', notificationController.markNotificationAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;
