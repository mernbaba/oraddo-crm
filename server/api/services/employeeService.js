// const Emp_onboarding = require('../models/Emp_onboarding');
// const Salary_Details = require('../models/salaryManagement');
// const Advance_Salary = require('../models/salary_advance_loan');
// const Department = require('../models/Department');
// const bcrypt = require('bcryptjs')
// const Allowed_type = require('../../fileUpload/alowedtypes');
// const team_perfomance = require('../models/team_performance');
// const LeavesCreation = require('../models/leavesCreation');
// const Report_Submission = require('../models/report_submission');
// const EmployeeResignation = require('../models/empResignationProcess');
// const Employee_documents=require('../models/empDocuments');
// const GratuitySettlements = require("../models/GratuitySettlement");

// const generateEmployeeId = async () => {
//   const latestEmployee = await Emp_onboarding.findOne({
//     order: [["emp_id", "DESC"]],
//     attributes: ["emp_id"],
//   });

//   if (latestEmployee && latestEmployee.emp_id) {
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4), 10);
//     const newId = `TDZE${(numberPart + 1).toString().padStart(3, "0")}`;
//     return newId;
//   } else {
//     return "TDZE001";
//   }
// };

// const uploadFiles = async (files) =>{

//   const uploadPromises = files.map(file=> uploadFile(file, Allowed_type));
//     try {
//       const results = await Promise.all(uploadPromises);
//       const uploadedData = {
//       image_URL : results[0].success ? results[0].url : null,

//       // other_documents : results[1].success ? results[1].url : null
//     }
//     return uploadedData;
//   } catch (error) {
//     console.log("errorrr", error);
//     throw error;
//   }
// }

// const bulkCreateEmployees = async (employeesData) => {
//   try {
//     let latestEmployee = await Emp_onboarding.findOne({
//       order:[["emp_id", "DESC"]],
//       attributes:["emp_id"]
//     })
//     let latestId = latestEmployee && latestEmployee.emp_id ? latestEmployee.emp_id : "TDZE001";
//     let numberPart = parseInt(latestId.slice(4), 10);

//    const employees = employeesData.map((data)=>{
//     const newId = `TDZE${(numberPart+1).toString().padStart(3, "0")}`;
//     numberPart +=1;
//     return {
//       emp_name: data.emp_name,
//       emp_id : newId,
//       salary: data.salary,
//       password: data.password,
//       date_of_birth: data.date_of_birth,
//       position: data.position,
//       date_of_joining: data.date_of_joining,
//       city: data.city,
//       contact_number: data.contact_number,
//       permanent_address: data.permanent_address,
//       current_address: data.current_address,
//       education_qualification: data.education_qualification,
//       adharnumber: data.adharnumber,
//       bank_account: data.bank_account,
//       bank_name: data.bank_name,
//       IFSC_code: data.IFSC_code
//       // Add other fields as required
//     }
//    })
//     console.log("beforeeeebuplkcreateeee", employees);
//     try {
//     // Bulk insert employees
//     const response = await Emp_onboarding.bulkCreate(employees, { validate: true });
//     return response;
//     } catch (error) {
//       console.log("error in bulk create", error);
//     }
//   } catch (error) {
//     throw new Error('Error bulk creating employees: ' + error.message);
//   }
// };

// const createEmployee = async (employeedata,files) => {
//   try {
//     console.log("kkkddd", employeedata.email, "emploeeee", employeedata);

//     const existingEmployee = await Emp_onboarding.findOne({where:{email: employeedata.email}});
//     console.log("existingemployeeeeeee", existingEmployee);

//     if(existingEmployee){
//       throw new Error('Employee already existed');
//     }
//     if(files && Object.keys(files).length > 0){
//       const uploadData = await uploadFiles([
//         files.image_URL[0],
//         // files.other_documents[0]
//       ])
//       console.log('uploadDataaaaa', uploadData);

//       employeedata.image_URL = uploadData.image_URL;
//       // employeedata.other_documents = uploadData.other_documents;
//     }
//     employeedata.emp_id = await generateEmployeeId();
//     console.log("employeedaataa", employeedata);

//     const password = employeedata.password;
//     console.log("password", password);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     employeedata.password = hashedPassword;
//     employeedata.leave_balance = employeedata.leave_bucket;
//     console.log("dataaaaaaaaa", employeedata);
//     const employee = await Emp_onboarding.create(employeedata);
//     return employee;
//     }
//    catch (error) {
//     console.log("errrrrr", error);
//     throw error;
//   }
// };

// const getEmployees = async (page, limit) => {
//   try {
//     console.log("servvvvvv", page,limit);

//     const offset = (page - 1) * limit;
//     const employees = await Emp_onboarding.findAll({
//       // limit, // Limit the number of records
//       // offset, // Skip the initial records based on the offset
//       include: [
//         {
//           model: team_perfomance,
//           as: 'Emp_teamPerformance'
//         },

//         {
//           model: Salary_Details,
//           as: "employee_salaries",
//         },
//         {
//           model: Department,
//           as: "departentsOfEmp",
//         },
//         {
//           model: Emp_onboarding,
//           as: 'teamLead'
//         },
//         {
//           model: LeavesCreation,
//           as: "Employee_LeaveCreation"
//         },
//         {
//           model:EmployeeResignation,
//           as:"emp_Resignation"
//         },
//         {
//           model:GratuitySettlements,
//           as:"emp_gratuitySettlements"
//         },
//         {
//           model:Employee_documents,
//           as:"employeedocuments"
//         }
//       ]
//     }
//     );
//     return employees;
//   } catch (error) {
//     throw error;
//   }
// };

// const getEmployeeById = async (id) => {
//   try {
//     const empId = await Emp_onboarding.findOne({ where: { id: id } });
//     if (!empId) {
//       throw new Error("Employee ");
//     }
//     console.log("employeeservice");
//     const employee = await Emp_onboarding.findByPk(id, {
//       include: [
//         {
//           model:EmployeeResignation,
//           as:"emp_Resignation"
//         },
//         {
//           model:GratuitySettlements,
//           as:"emp_gratuitySettlements"
//         },
//         {
//           model: Department,
//           as: "departentsOfEmp",
//         },
//         {
//           model: Emp_onboarding,
//           as: 'teamMembers',
//           include: [{
//             model: team_perfomance,
//             as: "Emp_teamPerformance"
//           },
//           {
//             model:EmployeeResignation,
//             as:"emp_Resignation"
//           },
//           {
//             model:GratuitySettlements,
//             as:"emp_gratuitySettlements"
//           },
//           {
//             model: Department,
//             as: 'departentsOfEmp'
//           },
//           {
//             model: Report_Submission,
//             as: "Employee_Reports"
//           },

//             // {
//             //   model: LeavesCreation,
//             //   as: "Employee_LeaveCreation"
//             // }
//           ]
//         },
//         {
//           model: Emp_onboarding,
//           as: "teamLead",
//         },
//         {
//           model: Department,
//           as: "departentsOfEmp",
//         },
//         {
//           model: Advance_Salary,
//           as: "Employee_Advance_Salary",
//         },
//         {
//           model: LeavesCreation,
//           as: "teamMembersLeaves",
//           include: [
//             {
//               model: Emp_onboarding,
//               as: "LeaveCreation",
//             },
//           ],
//         },
//         {
//           model: LeavesCreation,
//           as: "Employee_LeaveCreation"
//         },
//         {
//           model: team_perfomance,
//           as: "Emp_teamPerformance"
//         },

