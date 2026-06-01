// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Emp_onboarding = sequelize.define("Emp_onboarding", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   emp_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   emp_id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   salary: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   date_of_birth: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   position: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   date_of_joining: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   city: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   alternative_number: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   contact_number: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   father_or_husband_name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   father_or_husband_number: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   mother_name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   mother_number: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   permanent_address: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   current_address: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   Religion:{
//     type:DataTypes.STRING,
//     allowNull:true,
//   },
//   education_qualification: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   pancard: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   adharnumber: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   other_documents: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   bank_account: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   bank_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   IFSC_code: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   UPI_Id: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   image_URL: {
//     type: DataTypes.STRING,
//     allowNull:true
//   },
//   TDS:{
//     type: DataTypes.BOOLEAN,
//     allowNull:true
//   },
//   Form16:{
//     type: DataTypes.BOOLEAN,
//     allowNull:true
//   },
//   Form24Q:{
//     type: DataTypes.BOOLEAN,
//     allowNull:true
//   },
//   leave_bucket:{
//     type: DataTypes.STRING,
//     allowNull:true
//   },
//   leave_balance:{
//     type: DataTypes.NUMBER,
//     allowNull: true
//   },
//   LOP:{
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   email:{
//     type: DataTypes.STRING,
//     allowNull:true
//   }

// });

// module.exports = Emp_onboarding;

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Emp_onboarding = sequelize.define("Emp_onboarding", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emp_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calling_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // emp_id: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },

  //basic salary...................
  salary: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_joining: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  alternative_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  father_or_husband_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  father_or_husband_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mother_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mother_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  permanent_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  current_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education_qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pancard: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adharnumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  other_documents: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_account: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personal_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bussiness_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IFSC_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UPI_Id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_URL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TDS: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  Form16: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  Form24Q: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  leave_bucket: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // email:{
  //   type: DataTypes.STRING,
  //   allowNull:true
  // },
  // LOP: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },

  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  // },
  leave_balance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  Religion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pf_account: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wfh_no_ofdays: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,

  },
  employee_type: {
    type: DataTypes.ENUM("Internship", "Permanent"),
    allowNull: true,
  },
  loan_availability: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Others"),
    allowNull: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isBusiness: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  isFinance: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orgnaizationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "Organizations", key: "id" },
  },
  // pf_amount:{
  //   type: DataTypes.FLOAT,
  //   allowNull:true
  // }
  UAN_Number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emp_edit_request: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  teamLeadId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gross_CTC: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  DNS_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  HRA_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Speciel_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  travel_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  medical_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  food_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  variable_allowances: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  pf_employeer_contribution: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  pf_emp_contribution: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  emp_ESI_contribution: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stipend: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isTeamLead:{
    type:DataTypes.BOOLEAN,
    allowNull:true
  },
  wfh_bucket:{
    type: DataTypes.INTEGER,
    allowNull:true,
  },
});

module.exports = Emp_onboarding;
