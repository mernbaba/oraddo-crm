const admin = require('firebase-admin');
const Emp_FcmTokens = require('../models/Emp_FcmTokens'); // ✅ using new table

function initializeFirebase() {
  if (admin.apps && admin.apps.length) return; // prevent re-initialization

  try {
    const requiredFields = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID',
      'FIREBASE_CLIENT_X509_CERT_URL',
    ];

    const missingFields = requiredFields.filter((field) => !process.env[field]);
    if (missingFields.length) {
      throw new Error(`Missing Firebase env vars: ${missingFields.join(', ')}`);
    }

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com',
    };

    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    // console.log('✅ Firebase Admin initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin:', err.message || err);
  }
}

initializeFirebase();

/**
 * Send notification to multiple device tokens
 */
async function sendNotificationToTokens(tokens = [], payload = {}) {
  if (!tokens || tokens.length === 0) return { success: 0, failure: 0 };

  try {
    const message = {
      tokens,
      notification: {
        title: payload.notification?.title || "New Message",
        body: payload.notification?.body || "You have a new message",
      },
      data: {
        ...payload.data,
        click_action: "FLUTTER_NOTIFICATION_CLICK", // Required for Flutter
      },
      android: {
        priority: "high",
        notification: {
          channelId: "chat_channel",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          sound: "default", // Ensure sound plays
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: payload.notification?.title,
              body: payload.notification?.body,
            },
            sound: "default",
            contentAvailable: true,
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push({ token: tokens[idx], error: resp.error.message });
        }
      });
      console.warn(`⚠️ ${response.failureCount} notifications failed:`, failedTokens);
    }

    return { successCount: response.successCount, failureCount: response.failureCount };
  } catch (error) {
    console.error("❌ Error sending FCM multicast:", error);
    throw error;
  }
}


/**
 * Get all FCM tokens for a list of userIds
 */
async function getUserTokens(userIds = []) {
  if (!Array.isArray(userIds)) userIds = [userIds];
  
  const tokenRecords = await Emp_FcmTokens.findAll({
    where: { empId: userIds },
  });

  const tokens = tokenRecords.map((t) => t.fcm_token).filter(Boolean);
  return tokens;
}

/**
 * Send notification by userIds
 */
async function sendToUserIds(userIds = [], payload = {}) {
  const tokens = await getUserTokens(userIds);
  if (!tokens.length) {
    console.warn(`⚠️ No valid FCM tokens found for userIds: ${userIds}`);
    return { successCount: 0, failureCount: userIds.length, message: "No valid FCM tokens found." };
  }
  return await sendNotificationToTokens(tokens, payload);
}

module.exports = {
  sendNotificationToTokens,
  sendToUserIds,
  getUserTokens,
};
