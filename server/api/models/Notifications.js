// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

// const Notifications = sequelize.define('Notifications', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   notifications: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   createdBy:{
//     type:DataTypes.INTEGER,
//     allowNull:false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   }
// });

// module.exports = Notifications;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

// const Notifications = sequelize.define('Notifications', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   notifications: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   createdBy:{
//     type:DataTypes.INTEGER,
//     allowNull:false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   }
// });

// module.exports = Notifications;




const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Notification = sequelize.define('notification', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
},{
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Notification;