//         {
//           model: Report_Submission,
//           as: "Employee_Reports"
//         },
//         {
//           model: Employee_documents,
//           as: "employeedocuments"
//         },
//         {
//           model:Salary_Details,
//           as:"employee_salaries"
//         }

//       ]
//     }
//     );
//     return employee;
//   } catch (error) {
//     throw error;
//   }
// };

// // const employeeLeaveDetails = await Emp_onboarding.findOne({
// //   where: { id: employeeId }, // Replace with the actual employee ID
// //   include: [
// //       {
// //           model: LeavesCreation,
// //           as: 'Employee_LeaveCreation'
// //       },
// //       {
// //           model: Emp_onboarding,
// //           as: 'teamLead'
// //       }
// //   ]
// // });

// // const teamLeadEmployeesLeaves = await Emp_onboarding.findOne({
// //   where: { id: teamLeadId }, // Replace with the actual team lead ID
// //   include: [
// //       {
// //           model: Emp_onboarding,
// //           as: 'teamMembers',
// //           include: [
// //               {
// //                   model: LeavesCreation,
// //                   as: 'Employee_LeaveCreation'
// //               }
// //           ]
// //       }
// //   ]
// // });

// const updateEmployee = async (id, data, files) => {
//   try {
//     console.log("jhdeuihurhuhf", data, files, id);
//     // console.log("daaataaa.paaasowrddd", data.password);
//     const existingEmployee = await Emp_onboarding.findOne({ where: { id: id } })
//     console.log(existingEmployee, "existing employee")
//     if (!existingEmployee) {
//       throw new Error("Employee doesn't exist");
//     }
//     console.log("jhgfhghghjhj");

//     if (files && Object.keys(files).length > 0 && files.image_URL) {
//       console.log("kjhghjghj");
//       const uploadData = await uploadFiles([
//         files.image_URL[0],
//         // files.other_documents[0]
//       ])
//       console.log('uploadDataaaaa', uploadData);

//       data.image_URL = uploadData.image_URL;
//       // employeedata.other_documents = uploadData.other_documents;
//     }
//     console.log("olddddnewwww",existingEmployee.password, data.oldPassword, data.password);

//     if (data.password && data.oldPassword) {

//       const isMatch = await bcrypt.compare(data.oldPassword, existingEmployee.password);
//       console.log("issmaatchh", isMatch);

//       if (isMatch === false) {
//         console.log("conditiooooo");
//         throw new Error("Old Password does not match");
//       }
//       // if (isMatch) {
//       //   console.log("Password matches");
//       // } else {
//       //   console.log("Password does not match");
//       //   throw new Error("Old Password does not match");
//       // }

//       if (data.oldPassword === data.password) {
//         throw new Error("New password can't be the same as the old password");
//       }
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(data.password, salt);
//       data.password = hashedPassword;
//       console.log("new passwordddd", data.password);
//     }
//     // else if (data.password && !data.oldPassword) {
//     //   throw new Error("Old password is required to change password");
//     // }
//       if(data.password){
//         const password = data.password;
//         console.log("passwordsssss", password);
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         console.log("passwordggggggg", hashedPassword);
//         data.password = hashedPassword;
//       }
//     const  updatedEmployee = await Emp_onboarding.update(data, {
//       where: { id: id },
//       returning: true
//     });

//     // if (rowsAffected === 0) {
//     //   throw new Error("Employee update failed");
//     // }
//     console.log("Updated Employee Data:", updatedEmployee[1]);
//     return updatedEmployee[1];
//   } catch (error) {
//     throw error;
//   }
// };

// const deleteEmployee = async (id) => {
//   try {
//     const response = await Emp_onboarding.destroy({
//       where: { id: id },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   createEmployee,
//   bulkCreateEmployees,
//   getEmployees,
//   getEmployeeById,
//   updateEmployee,
//   deleteEmployee,
// };

const Emp_onboarding = require("../models/Emp_onboarding");
const Salary_Details = require("../models/salaryManagement");
const Advance_Salary = require("../models/salary_advance_loan");
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");
// const uploadFilorganization_Employeese = require('../../fileUpload/fileupload');
const Allowed_type = require("../../fileUpload/alowedtypes");
const team_perfomance = require("../models/team_performance");
const LeavesCreation = require("../models/leavesCreation");
const Report_Submission = require("../models/report_submission");
const EmployeeResignation = require("../models/empResignationProcess");
const Employee_documents = require("../models/empDocuments");
const GratuitySettlements = require("../models/GratuitySettlement");
const ProjectBoard = require("../models/projectBoardCreation");
const Sprints = require("../models/projectSprints");
const Organization = require("../models/OrganizationModule");
const uploadFile = require("../../fileUpload/fileupload");
const { Op, where, Sequelize } = require("sequelize");
const { search } = require("../routes/reportSubmissionRoutes");
const { Message } = require("../models/ChatModel");
const HrPanel = require("../models/HrPanel");
const EmployeeLetter = require("../models/EmployeeDocumentationModel");
const PremiumPlans = require("../models/premiumPlans");

// const generateEmployeeId = async (type) => {
//   const latestEmployee = await Emp_onboarding.findOne({
//     order: [["emp_id", "DESC"]],
//     attributes: ["emp_id"],
//   });
//   console.log("latestemployeeeeee",latestEmployee);
//   if(latestEmployee.emp_id && type === 'Internship'){
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4),10);
//     const newId = `TDZI${(numberPart +1).toString().padStart(3, "0")}`;
//     return newId;
//   }

//   if (latestEmployee && latestEmployee.emp_id) {
//     console.log("latestemployee",latestEmployee);
//     const latestId = latestEmployee.emp_id;
//     console.log("latestIdd",latestId);
//     const numberPart = parseInt(latestId.slice(4), 10);
//     console.log("numberparttsss:",numberPart);
//     const newId = `TDZE${(numberPart + 1).toString().padStart(3, "0")}`;
//     console.log("newwiddd:",newId);
//     return newId;
//   } else {
//     return "TDZE001";
//   }
// };

// const generateEmployeeId = async (type) => {
//   const prefix = type === 'Internship' ? 'TDZI' : 'TDZE';

//   // Use a transaction to ensure safe generation and save
//   const t = await Emp_onboarding.sequelize.transaction();

//   try {
//     // Fetch the latest employee record within the transaction scope
//     const latestEmployee = await Emp_onboarding.findOne({
//       order: [["emp_id", "DESC"]],
//       attributes: ["emp_id"],
//       lock: t.LOCK.UPDATE,  // Ensure no other process can interfere
//       transaction: t,
//     });

//     console.log("latestEmployee:", latestEmployee);

//     let newNumberPart;

//     if (latestEmployee && latestEmployee.emp_id) {
//       const latestId = latestEmployee.emp_id;
//       const numberPart = parseInt(latestId.slice(4), 10);

//       // Increment the number part
//       newNumberPart = numberPart + 1;
//     } else {
//       // If no employees exist, start from 1
//       newNumberPart = 1;
//     }

//     // Generate the new ID with the appropriate prefix
//     const newId = `${prefix}${newNumberPart.toString().padStart(3, "0")}`;

//     console.log("Generated New ID:", newId);

//     // Commit the transaction to ensure the ID is generated safely
//     await t.commit();

//     return newId;
//   } catch (error) {
//     await t.rollback();  // Roll back if there's an error
//     console.error("Error generating employee ID:", error);
//     throw error;
//   }
// };

// this logic for generating ID's seperatly for permanent and interns
// const generateEmployeeId = async (type) => {
//   const prefix = type === 'Internship' ? 'TDZI' : 'TDZE';

