// const Notifications = require('../models/Notifications');

// const createNotification = async (data) => {
//   try {
//     const notification = await Notifications.create(data);
//     return notification;
//   } catch (error) {
//     throw error;
//   }
// };

// const getNotifications = async () => {
//   try {
//     const notifications = await Notifications.findAll();
//     return notifications;
//   } catch (error) {
//     throw error;
//   }
// };

// const getNotificationById = async (id) => {
//   try {
//     const notification = await Notifications.findByPk(id);
//     return notification;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateNotification = async (id, data) => {
//   try {
//     const notification = await Notifications.update(data, {
//       where: { id: id }
//     });
//     return notification;
//   } catch (error) {
//     throw error;
//   }
// };

// const deleteNotification = async (id) => {
//   try {
//     await Notifications.destroy({
//       where: { id: id }
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   createNotification,
//   getNotifications,
//   getNotificationById,
//   updateNotification,
//   deleteNotification
// };

const Notification = require('../models/Notifications');
const Emp_onboardings = require('../models/Emp_onboarding')

const createNotification = async (data) => {

  return await Notification.create(data);
};

const getAllNotifications= async()=>{
    return await Notification.findAll()
}

const getNotificationsForAdmin = async (adminId) => {
  return await Notification.findAll({
    where: { adminId }, 
    include: [
      {
        model: Emp_onboardings,
        as: "notification_data",
        attributes: ["id","emp_name","image_URL"], // Fetch specific employee details
      },
    ],
    order: [['createdAt', 'DESC']], // Sort by newest first
  });
};

const markNotificationAsRead = async (id) => {
  return await Notification.update({ isRead: true }, { where: { id } });
};

const deleteNotification = async (id) => {
  return await Notification.destroy({ where: { id } });
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationsForAdmin,
  markNotificationAsRead,
  deleteNotification
};

