// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Salary_Management = sequelize.define("Salary_Management", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   working_days: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   // leaves: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   // },
//   // lop: {
//   //   type: DataTypes.STRING,
//   //   allowNull: true,
//   // },
//   // leave_balance: {
//   //   type: DataTypes.STRING,
//   //   allowNull: false,
//   // },
//   profetional_tax: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   house_rent_allowance: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   income_tax: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   convaynce_allowance: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   perfomance_incentives: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   other_deductions: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   insentives: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   special_allowance: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   gratuity: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   net_pay: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   amount_in_words: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   loss_of_pay:{
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   gross_pay:{
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   gross_deduction:{
//     type: DataTypes.STRING,
//     allowNull: true
//   }

// });


// module.exports = Salary_Management;




const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Salary_Management = sequelize.define("Salary_Management", {
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
  // date_of_joining: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // department: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },

  // bank_name: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // designation: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  // pf_account: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // bank_ac_number: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },

  // basic: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  profetional_tax: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  house_rent_allowance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  income_tax: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  convaynce_allowance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  perfomance_incentives: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  other_deductions: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insentives: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  special_allowance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gratuity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  net_pay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_in_words: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loss_of_pay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gross_pay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gross_deduction: {
    type: DataTypes.STRING,
    allowNull: true
  },
  working_days: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lop: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // leaves:{
  //   type:DataTypes.INTEGER,
  //   allowNull:true
  // },
  // PF_Amount:{
  //   type: DataTypes.FLOAT,
  //   allowNull: true
  // },
  // basic_salary:{
  //   type:DataTypes.FLOAT,
  //   allowNull: false
  // },
  // empOnboardingId:{
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  // }

  monthly_lop: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pf_amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  leaves: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  leave_balance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  salary_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  basic: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  travel_allowances: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pf_employeer_contribution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  medical_allowances: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_allowances: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insurance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pf_emp_contribution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  system_Allowance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emp_ESI_contribution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  HRA_allowances: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Salary_Management;