//   const latestEmployee = await Emp_onboarding.findOne({
//     where: {
//       emp_id: { [Sequelize.Op.like]: `${prefix}%` }  // Fetch only the IDs matching the type prefix
//     },
//     order: [["emp_id", "DESC"]],
//     attributes: ["emp_id"],
//   });

//   console.log("latestEmployee:", latestEmployee);

//   if (latestEmployee && latestEmployee.emp_id) {
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4), 10);
//     const newId = `${prefix}${(numberPart + 1).toString().padStart(3, "0")}`;
//     console.log("Generated New ID:", newId);
//     return newId;
//   } else {
//     return `${prefix}001`;  // Return the first ID if no previous records found
//   }
// };

// const generateEmployeeId = async (type) => {
//   const prefix = type === "Internship" ? "TDZI" : "TDZE"; // Prefix based on type

//   // Fetch all employee records and extract their numeric parts
//   const employees = await Emp_onboarding.findAll({
//     attributes: ["emp_id"],
//   });
//   console.log("latestemployeeeeee",latestEmployee);
//   if(latestEmployee.emp_id && type === 'Internship'){
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4),10);
//     const newId = `TDZI${(numberPart +1).toString().padStart(3, "0")}`;
//     return newId;
//   }

//   console.log("emploeeeee",employees);

//   // Extract the numeric part from each emp_id
//   const numbers = employees.map((employee) =>
//     parseInt(employee.emp_id.slice(4), 10) || 0
//   );

//   // Find the highest number among all IDs
//   const maxNumber = Math.max(...numbers);

//   // Generate the next number in sequence
//   const nextNumber = maxNumber + 1;

//   // Construct the new ID with the appropriate prefix
//   const newId = `${prefix}${nextNumber.toString().padStart(3, "0")}`;

//   console.log("Generated new ID:", newId);
//   return newId;
// };

// const generateEmployeeId = async (type) => {
//   const latestEmployee = await Emp_onboarding.findOne({
//     order: [["emp_id", "DESC"]],
//     attributes: ["emp_id"],
//   });
//   console.log(type,"latestemployeeeeee",latestEmployee);

//   if(latestEmployee == null && type === 'Internship'){
//     return "TDZI001";
//   }
//   console.log("llllllllll");
//   if(latestEmployee == null && type === 'Permanent'){
//     return "TDZE001";
//   }
//   console.log("lkdlskdssd");

//   if(latestEmployee.emp_id && type === 'Internship'){
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4),10);
//     const newId = `TDZI${(numberPart +1).toString().padStart(3, "0")}`;
//     return newId;
//   }

//   if (latestEmployee && latestEmployee.emp_id) {
//     const latestId = latestEmployee.emp_id;
//     const numberPart = parseInt(latestId.slice(4), 10);
//     const newId =` TDZE${(numberPart + 1).toString().padStart(3, "0")}`;
//     return newId;
//   } else {
//     return "TDZE001";
//   }
// };

const generateEmployeeId = async (type) => {
  const AllEmployeeIds = (
    await Emp_onboarding.findAll({
      attributes: ["emp_id"],
      order: [["emp_id", "ASC"]],
    })
  )
    .map((emp) => emp.emp_id.slice(4))
    .sort((a, b) => parseInt(b) - parseInt(a));
  // console.log(AllEmployeeIds,"eeeeeeeewwww",AllEmployeeIds[0],type,"latesterrmployeeeeee", AllEmployeeIds.length,"rrrrrr");

  if (AllEmployeeIds.length == 0 && type === "Internship") {
    // console.log("iiiiiiiiiiaaa");
    return "TDZI001";
  }
  // console.log("llllllllll");
  if (AllEmployeeIds.length == 0 && type === "Permanent") {
    // console.log("eeeeeeerrrrww");
    return "TDZE001";
  }
  // console.log("lkdlskdssd");

  if (AllEmployeeIds[0] > 0 && type === "Internship") {
    // console.log("wodiwiuwie");
    // const latestId = latestEmployee.emp_id;
    const numberPart = parseInt(AllEmployeeIds[0], 10);
    // console.log("odeidje",numberPart);
    const newId = `TDZI${(numberPart + 1).toString().padStart(3, "0")}`;
    // console.log("ruchucvhc",newId);
    return newId;
  }

  if (AllEmployeeIds[0] > 0 && type === "Permanent") {
    // const latestId = latestEmployee.emp_id;
    const numberPart = parseInt(AllEmployeeIds[0], 10);
    const newId = `TDZE${(numberPart + 1).toString().padStart(3, "0")}`;
    return newId;
  } else {
    return "TDZE001";
  }
};

// const uploadFiles = async (files) => {
//   const uploadPromises = files.map((file) => uploadFile(file, Allowed_type));
//   try {
//     const results = await Promise.all(uploadPromises);
//     const uploadedData = {
//       image_URL: results[0].success ? results[0].url : null,

//       // other_documents : results[1].success ? results[1].url : null
//     };
//     return uploadedData;
//   } catch (error) {
//     console.log("errorrr", error);
//     throw error;
//   }
// };

