// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../../config/database");

// // const Salary_advance = sequelize.define("Salary_advance", {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     primaryKey: true,
// //     autoIncrement: true,
// //   },
// //   emp_id: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   emp_name: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   department: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   date_of_request: {
// //     type: DataTypes.DATE,
// //     allowNull: false,
// //   },
// //   request_type: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   amount_request: {
// //     type: DataTypes.FLOAT,
// //     allowNull: false,
// //   },
// //   reason: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   status:{
// //     type: DataTypes.ENUM('Pending','Approved','Declined'),
// //     allowNull: false
// //   },
// //   comments: {
// //     type: DataTypes.STRING,
// //     allowNull: true,
// //   }
  
// // });

// // module.exports = Salary_advance;



// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Salary_advance = sequelize.define("Salary_advance", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   // emp_id: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   // emp_name: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   // department: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   date_of_request: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   amount_request: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   reason: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
//     allowNull: false
//   },
//   comments: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   loan_status: {
//     type: DataTypes.ENUM('InProgress', 'Closed'),
//     allowNull: true
//   },
//   request_type: {
//     type: DataTypes.ENUM('Salary Advance', 'Loan'),
//     allowNull: true
//   },
//   paid_Amount:{
//     type: DataTypes.FLOAT,
//     allowNull:true
//   }

// });

// module.exports = Salary_advance;

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Salary_advance = sequelize.define("Salary_advance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // emp_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // emp_name: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // department: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  date_of_request: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // request_type: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  amount_request: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
    allowNull: false
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  loan_status: {
    type: DataTypes.ENUM('InProgress', 'Closed'),
    allowNull: true
  },
  request_type: {
    type: DataTypes.ENUM('Salary Advance', 'Loan'),
    allowNull: true
  },
  paid_Amount:{
    type: DataTypes.FLOAT,
    allowNull:true
  },
  organizationId:{
    type: DataTypes.INTEGER,
    allowNull:true
  }

});

module.exports = Salary_advance;
