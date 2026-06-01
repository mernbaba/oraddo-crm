const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");
const uploadFile = require("../../fileUpload/fileupload");
const EmployeePoll = require("../models/employeePoll");
const Emp_onboarding = require("../models/Emp_onboarding");
// const Employee_documents=require("../models/empDocuments")

// const uploadFiles = async (files) =>{
//     const uploadPromises = files.map(file=>
//      uploadFile(file, ALLOWED_EMP_DOC_TYPES)
//     );
//       try {
//         const results = await Promise.all(uploadPromises);
//         const uploadedData = {
//             receipt : results[0].success ? results[0].url : null,
//         }
//         return uploadedData;
//       } catch (error) {
//         console.log("errorrr", error);
//         throw error;
//       }
//   }

const createEmployeePoll = async (pollData) => {
  console.log(pollData, "files form post");
  try {
    const employeePoll = await EmployeePoll.create(pollData);
    return employeePoll;
  } catch (error) {
    throw new Error("Error creating employee pollData");
  }
};

const getAllEmployeePoll = async () => {
  try {
    console.log("hvgydrdytguh");

    const employeePoll = await EmployeePoll.findAll();
    return employeePoll;
  } catch (error) {
    throw new Error("Error retrieving employee pollData");
  }
};

const getEmployeePollById = async (id) => {
  console.log(id, "from employeeid");
  try {
    const employeePoll = await EmployeePoll.findByPk(id);
    return employeePoll;
  } catch (error) {
    throw new Error("Error retrieving employee pollData by ID");
  }
};

const updateEmployeePoll = async (id, pollData) => {
  try {
    const updatedEmployeePoll = await EmployeePoll.update(data, {
      where: { id: id },
    });
    return updatedEmployeePoll;
  } catch (error) {
    throw new Error("Error updating polldata ");
  }
};

const deleteEmployeePoll = async (id) => {
  try {
    await EmployeePoll.destroy({ where: { id:id } });
  } catch (error) {
    throw new Error("Error deleting employee pollData");
  }
};

module.exports = {
  createEmployeePoll,
  getAllEmployeePoll,
  getEmployeePollById,
  updateEmployeePoll,
  deleteEmployeePoll,
};