const uploadFiles = async (files) => {
  const uploadPromises = files.map((file) => uploadFile(file, Allowed_type));
  try {
    const results = await Promise.all(uploadPromises);
    console.log(results, "results");
    const uploadedData = {
      image_URL: results[0].success ? results[0].url : null,

      // other_documents : results[1].success ? results[1].url : null
    };
    console.log(uploadedData, "datauploaded");
    return uploadedData;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
};

// const bulkCreateEmployees = async (employeesData) => {
//   try {
//     // let latestEmployee = await Emp_onboarding.findOne({
//     //   order: [["updateAt", "DESC"]],
//     //   attributes: ["emp_id"],
//     // });
//     // let latestId =
//     //   latestEmployee && latestEmployee.emp_id
//     //     ? latestEmployee.emp_id
//     //     : "TDZE001";
//     // let numberPart = parseInt(latestId.slice(4), 10);

//     const employees = employeesData.map((data) => {
//       // const newId = `TDZE${(numberPart + 1).toString().padStart(3, "0")}`;
//       // numberPart += 1;
//       return {
//         emp_name: data.emp_name,
//         // emp_id: newId,
//         salary: data.salary,
//         password: data.password,
//         date_of_birth: data.date_of_birth,
//         position: data.position,
//         date_of_joining: data.date_of_joining,
//         city: data.city,
//         contact_number: data.contact_number,
//         permanent_address: data.permanent_address,
//         current_address: data.current_address,
//         education_qualification: data.education_qualification,
//         adharnumber: data.adharnumber,
//         bank_account: data.bank_account,
//         bank_name: data.bank_name,
//         IFSC_code: data.IFSC_code,

//         // Add other fields as required
//       };
//     });
//     // console.log("beforeeeebuplkcreateeee", employees);
//     try {
//       // Bulk insert employees
//       const response = await Emp_onboarding.bulkCreate(employees, {
//         validate: true,
//       });
//       return response;
//     } catch (error) {
//       console.log("error in bulk create", error);
//     }
//   } catch (error) {
//     throw new Error("Error bulk creating employees: " + error.message);
//   }
// };

// const createEmployee = async (employeedata, files) => {
//   try {
//     // console.log("kkkddd", employeedata.email, "emploeeee", employeedata);

//     const existingEmployee = await Emp_onboarding.findOne({where:{personal_email: employeedata.personal_email}})
//     if(existingEmployee){
//       throw new Error("Employee Already Registered");
//     }
//     if(files && Object.keys(files).length > 0){
//     console.log("kkkddd", employeedata.email, "emploeeee", employeedata);

//     const existingEmployee = await Emp_onboarding.findOne({
//       where: { email: employeedata.email },
//     });
//     if (files && Object.keys(files).length > 0) {
//       const uploadData = await uploadFiles([
//         files.image_URL[0],
//         // files.other_documents[0]
//       ]);
//       console.log("uploadDataaaaa", uploadData);

//       employeedata.image_URL = uploadData.image_URL;
//       // employeedata.other_documents = uploadData.other_documents;
//     }

//     const empType = employeedata.employee_type;
//     employeedata.emp_id = await generateEmployeeId(empType);
//     // console.log("employeedaataa", employeedata);

//     const password = employeedata.password;
//     console.log("password", password);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     employeedata.password = hashedPassword;
//     employeedata.leave_balance = employeedata.leave_bucket;
//     const loanAvailability = employeedata.salary/100*40;
//     console.log("loannnnnn",loanAvailability);
//     employeedata.loan_availability = loanAvailability;

//     // console.log("dataaaaaaaaa", employeedata, employeedata.leave_bucket,'leave Balance:',employeedata.leave_balance);
//     const employee = await Emp_onboarding.create(employeedata);
//     return employee;
//   }
// }
// catch (error) {
//   console.log("errrrrr", error);
//   throw error;
// }
// }



// const bulkCreateEmployees = async (employeesData, orgnaizationId) => {
//   try {
//     const orgData = await Organization.findByPk(orgnaizationId, {
//       include: [
//         {
//           model: Emp_onboarding,
//           as: "Employees_data",
//           where: { isDelete: false },
//         },
//         {
//           model: PremiumPlans,
//           as: "organization_plan",
//         },
//       ],
//     });

//     if (!orgData) {
//       throw new Error("Organization not found");
//     }

//     const existingCount = orgData.Employees_data.length;
//     const planType = orgData.organization_plan?.subscription || "Basic Plan";

//     let limit = 3;
//     if (planType === "Premium Plan") limit = 5;
//     else if (planType === "Advance Plan") limit = 8;

//     if (existingCount + employeesData.length > limit) {
//       throw new Error(
//         `Upload limit exceeded. Your plan (${planType}) allows only ${limit} employees.`
//       );
//     }

//     const existingEmails = await Emp_onboarding.findAll({
//       where: {
//         personal_email: employeesData.map((data) => data.personal_email),
//       },
//     });

//     if (existingEmails.length > 0) {
//       throw new Error("Some employees are already registered.");
//     }

//     const employees = await Promise.all(
//       employeesData.map(async (data) => {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(data.password, salt);

//         return {
//           ...data,
//           password: hashedPassword,
//           leave_balance: data.leave_bucket,
//           loan_availability: (data.salary / 100) * 40,
//         };
//       })
//     );

//     const response = await Emp_onboarding.bulkCreate(employees, {
//       validate: true,
//     });

//     return response;
//   } catch (error) {
//     console.error("Bulk Create Error:", error);
//     throw new Error("Error bulk creating employees: " + error.message);
//   }
// };


const bulkCreateEmployees = async (employeesData) => {
  try {
    const existingEmployees = await Emp_onboarding.findAll({
      where: {
        personal_email: employeesData.map((data) => data.personal_email),
      },
    });

    if (existingEmployees.length > 0) {
      throw new Error("Some employees are already registered.");
    }

    const employees = await Promise.all(
      employeesData.map(async (data) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        return {
          emp_name: data.emp_name,
          calling_name: data.calling_name,
          salary: data.salary,
          password: hashedPassword,
          date_of_birth: data.date_of_birth,
          position: data.position,
          date_of_joining: data.date_of_joining,
          city: data.city,
          contact_number: data.contact_number,
          alternative_number: data.alternative_number,
          permanent_address: data.permanent_address,
          current_address: data.current_address,
          role: data.role,

          father_or_husband_number: data.father_or_husband_number,
          father_or_husband_name: data.father_or_husband_name,
          mother_name: data.mother_name,
          mother_number: data.mother_number,

          personal_email: data.personal_email,
          bussiness_email: data.bussiness_email,
          userName: data.userName,
          image_URL: data.image_URL,

          TDS: data.TDS,
          Form16: data.Form16,
          Form24Q: data.Form24Q,
          leave_bucket: data.leave_bucket,
          leave_balance: data.leave_bucket, // Fix leave balance assignment
          wfh_bucket:data.wfh_bucket,
          wfh_no_ofdays: data.wfh_bucket, // Fix work from home assignment
          Religion: data.Religion,

          pf_account: data.pf_account,
          employee_type: data.employee_type,
          gender: data.gender,

          isBusiness: data.isBusiness,
          isFinance: data.isFinance,
          UAN_Number: data.UAN_Number,
          stipend: data.stipend,

          education_qualification: data.education_qualification,
          adharnumber: data.adharnumber,
          pancard: data.pancard,
          other_documents: data.other_documents,

          bank_account: data.bank_account,
          bank_name: data.bank_name,
          IFSC_code: data.IFSC_code,
          UPI_Id: data.UPI_Id,

          teamLeadId: data.teamLeadId,
          orgnaizationId: data.orgnaizationId, // Ensure organization ID is assigned
          loan_availability: (data.salary / 100) * 40, // Fix loan calculation
          emp_edit_request: data.emp_edit_request,
          gross_CTC: data.gross_CTC,
          DNS_allowances: data.DNS_allowances,
          HRA_allowances: data.HRA_allowances,
          Speciel_allowances: data.Speciel_allowances,
          travel_allowances: data.travel_allowances,
          medical_allowances: data.medical_allowances,
          food_allowances: data.food_allowances,
          variable_allowances: data.variable_allowances,
          pf_employeer_contribution: data.pf_employeer_contribution,
          pf_emp_contribution: data.pf_emp_contribution,
          emp_ESI_contribution: data.emp_ESI_contribution,
          department: data.department,
        };
      })
    );

    try {
      const response = await Emp_onboarding.bulkCreate(employees, {
        validate: true,
      });
      return response;
    } catch (error) {
      console.log("Error in bulk create", error);
      throw error;
    }
  } catch (error) {
    throw new Error("Error bulk creating employees: " + error.message);
  }
};

