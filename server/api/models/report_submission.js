// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Report_Submission = sequelize.define("Report_Submission", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   emp_id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   department: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   task: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   comments:{
//     type:DataTypes.STRING,
//     allowNull:true
//   },
//   status:{
//     type:DataTypes.ENUM('Pending','Approved','Declined'),
//     allowNull:true
//   }

// });

// module.exports = Report_Submission;





const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Report_Submission = sequelize.define("Report_Submission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // emp_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // department: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  task: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  comments:{
    type:DataTypes.STRING,
    allowNull:true
  },
  status:{
    type:DataTypes.ENUM('Pending','Approved','Declined'),
    allowNull:true
  },
  isReport: {
    type: DataTypes.BOOLEAN,
    allowNull:true
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true,
  }

});

module.exports = Report_Submission;
