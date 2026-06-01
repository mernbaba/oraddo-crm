const ALLOWED_EMP_DOC_TYPES = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const EmployeeSatisfactionSurvey = require('../models/employeeSatisfationSurvey');

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

const createEmployeeSurvey = async (data) => {
  try {       
    const employeeSurvey = await EmployeeSatisfactionSurvey.create(data);
    return employeeSurvey;
  } catch (error) {
    throw new Error('Error creating employee survey');
  }
};

const getAllEmployeeSurvey = async () => {
  try {
    const employeeSurvey = await EmployeeSatisfactionSurvey.findAll();
    return employeeSurvey;
  } catch (error) {
    throw new Error('Error retrieving employee survey');
  }
};

const getEmployeeSurveyById = async (id) => {
  console.log(id,"from employeeid")
  try {
    const employeeSurvey = await EmployeeSatisfactionSurvey.findByPk(id)
      return employeeSurvey
  } catch (error) {
    throw new Error('Error retrieving employee survey by ID');
  }
};

const updateEmployeeSurvey= async (id, surveyData) => {
  try {
    const updatedEmployeesurvey = await EmployeeSatisfactionSurvey.update(surveyData, { where: { id:id } });
   return updatedEmployeesurvey;
  } catch (error) {
    throw new Error('Error updating employee survey');
  }
};

const deleteEmployeeSurvey = async (id) => {
  try {
await EmployeeSatisfactionSurvey.destroy({ where: { id:id } });

  } catch (error) {
    throw new Error('Error deleting employee survey');
  }
};

module.exports = {
  createEmployeeSurvey,
  getAllEmployeeSurvey,
  getEmployeeSurveyById,
  updateEmployeeSurvey,
  deleteEmployeeSurvey,
};