const createEmployee = async (employeedata, files) => {
  try {
    console.log(
      "kkkddd",
      employeedata.personal_email,
      "emploeeee",
      employeedata
    );

    const existingEmployee = await Emp_onboarding.findOne({
      where: { personal_email: employeedata.personal_email },
    });
    if (existingEmployee) {
      throw new Error("Employee Already Registered");
    }
    if (files && Object.keys(files).length > 0) {
      console.log("inxuihxuehce");
      const uploadData = await uploadFiles([
        files.image_URL[0],
        // files.other_documents[0]
      ]);
      console.log("uploadDataaaaa", uploadData);

      employeedata.image_URL = uploadData.image_URL;
      // employeedata.other_documents = uploadData.other_documents;
    }
    const empType = employeedata.employee_type;
    // employeedata.emp_id = await generateEmployeeId(empType);
    console.log("employeedaataa", employeedata);

    const password = employeedata.password;
    console.log("password", password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    employeedata.password = hashedPassword;
    employeedata.leave_balance = employeedata.leave_bucket;
    employeedata.wfh_no_ofdays=employeedata.wfh_bucket;

    // employeedata.wfh_no_ofdays = Number(employeedata.wfh_no_ofdays || 0);
    // employeedata.leave_bucket = Number(employeedata.leave_bucket || 0);

    const loanAvailability = (employeedata.salary / 100) * 40;
    console.log("loannnnnn", loanAvailability);
    employeedata.loan_availability = loanAvailability;

    console.log(
      "dataaaaaaaaa",
      employeedata,
      employeedata.leave_bucket,
      "leave Balance:",
      employeedata.leave_balance,
      employeedata.wfh_bucket,
      "wfh bucket:",
      employeedata.wfh_no_ofdays
    );
    try {
      const employee = await Emp_onboarding.create(employeedata);
      return employee;
    } catch (error) {
      // console.error("Error creating employee:", error.message || error);
      // console.error(error.stack);
      if (error.name === "SequelizeValidationError") {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error creating employee:", error.message || error);
      }
      console.error(error.stack);
    }
  } catch (error) {
    console.log("errrrrr", error);
    throw error;
  }
};

const getEmployees = async (page, limit) => {
  try {
    // console.log("servvvvvv", page, limit);

    // const offset = (page - 1) * limit;
    const employees = await Emp_onboarding.findAll({
      // limit, // Limit the number of records
      // offset, // Skip the initial records based on the offset
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
        },

        {
          model: Salary_Details,
          as: "employee_salaries",
        },
        // {
        //   model: Department,
        //   as: "departentsOfEmp",
        // },
        {
          model: Emp_onboarding,
          as: "teamLead",
        },
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
        },
        {
          model: EmployeeResignation,
          as: "emp_Resignation",
        },
        {
          model: GratuitySettlements,
          as: "emp_gratuitySettlements",
        },
        {
          model: Employee_documents,
          as: "employeedocuments",
        },
      ],
    });
    return employees;
  } catch (error) {
    throw error;
  }
};

const getOnboardemployeesOrganizationWise = async (
  id,
  page,
  pageSize,
  search = ""
) => {
  try {
    const offset = page * pageSize; // Calculate offset based on page number and page size

    // Search filter for emp_name
    let whereCondition = { orgnaizationId: id };

    if (search) {
      whereCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Fetch total count for pagination (including search filter)
    const totalEmployees = await Emp_onboarding.count({
      where: whereCondition,
    });

    // Fetch paginated employee data
    const employees = await Emp_onboarding.findAll({
      where: whereCondition,
      limit: pageSize,
      offset: offset,
      order: [["isDelete", "ASC"]], // Sorting by emp_name (optional)
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
        },
        {
          model: Salary_Details,
          as: "employee_salaries",
        },
        {
          model: Emp_onboarding,
          as: "teamLead",
        },
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
        },
        {
          model: EmployeeResignation,
          as: "emp_Resignation",
        },
        {
          model: GratuitySettlements,
          as: "emp_gratuitySettlements",
        },
        {
          model: Employee_documents,
          as: "employeedocuments",
        },
      ],
    });

    // Return employees along with total count
    return {
      employees,
      totalCount: totalEmployees,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// const getEmployeeByOrganizationId = async (id) => {
//   try {

//     const employees = await Emp_onboarding.findAll({
//       where: { orgnaizationId: id },

//       include: [
//         {
//           model: team_perfomance,
//           as: "Emp_teamPerformance",
//         },

//         {
//           model: Salary_Details,
//           as: "employee_salaries",
//         },

//         {
//           model: Emp_onboarding,
//           as: "teamLead",
//         },
//         {
//           model: LeavesCreation,
//           as: "Employee_LeaveCreation",
//         },
//         {
//           model: EmployeeResignation,
//           as: "emp_Resignation",
//         },
//         {
//           model: GratuitySettlements,
//           as: "emp_gratuitySettlements",
//         },
//         {
//           model: Employee_documents,
//           as: "employeedocuments",
//         },
//       ],
//     });
//     return employees;
//   } catch (error) {
//     throw error;
//   }
// };

const getTeamLeadEmployeesReport = async (id, page, pageSize, search) => {
  try {
    const offset = page * pageSize;

    let whereEMPCondition = {}; // Ensure this is always an object
    if (search) {
      whereEMPCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    const totalReports = await Emp_onboarding.count({
      where: {
        teamLeadId: id,
        ...whereEMPCondition, // Apply search filter
      },
      include: [
        {
          model: Report_Submission,
          as: "Employee_Reports",
          required: true,
        },
      ],
    });

    // Fetch paginated employee data with performance details
    const reports = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamMembers",
          where: whereEMPCondition, // Apply search filter
          limit: pageSize,
          offset: offset,
          required: true,
          include: [
            {
              model: Report_Submission,
              as: "Employee_Reports",
              required: true,
            },
          ],
        },
      ],
    });

    return {
      reports,
      totalCount: totalReports,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const getMonthNumber = (monthName) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.indexOf(monthName) + 1; // Months are 1-based in SQL
};

const getTeamLeadEmployeesPerformance = async (
  id,
  page,
  pageSize,
  year,
  monthName,
  search
) => {
  try {
    const offset = page * pageSize; // Calculate offset for pagination
    const month = getMonthNumber(monthName); // Convert month name to number

    console.log(month, "month number");

    // Initialize conditions
    let whereEMPCondition = {}; // Ensure this is always an object
    let whereCondition = {}; // Ensure this is always an object

    // Apply search filter for employee name
    if (search) {
      whereEMPCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Apply year and month filters
    if (year && month) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("date")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("date")),
          month
        ),
      ];
    } else if (year) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("date")),
          year
        ),
      ];
    } else if (month) {
      whereCondition[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("date")),
          month
        ),
      ];
    }

    // Count total employees with filters
    // const totalEmployees = await Emp_onboarding.count({
    //   where: whereEMPCondition, // Apply search filter
    //   include: [
    //     {
    //       model: Emp_onboarding,
    //       as: "teamMembers",
    //       required: true, // Ensures team members exist
    //       include: [
    //         {
    //           model: team_perfomance,
    //           as: "Emp_teamPerformance",
    //           where: whereCondition, // Apply date filters
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    // });

    const totalEmployees = await Emp_onboarding.count({
      where: {
        teamLeadId: id,
        ...whereEMPCondition, // Apply search filter
      },
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
          where: whereCondition,
          required: true, // Ensures only employees with performance records are counted
        },
      ],
    });

    // Fetch paginated employee data with performance details
    const employees = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamMembers",
          where: whereEMPCondition, // Apply search filter
          limit: pageSize,
          offset: offset,
          required: true,
          include: [
            {
              model: team_perfomance,
              as: "Emp_teamPerformance",
              where: whereCondition, // Apply date filters
              required: true,
            },
          ],
        },
      ],
    });

    return {
      employees,
      totalCount: totalEmployees,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const getTeamLeadEmployees = async (id) => {
  try {
    const employees = await Emp_onboarding.findAll({
      where: { teamLeadId: id },
      include: [
        {
          model: Emp_onboarding,
          as: "teamMembers",
        },
      ],
    });
    return employees;
  } catch (error) {
    throw error;
  }
};

const getEmployeeByOrganizationId = async (id) => {
  try {
    const employees = await Emp_onboarding.findAll({
      where: { orgnaizationId: id },
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
        },
        {
          model: Salary_Details,
          as: "employee_salaries",
        },
        {
          model: Emp_onboarding,
          as: "teamLead",
        },
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
        },
        {
          model: EmployeeResignation,
          as: "emp_Resignation",
        },
        {
          model: GratuitySettlements,
          as: "emp_gratuitySettlements",
        },
        {
          model: Employee_documents,
          as: "employeedocuments",
        },
      ],
    });

    return employees;
  } catch (error) {
    throw error;
  }
};

