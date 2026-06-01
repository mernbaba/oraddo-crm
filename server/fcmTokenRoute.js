const express = require('express');
const router = express.Router();
const Emp_onboarding = require('./api/models/Emp_onboarding');
const Emp_FcmTokens = require('./api/models/Emp_FcmTokens');
const { sendToUserIds, sendNotificationToTokens } = require('./api/utils/fcm');

/**
 * ✅ STORE FCM TOKEN
 * POST /api/store-fcm-token
 */
router.post('/store-fcm-token', async (req, res) => {
  const { userId, fcmToken, deviceType } = req.body;

  if (!userId || !fcmToken) {
    return res.status(400).json({ error: 'userId and fcmToken are required.' });
  }

  try {
    const user = await Emp_onboarding.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const existing = await Emp_FcmTokens.findOne({
      where: { empId: userId, fcm_token: fcmToken },
    });

    if (!existing) {
      await Emp_FcmTokens.create({
        empId: userId,
        fcm_token: fcmToken,
        device_type: deviceType || 'android',
      });
      console.log(`✅ Stored new FCM token for user ${userId}`);
    }

    return res.status(200).json({ message: 'FCM token stored successfully.' });
  } catch (error) {
    console.error('Error storing FCM token:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * ✅ REMOVE FCM TOKEN
 * DELETE /api/remove-fcm-token
 */
router.delete('/remove-fcm-token', async (req, res) => {
  const { userId, fcmToken } = req.body;

  if (!userId || !fcmToken) {
    return res.status(400).json({ error: 'userId and fcmToken are required.' });
  }

  try {
    const deleted = await Emp_FcmTokens.destroy({
      where: { empId: userId, fcm_token: fcmToken },
    });

    if (deleted) {
      console.log(`🗑️ Removed FCM token for user ${userId}`);
      return res.status(200).json({ message: 'FCM token removed successfully.' });
    } else {
      return res.status(404).json({ message: 'No matching FCM token found.' });
    }
  } catch (error) {
    console.error('❌ Error removing FCM token:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * ✅ TEST NOTIFY ENDPOINT
 * POST /api/test-notify
 */
router.post('/test-notify', async (req, res) => {
  try {
    const { userIds, tokens, title, body } = req.body;

    const payload = {
      notification: { title, body },
      data: {
        type: 'test',
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    let response;

    if (tokens?.length) {
      response = await sendNotificationToTokens(tokens, payload);
    } else if (userIds?.length) {
      response = await sendToUserIds(userIds, payload);
    } else {
      return res.status(400).json({ error: 'Provide either tokens[] or userIds[]' });
    }

    return res.json({
      message: '✅ FCM notification sent successfully',
      result: response,
    });
  } catch (err) {
    console.error('❌ Error sending test notification:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
