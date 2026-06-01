// const { DataTypes, ENUM } = require('sequelize');
// const sequelize = require('../../config/database');

// const LeavesCreation = sequelize.define('LeavesCreation', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   leave_type: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   reason: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   number_of_days: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   from_date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   to_date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   // leave_bucket: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   // },
//   status:{
//     type:DataTypes.ENUM('Pending','Approved','Declined'),
//     allowNull:false
//   }
// });

// module.exports = LeavesCreation;


const { DataTypes, ENUM } = require('sequelize');
const sequelize = require('../../config/database');

const LeavesCreation = sequelize.define('LeavesCreation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  leave_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  number_of_days: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  from_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
    allowNull: false
  },
  LOP: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  monthly_leave_balance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lop_days: {
    type: DataTypes.ARRAY(DataTypes.DATEONLY), // Array of dates in YYYY-MM-DD format
    defaultValue: []
  },
});

module.exports = LeavesCreation;