const getEmployeesByOrganizationForChat = async (id, currentUserId) => {
  try {
    const employees = await Emp_onboarding.findAll({
      where: { orgnaizationId: id, isDelete: false },
      attributes: [
        "id",
        "emp_name",
        "date_of_birth",
        "city",
        "contact_number",
        "bussiness_email",
        "position",
        "date_of_joining",
        "image_URL",
      ],
    });

    const employeeList = await Promise.all(
      employees.map(async (employee) => {
        const latestMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { senderId: currentUserId }, // Sent by current user
              { senderId: employee.id }, // Sent by employee
            ],
          },
          include: [
            {
              model: Emp_onboarding,
              as: "receivers",
              where: { id: [currentUserId, employee.id] }, // Filter receivers
              through: { attributes: [] }, // Exclude junction table attributes
            },
          ],
          order: [["createdAt", "DESC"]],
        });

        return {
          id: employee.id,
          emp_name: employee.emp_name,
          date_of_birth: employee.date_of_birth,
          city: employee.city,
          contact_number: employee.contact_number,
          bussiness_email: employee.bussiness_email,
          position: employee.position,
          date_of_joining: employee.date_of_joining,
          image_URL: employee.image_URL,
          lastMessageAt: latestMessage ? latestMessage.createdAt : null,
        };
      })
    );

    const sortedList = employeeList.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    console.log("Sorted List:", sortedList);
    return sortedList;
  } catch (error) {
    console.error("Error in service:", error);
    throw error;
  }
};

// const getEmployeeById = async (id) => {
//   try {
//     const empId = await Emp_onboarding.findOne({ where: { id: id } });
//     if (!empId) {
//       throw new Error("Employee ");
//     }
//     console.log("employeeservice",empId);
//     const employee = await Emp_onboarding.findByPk(id, {
//       include: [
//         {
//           model: EmployeeResignation,
//           as: "emp_Resignation",
//         },
//         // {
//         //   model: Sprints,
//         //   as: 'Employee_ProjectSprint', // Fetch associated sprints
//         // },
//         {
//           model: GratuitySettlements,
//           as: "emp_gratuitySettlements",
//         },
//         // {
//         //   model: Department,
//         //   as: "departentsOfEmp",
//         // },
//         {
//           model: Emp_onboarding,
//           as: "teamMembers",
//           include: [
//             {
//               model: team_perfomance,
//               as: "Emp_teamPerformance",
//             },
//             {
//               model: EmployeeResignation,
//               as: "emp_Resignation",
//             },
//             {
//               model: GratuitySettlements,
//               as: "emp_gratuitySettlements",
//             },
//             // {
//             //   model: Department,
//             //   as: "departentsOfEmp",
//             // },
//             {
//               model: Report_Submission,
//               as: "Employee_Reports",
//             },
//             // {
//             //   model: LeavesCreation,
//             //   as: "Employee_LeaveCreation"
//             // }
//           ],
//         },
//         {
//           model: Emp_onboarding,
//           as: "teamLead",
//         },
//         // {
//         //   model: Department,
//         //   as: "departentsOfEmp",
//         // },
//         {
//           model: Advance_Salary,
//           as: "Employee_Advance_Salary",
//         },
//         {
//           model: LeavesCreation,
//           as: "teamMembersLeaves",
//           include: [
//             {
//               model: Emp_onboarding,
//               as: "LeaveCreation",
//             },
//           ],
//         },
//         {
//           model: LeavesCreation,
//           as: "Employee_LeaveCreation",
//         },
//         {
//           model: team_perfomance,
//           as: "Emp_teamPerformance",
//         },

//         {
//           model: Report_Submission,
//           as: "Employee_Reports",
//         },
//         // {
//         //   model: Sprints,
//         //   as: "Employee_ProjectSprint",
//         // },
//         {
//           model: Employee_documents,
//           as: "employeedocuments",
//         },
//         {
//           model: Salary_Details,
//           as: "employee_salaries",
//         },
//         // {
//         //   model: ProjectBoard,
//         //   as: "teamLeadProjects", // Alias defined in the association
//         //   include: [
//         //     {
//         //       model: Emp_onboarding,
//         //       as: "teamLead", // Fetch team lead details from ProjectBoard
//         //     },
//         //   ],
//         // },
//       ],
//     });
//     console.log(employee, "employeeeeee")
//     return employee;
//   } catch (error) {
//     throw error;
//   }
// };

// const employeeLeaveDetails = await Emp_onboarding.findOne({
//   where: { id: employeeId }, // Replace with the actual employee ID
//   include: [
//       {
//           model: LeavesCreation,
//           as: 'Employee_LeaveCreation'
//       },
//       {
//           model: Emp_onboarding,
//           as: 'teamLead'
//       }
//   ]
// });

// const teamLeadEmployeesLeaves = await Emp_onboarding.findOne({
//   where: { id: teamLeadId }, // Replace with the actual team lead ID
//   include: [
//       {
//           model: Emp_onboarding,
//           as: 'teamMembers',
//           include: [
//               {
//                   model: LeavesCreation,
//                   as: 'Employee_LeaveCreation'
//               }
//           ]
//       }
//   ]
// });

// const getEmployeeById = async (id, page = 1, pageSize = 10, includeSections = []) => {
//   try {
//     // Calculate the offset based on page and pageSize
//     const offset = (page - 1) * pageSize;

//     // Fetch employee data by ID
//     const empId = await Emp_onboarding.findOne({ where: { id: id } });
//     if (!empId) {
//       throw new Error("Employee not found");
//     }

//     // Log employee data
//     console.log("employeeservice", empId);

//     // Build the include array dynamically based on the required sections
//     let includeArray = [
//       {
//         model: EmployeeResignation,
//         as: "emp_Resignation",
//       },
//       {
//         model: GratuitySettlements,
//         as: "emp_gratuitySettlements",
//       },
//       {
//         model: Emp_onboarding,
//         as: "teamMembers",
//         include: [
//           {
//             model: team_perfomance,
//             as: "Emp_teamPerformance",
//           },
//           {
//             model: EmployeeResignation,
//             as: "emp_Resignation",
//           },
//           {
//             model: GratuitySettlements,
//             as: "emp_gratuitySettlements",
//           },
//           {
//             model: Report_Submission,
//             as: "Employee_Reports",
//           },
//         ],
//       },
//       {
//         model: Emp_onboarding,
//         as: "teamLead",
//       },
//       {
//         model: Advance_Salary,
//         as: "Employee_Advance_Salary",
//       },
//       {
//         model: LeavesCreation,
//         as: "teamMembersLeaves",
//         include: [
//           {
//             model: Emp_onboarding,
//             as: "LeaveCreation",
//           },
//         ],
//       },
//       {
//         model: LeavesCreation,
//         as: "Employee_LeaveCreation",
//       },
//       {
//         model: team_perfomance,
//         as: "Emp_teamPerformance",
//       },
//       {
//         model: Report_Submission,
//         as: "Employee_Reports",
//       },
//       {
//         model: Employee_documents,
//         as: "employeedocuments",
//       },
//       {
//         model: Salary_Details,
//         as: "employee_salaries",
//       },
//     ];

//     // Modify the include array based on the requested sections
//     if (includeSections.length > 0) {
//       includeArray = includeArray.filter(item =>
//         includeSections.includes(item.as)
//       );
//     }

