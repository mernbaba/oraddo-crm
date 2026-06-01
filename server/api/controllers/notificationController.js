// const notificationService = require('../services/notificationService');

// const createNotification = async (req, res) => {
//   try {
//     const notification = await notificationService.createNotification(req.body);
//     res.status(201).json(notification);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await notificationService.getNotifications();
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getNotificationById = async (req, res) => {
//   try {
//     const notification = await notificationService.getNotificationById(req.params.id);
//     if (notification) {
//       res.status(200).json(notification);
//     } else {
//       res.status(404).json({ message: 'Notification not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateNotification = async (req, res) => {
//   try {
//     const notification = await notificationService.updateNotification(req.params.id, req.body);
//     res.status(200).json(notification);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteNotification = async (req, res) => {
//   try {
//     await notificationService.deleteNotification(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createNotification,
//   getNotifications,
//   getNotificationById,
//   updateNotification,
//   deleteNotification
// };



const notificationService = require('../services/notificationService');
const Emp_onboardings = require('../models/Emp_onboarding')
const Notification = require('../models/Notifications')

// exports.createNotification = async (req, res) => {
//   const { type, message, userId, adminId, attendees } = req.body;

//   try {

//     if (type === "Polls" || type === "Surveys" || type === "Event") {
//       const usersToNotify = await Emp_onboardings.findAll()
//       const filteredUsers = usersToNotify.filter((user) => user.id !== userId)
//       const notificationsForEmployees = filteredUsers.map((user) => ({
//         type,
//         message,
//         userId,
//         adminId: user.id,
//         // isRead: false,
//         // createdAt: new Date()
//       }));
//       const createdNotifications = await Notification.bulkCreate(notificationsForEmployees, { returning: true });
//       filteredUsers.forEach((admin) => {
//         const userNotification = createdNotifications.find((notification) => notification.adminId === admin.id);
//         if (userNotification) {
//           req.io.to(`${admin.id}`).emit('notification', userNotification);
//         }
//       });
//       res.status(201).json(createdNotifications);
//     }
//     else if (type === "Meeting") {
//       const notificationsForAttendees = attendees.map((user) => ({
//         type,
//         message,
//         userId,
//         adminId: user,
//         // isRead: false,
//         // createdAt: new Date()
//       }));
//       const createdNotifications = await Notification.bulkCreate(notificationsForAttendees, { returning: true });
//       attendees.forEach((admin) => {
//         const userNotification = createdNotifications.find((notification) => notification.adminId === admin);
//         if (userNotification) {
//           req.io.to(`${admin}`).emit('notification', userNotification);
//         }
//       });
//       res.status(201).json(createdNotifications);
//     }
//     else {
//       // Create the new notification (assuming you're using a notificationService)
//       const newNotification = await notificationService.createNotification({ type, message, userId, adminId });
//       // Emit the new notification to all clients (you can customize this to emit to specific clients as needed)

//       const departmentIdsToNotify = [1, 2];
//       const users = await Emp_onboardings.findAll({
//         attributes: ['id'],
//         where: {
//           empDepartment: departmentIdsToNotify
//         }
//       });
//       const usersToNotify=users.filter((user)=>user.id!=adminId)
//       // Create notifications for all users in departments 1 and 2
//       const notificationsForDepartments = usersToNotify.map((user) => ({
//         type,
//         message,
//         userId,
//         adminId: user.id,
//         // isRead: false,
//         // createdAt: new Date()
//       }));

//       const createdNotifications = await Notification.bulkCreate(notificationsForDepartments, { returning: true });
//       console.log(createdNotifications, "from notiffffff")
//       // req.io.emit("notification", newNotification); 
//       // req.io.to(toString(adminId)).emit("notification", newNotification);    
//       req.io.to(`${adminId}`).emit("notification", newNotification);
//       // req.io.to('1').emit('notification', { message: 'Test notification', isRead: false });
//       console.log(usersToNotify, "from notification")

//       usersToNotify.forEach((admin) => {
//         const userNotification = createdNotifications.find((notification) => notification.adminId === admin.id);
//         if (userNotification) {
//           req.io.to(`${admin.id}`).emit('notification', userNotification);
//         }
//       });

//       console.log(`Notification emitted to adminId ${adminId}:`, newNotification);
//       // Return the created notification as a response
//       res.status(201).json(newNotification);
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error creating notification' });
//   }
// };



// exports.createNotification = async (req, res) => {
//   const { type, message, userId, adminId, attendees } = req.body;

//   try {
//     const createAndEmitNotifications = async (users, emitKey = 'id') => {
//       const notifications = users.map(user => ({
//         type,
//         message,
//         userId,
//         adminId: user[emitKey] || user,
//       }));
//       const createdNotifications = await Notification.bulkCreate(notifications, { returning: true }); 
//       users.forEach(user => {
//         const notification = createdNotifications.find(n => n.adminId === (user[emitKey] || user));
//         if (notification) req.io.to(`${user[emitKey] || user}`).emit('notification', notification);
//       });

//       return createdNotifications;
//     };

//     if (["Polls", "Surveys", "Event"].includes(type)) {
//       const allUsers = await Emp_onboardings.findAll();
//       const filteredUsers = allUsers.filter(user => user.id !== userId);
//       const createdNotifications = await createAndEmitNotifications(filteredUsers);
//       return res.status(201).json(createdNotifications);
//     }

//     if (type === "Meeting") {
//       const createdNotifications = await createAndEmitNotifications(attendees);
//       return res.status(201).json(createdNotifications);
//     }

//     // Default case: Notify specific departments
//     const departmentIdsToNotify = [1, 2];
//     const departmentUsers = await Emp_onboardings.findAll({
//       attributes: ['id'],
//       where: { empDepartment: departmentIdsToNotify },
//     });
//     const filteredUsers = departmentUsers.filter(user => user.id !== adminId);
//     const createdNotifications = await createAndEmitNotifications(filteredUsers);
//     const newNotification = await notificationService.createNotification({ type, message, userId, adminId });

//     req.io.to(`${adminId}`).emit("notification", newNotification);
//     return res.status(201).json(newNotification);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error creating notification' });
//   }
// };


exports.createNotification = async (req, res) => {
  const { type, message, userId, adminId, attendees, organizationId } = req.body;

  try {
    const createAndEmitNotifications = async (users, emitKey = 'id') => {
      const notifications = users.map(user => ({
        type,
        message,
        userId,
        adminId: user[emitKey] || user,
      }));
      const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });

      // Include employee details while emitting
      const notificationsWithDetails = await Notification.findAll({
        where: { id: createdNotifications.map(n => n.id) },
        include: [
          {
            model: Emp_onboardings,
            as: "notification_data",
            attributes: ["emp_name", "image_URL"], // Employee details
          },
        ],
      });

      users.forEach(user => {
        const notification = notificationsWithDetails.find(n => n.adminId === (user[emitKey] || user));
        if (notification) req.io.to(`${user[emitKey] || user}`).emit('notification', notification);
      });

      return notificationsWithDetails;
    };

    if (["Polls", "Surveys", "Event"].includes(type)) {
      const allUsers = await Emp_onboardings.findAll({ where: { orgnaizationId: organizationId } });
      const filteredUsers = allUsers.filter(user => user.id !== userId);
      console.log(filteredUsers, "from event notification")
      const createdNotifications = await createAndEmitNotifications(filteredUsers);
      return res.status(201).json(createdNotifications);
    }

    if (type === "Meeting") {
      const createdNotifications = await createAndEmitNotifications(attendees);
      return res.status(201).json(createdNotifications);
    }
    if (type === "Bank Details Approval Updated") {
      const newNotification = await notificationService.createNotification({ type, message, userId, adminId });
      const enrichedNotification = await Notification.findOne({
        where: { id: newNotification.id },
        include: [
          {
            model: Emp_onboardings,
            as: "notification_data",
            attributes: ["emp_name", "image_URL"],
          },
        ],
      });
      // Emit to the employee (userId)
      req.io.to(`${adminId}`).emit("notification", enrichedNotification);
      return res.status(201).json(enrichedNotification);
    }
    // Default case: Notify specific departments
    const roleNotify = ["Management"];
    const departmentUsers = await Emp_onboardings.findAll({
      attributes: ['id', 'emp_name', "image_URL"],
      where: { role: roleNotify, orgnaizationId: organizationId },
    });
    console.log(departmentUsers, "organizatonnnnn")
    const filteredUsers = departmentUsers.filter(user => user.id !== userId && user.id !== adminId);
    console.log(filteredUsers, "from default notification")
    const createdNotifications = await createAndEmitNotifications(filteredUsers);

    // Emit enriched notification for adminId
    const newNotification = await notificationService.createNotification({ type, message, userId, adminId });
    const enrichedNotification = await Notification.findOne({
      where: { id: newNotification.id },
      include: [
        {
          model: Emp_onboardings,
          as: "notification_data",
          attributes: ["emp_name", "image_URL"],
        },
      ],
    });
    req.io.to(`${adminId}`).emit("notification", enrichedNotification);

    return res.status(201).json(enrichedNotification);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating notification' });
  }
};




exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications(); // Fetch all notifications from DB
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
}


exports.getNotificationsForAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const notifications = await notificationService.getNotificationsForAdmin(adminId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    await notificationService.markNotificationAsRead(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};

exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await notificationService.deleteNotification(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
};
