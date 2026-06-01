// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Resignation_Process = sequelize.define("Emp_Resignation_Process", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   resignation_date: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   // employee_name: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   // employee_id: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   // date_of_joining: {
//   //   type: DataTypes.DATE,
//   //   allowNull: false,
//   // },
//   last_working_date: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   resignation_letter: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   // personal_mobile_number: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   alternative_mobile_number: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   // personal_email_address: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   // team_lead: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   resignation_reason: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   other_documents:{
//     type:DataTypes.STRING,
//     allowNull:true
//   },
//   hr_comments:{
//     type:DataTypes.STRING,
//     allowNull:true
//   },
//   hr_status:{
//     type: DataTypes.ENUM('Approved', 'Declined'),
//     allowNull:true
//   },
//   team_lead_comments:{
//     type:DataTypes.STRING,
//     allowNull:true
//   },
//   team_lead_status:{
//     type: DataTypes.ENUM('Approved', 'Declined'),
//     allowNull:true
//   },
//   // emp_onboarding_id:{
//   //   type:DataTypes.STRING,
//   //   allowNull:false
//   // }
// });

// module.exports = Resignation_Process;



const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Resignation_Process = sequelize.define("Emp_Resignation_Process", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resignation_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // employee_name: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // employee_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // date_of_joining: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  last_working_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resignation_letter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // personal_mobile_number: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  alternative_mobile_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personal_email_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // team_lead: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  resignation_reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  other_documents:{
    type:DataTypes.ARRAY(DataTypes.STRING), // Array of URLs for other documents
    allowNull:true,
  },
  hr_comments:{
    type:DataTypes.STRING,
    allowNull:true
  },
  hr_status:{
    type: DataTypes.ENUM('Approved', 'Declined','Pending'),
    allowNull:true
  },
  team_lead_comments:{
    type:DataTypes.STRING, 
    allowNull:true
  },
  team_lead_status:{
    type: DataTypes.ENUM('Approved', 'Declined','Pending'),
    allowNull:true
  },
  personal_email_address:{
    type: DataTypes.STRING,
    allowNull:false
  },
  manager_status:{
    type: DataTypes.ENUM('Approved', 'Declined','Pending'),
    allowNull: true
  },
  manager_comments:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  organizationID:{
    type:DataTypes.INTEGER,
    allowNull:true
  }
  // emp_onboarding_id:{
  //   type:DataTypes.STRING,
  //   allowNull:false
  // }
});

module.exports = Resignation_Process;