//     // Add pagination to specific sections
//     includeArray.forEach(section => {
//       if (section.include) {
//         section.include.forEach(subSection => {
//           if (subSection.as === "Employee_Reports" || subSection.as === "Employee_LeaveCreation" || subSection.as === "Emp_teamPerformance") {
//             subSection.limit = pageSize;
//             subSection.offset = offset;
//           }
//         });
//       } else if (section.as === "emp_Resignation" || section.as === "emp_gratuitySettlements") {
//         section.limit = pageSize;
//         section.offset = offset;
//       }
//     });

//     // Fetch employee details along with the required related models
//     const employee = await Emp_onboarding.findByPk(id, { include: includeArray });

//     console.log(employee, "employee details");

//     return employee;
//   } catch (error) {
//     throw error;
//   }
// };

const getEmployeeByIdforUpdation = async (id) => {
  try {
    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Employee_documents,
          as: "employeedocuments",
        },
        {
          model: EmployeeLetter,
          as: "letters",
        }
      ],
    });
    return employee;
  } catch (error) {
    throw error;
  }
};

const getEmployeeById = async (id, page, pageSize, includeSections = []) => {
  try {
    // Calculate offset for pagination
    const offset = page * pageSize;

    // Fetch employee data by ID
    const empId = await Emp_onboarding.findOne({
      where: { id: id },
      include: [
        {
          model: Organization,
          as: "organization_Employees",
          attributes: ["id", "companyName"], // Ensure "id" is also selected
        },
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
          // attributes:["id","LOP","monthly_leave_balance"]
        },
      ],
    });
    if (!empId) {
      throw new Error("Employee not found");
    }

    console.log("employeeservice", empId);

    // Initialize object to store total counts
    let totalCounts = {};

    // Count total records for each requested section
    if (includeSections.includes("Employee_Reports")) {
      totalCounts.Employee_Reports = await Report_Submission.count({
        where: { employeeId: id },
      });
    }
    if (includeSections.includes("Employee_LeaveCreation")) {
      totalCounts.Employee_LeaveCreation = await LeavesCreation.count({
        where: { empOnboardingId: id },
      });
    }
    if (includeSections.includes("Emp_teamPerformance")) {
      totalCounts.Emp_teamPerformance = await team_perfomance.count({
        where: { employeeId: id },
      });
    }
    if (includeSections.includes("emp_Resignation")) {
      totalCounts.emp_Resignation = await EmployeeResignation.count({
        where: { employeeId: id },
      });
    }
    if (includeSections.includes("emp_gratuitySettlements")) {
      totalCounts.emp_gratuitySettlements = await GratuitySettlements.count({
        where: { employeeId: id },
      });
    }
    if (includeSections.includes("employee_salaries")) {
      totalCounts.employee_salaries = await Salary_Details.count({
        where: { employeeId: id },
      });
    }

    // Build the include array dynamically
    let includeArray = [
      {
        model: EmployeeResignation,
        as: "emp_Resignation",
        limit: includeSections.includes("emp_Resignation")
          ? pageSize
          : undefined,
        offset: includeSections.includes("emp_Resignation")
          ? offset
          : undefined,
      },
      {
        model: GratuitySettlements,
        as: "emp_gratuitySettlements",
        limit: includeSections.includes("emp_gratuitySettlements")
          ? pageSize
          : undefined,
        offset: includeSections.includes("emp_gratuitySettlements")
          ? offset
          : undefined,
      },
      {
        model: Report_Submission,
        as: "Employee_Reports",
        limit: includeSections.includes("Employee_Reports")
          ? pageSize
          : undefined,
        offset: includeSections.includes("Employee_Reports")
          ? offset
          : undefined,
      },
      {
        model: LeavesCreation,
        as: "Employee_LeaveCreation",
        limit: includeSections.includes("Employee_LeaveCreation")
          ? pageSize
          : undefined,
        offset: includeSections.includes("Employee_LeaveCreation")
          ? offset
          : undefined,
      },
      {
        model: team_perfomance,
        as: "Emp_teamPerformance",
        limit: includeSections.includes("Emp_teamPerformance")
          ? pageSize
          : undefined,
        offset: includeSections.includes("Emp_teamPerformance")
          ? offset
          : undefined,
      },
      {
        model: Salary_Details,
        as: "employee_salaries",
        limit: includeSections.includes("employee_salaries")
          ? pageSize
          : undefined,
        offset: includeSections.includes("employee_salaries")
          ? offset
          : undefined,
      },
    ];

    // Filter the include array based on required sections
    includeArray = includeArray.filter((item) =>
      includeSections.includes(item.as)
    );

    // Fetch employee details along with related models
    const employee = await Emp_onboarding.findByPk(id, {
      include: includeArray,
    });

    console.log(totalCounts, "employee details");

    // Return both employee data and total counts
    return { employee, totalCounts,  leaveCreation: empId.Employee_LeaveCreation,};
  } catch (error) {
    throw error;
  }
};

const getEmployeeAdvanceSalaryById = async (id, page, pageSize) => {
  const offset = page * pageSize;
  try {
    const advanceSalaryCount = await Emp_onboarding.count({
      where: { id: id },
      include: [
        {
          model: Advance_Salary,
          as: "Employee_Advance_Salary",
        },
      ],
    });

    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Advance_Salary,
          as: "Employee_Advance_Salary",
          limit: pageSize,
          offset: offset,
          order: [["date_of_request", "DESC"]],
        },
      ],
    });
    return { employee, advanceSalaryCount };
  } catch (error) {
    throw error;
  }
};

const getEmployeePerformanceById = async (id, page, pageSize) => {
  const offset = page * pageSize;
  try {
    const performanceCount = await Emp_onboarding.count({
      where: { id: id },
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
        },
      ],
    });

    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
          limit: pageSize,
          offset: offset,
          order: [["date", "DESC"]],
        },
      ],
    });
    return { employee, performanceCount };
  } catch (error) {
    throw error;
  }
};

const getTeamMembersLeave = async (id, page, pageSize) => {
  const offset = page * pageSize;
  try {
    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: LeavesCreation,
          as: "teamMembersLeaves",
          limit: pageSize,
          offset: offset,
          separate: true, // Ensures sorting applies correctly
          order: [
            [
              Sequelize.literal(
                `CASE WHEN status = 'Pending' THEN 1 ELSE 2 END`
              ),
              "ASC",
            ], // Prioritize 'Pending' status first
            ["updatedAt", "DESC"], // Then sort by updatedAt
          ],
          include: [
            {
              model: Emp_onboarding,
              as: "LeaveCreation",
            },
          ],
        },
      ],
    });

    return employee;
  } catch (error) {
    console.error("Error fetching team members' leaves:", error);
    throw error;
  }
};

const getEmployeeLevaveById = async (id, page, pageSize) => {
  const offset = page * pageSize;
  try {
    const leaveCount = await LeavesCreation.count({
      where: { empOnboardingId: id }, // Replace with the correct foreign key
    });

    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
          limit: pageSize,
          offset: offset,
        },
      ],
    });
    return { employee, leaveCount };
  } catch (error) {
    throw error;
  }
};

const getEmployeeWeeklyAttendance = async (id) => {
  try {
    const employee = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamMembers",
          // include: [
          //   {
          //     model: team_perfomance,
          //     as: "Emp_teamPerformance",
          //   },
          //   {
          //     model: EmployeeResignation,
          //     as: "emp_Resignation",
          //   },
          //   {
          //     model: GratuitySettlements,
          //     as: "emp_gratuitySettlements",
          //   },
          //   {
          //     model: Report_Submission,
          //     as: "Employee_Reports",
          //   },
          // ],
        },
      ],
    });
    return employee;
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (id, data, files) => {
  try {
    console.log("jhdeuihurhuhf", data, files, id);
    // console.log("daaataaa.paaasowrddd", data.password);
    const existingEmployee = await Emp_onboarding.findOne({
      where: { id: id },
    });
    console.log(existingEmployee, "existing employee");
    if (!existingEmployee) {
      throw new Error("Employee doesn't exist");
    }
    console.log("jhgfhghghjhj");

    if (files && Object.keys(files).length > 0 && files.image_URL) {
      console.log("kjhghjghj");
      const uploadData = await uploadFiles([
        files.image_URL[0],
        // files.other_documents[0]
      ]);
      console.log("uploadDataaaaa", uploadData);

      data.image_URL = uploadData.image_URL;
      // employeedata.other_documents = uploadData.other_documents;
    }
    // console.log(
    //   "olddddnewwww",
    //   existingEmployee.password,
    //   data.oldPassword,
    //   data.password
    // );

    if (data.password && data.oldPassword) {
      const isMatch = await bcrypt.compare(
        data.oldPassword,
        existingEmployee.password
      );
      console.log("issmaatchh", isMatch);

      if (isMatch === false) {
        console.log("conditiooooo");
        throw new Error("Old Password does not match");
      }
      // if (isMatch) {
      //   console.log("Password matches");
      // } else {
      //   console.log("Password does not match");
      //   throw new Error("Old Password does not match");
      // }

      if (data.oldPassword === data.password) {
        throw new Error("New password can't be the same as the old password");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;
      console.log("new passwordddd", data.password);
    }
    // else if (data.password && !data.oldPassword) {
    //   throw new Error("Old password is required to change password");
    // }
    if (data.password) {
      const password = data.password;
      console.log("passwordsssss", password);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("passwordggggggg", hashedPassword);
      data.password = hashedPassword;
    }
    if (existingEmployee.leave_balance == null) {
      data.leave_balance = data.leave_bucket;
    }
    if(existingEmployee.wfh_no_ofdays == null){
      data.wfh_no_ofdays = data.wfh_bucket;
    }
    
    const loanAvailability = (data.salary / 100) * 40;
    console.log("loannnnnn", loanAvailability);
    data.loan_availability = loanAvailability;
    const updatedEmployee = await Emp_onboarding.update(
      { ...data, teamLeadId: data.teamLeadId === "" ? null : data.teamLeadId },
      {
        where: { id: id },
        returning: true,
      }
    );

    // if (rowsAffected === 0) {
    //   throw new Error("Employee update failed");
    // }
    console.log("Updated Employee Data:", updatedEmployee[1]);
    return updatedEmployee[1];
  } catch (error) {
    throw error;
  }
};

const updateEmployeeStatus = async (id, status) => {
  try {
    console.log("Updating employee status for ID:", id);
    console.log("New status:", status);
    const updatedEmployee = await Emp_onboarding.update(
      { isDelete: status },
      {
        where: { id: id },
        returning: true, // <-- This is required to get the updated rows
      }
    );

    if (updatedEmployee[0] === 0) {
      throw new Error("Employee update failed");
    }
    return updatedEmployee[1][0]; // This will now work correctly


  } catch (error) {
    console.error("Error updating employee status:", error);
    throw error;
  }
};


const deleteEmployee = async (id) => {
  try {
    const response = await Emp_onboarding.destroy({
      where: { id: id },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const renewalEmployeeBalances = async (orgId) => {
  console.log(orgId, "orgidddddd in renewal");
  try {
    const hrSettings = await HrPanel.findOne({
      where: { orgnaizationID: orgId },
    });
    console.log("hrSettings", hrSettings);
    if (!hrSettings) {
      throw new Error("HR Settings not found");
    }

    const { leave_balance, wfh_no_ofdays } = !hrSettings;

    const [updatedCount] = await Emp_onboarding.update(
      {
        leave_balance: leave_balance,
        wfh_no_ofdays: wfh_no_ofdays,
      },
      {
        where: {
          orgnaizationId: orgId,
          isDelete: false,
        },
      }
    );
    console.log(
      `Renewed balances for ${updatedCount} employees in organization ${orgId}`
    );
    return updatedCount;
  } catch (error) {
    console.log("error in renewal", error);
    throw error;
  }
};

const exportEmployees = async (id) => {
  try {
    const employees = await Emp_onboarding.findAll({
      where: { orgnaizationId: id },
    });
    return employees;
  } catch (error) {
    throw error;
  }
};

const updateEmployeeProfile = async (id, profileData) => {
  try {
    console.log("Updating profile for Employee ID:", id);
    console.log("Profile Data:", profileData);

    const existingEmployee = await Emp_onboarding.findOne({
      where: { id: id },
    });
    if (!existingEmployee) {
      throw new Error("Employee doesn't exist");
    }

    // Define allowed profile fields
    const allowedFields = [
      "emp_name",
      "calling_name",
      "contact_number",
      "alternative_number",
      "date_of_birth",
      "education_qualification",
      "father_or_husband_name",
      "father_or_husband_number",
      "mother_name",
      "mother_number",
      "current_address",
      "permanent_address",
      "city",
      "Religion",
      "gender",
      "pancard",
      "adharnumber",
      "bank_account",
      "bank_name",
      "IFSC_code",
      "UAN_Number",
      "personal_email",
      "bussiness_email",
      "position",
      "department",
      "date_of_joining",
      "employee_type",
      "wfh_no_ofdays",
      "leave_balance",
    ];

    // Filter profileData to include only allowed fields
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        // Empty strings from the form should clear the column rather than be
        // written verbatim — writing "" into numeric/date/enum columns errors.
        const value = profileData[field];
        filteredData[field] = value === "" ? null : value;
      }
    });

    // Update only the allowed profile fields
    const [rowsAffected, updatedEmployees] = await Emp_onboarding.update(
      filteredData,
      {
        where: { id: id },
        returning: true, // Returns the updated record
      }
    );

    if (rowsAffected === 0) {
      throw new Error("Profile update failed");
    }

    console.log("Updated Profile Data:", updatedEmployees[0]);
    return updatedEmployees[0]; // Sequelize returns an array with update results
  } catch (error) {
    throw error;
  }
};

const getEmployeesForDocumentLetters = async (id) => {
  try {
    const employees = await Emp_onboarding.findAll({
      where: { orgnaizationId: id, isDelete: false },
      attributes: [
        "id",
        "emp_name",
        "personal_email",
        "contact_number",
        "position",
      ],
    });
    return employees;
  } catch (error) {
    console.error("Error in service:", error);
    throw error;
  }
};

module.exports = {
  createEmployee,
  bulkCreateEmployees,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByOrganizationId,
  getOnboardemployeesOrganizationWise,
  getEmployeeWeeklyAttendance,
  getEmployeeByIdforUpdation,
  getEmployeeLevaveById,
  getTeamMembersLeave,
  getEmployeePerformanceById,
  getEmployeeAdvanceSalaryById,
  getTeamLeadEmployees,
  getTeamLeadEmployeesPerformance,
  getTeamLeadEmployeesReport,
  getEmployeesByOrganizationForChat,
  renewalEmployeeBalances,
  exportEmployees,
  updateEmployeeProfile,
  getEmployeesForDocumentLetters,
  updateEmployeeStatus
};
