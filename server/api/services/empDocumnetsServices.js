const Allowed_type = require('../../fileUpload/alowedtypes');
const uploadFile = require('../../fileUpload/fileupload');
const EmployeeDocument = require('../models/empDocuments');



const uploadFiles = async (files) => {
  console.log('fileesssss', files);

  const uploadPromises = files.map(file => uploadFile(file, Allowed_type));
  try {
    const results = await Promise.all(uploadPromises);
    const uploadedData = {
      file_url: results[0].success ? results[0].url : null,
    }
    return uploadedData;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
}

// const createEmployeeDocument = async (payload) => {
//   try {
//     // Extract the employee ID
//     console.log("payloadddddddddd", payload);
//     let expensesId;
//     let employeeid;
//     if (payload.fields.expensesId) {
//       expensesId = payload.fields.expensesId;  // Assuming employeeid is an array with a single value
//     } else {
//       employeeid = payload.fields.employeeid;
//     }

//     console.log("empid", expensesId, employeeid, payload);

//     // Initialize an array to store document data
//     const documentsData = [];

//     // Loop through the form data and files
//     for (let i = 0; i < Object.keys(payload.files).length; i++) {

//       console.log("ssss")
//       const formType = payload.fields[`documentsData[${i}].form_type`][0];
//       const file = payload.files[`documentsData[${i}].file`][0];
//       console.log("dffdff", formType, file);


//       // Upload the file to S3
//       const s3Response = await uploadFile(file, Allowed_type);
//       console.log("urlllllllllll", s3Response.url)
//       // Add the document data to the documents array
//       if (expensesId) {
//         documentsData.push({
//           expensesId: expensesId,
//           form_type: formType,
//           file_url: s3Response.url // S3 file URL
//         });
//       } else {
//         documentsData.push({
//           employeeid: employeeid,
//           form_type: formType,
//           file_url: s3Response.url // S3 file URL
//         });
//       }

//     }


//     // Create the final employee document data object
//     // const employeeDocumentData = {
//     //   employeeId: employeeId,
//     //   documents: documentsData // Array of form_type and file_url
//     // };
//     console.log("aaaaaaaaa", { documentsData })
//     // Save the data in the database
//     return await EmployeeDocument.bulkCreate(documentsData);
//   } catch (error) {
//     throw error;
//   }
// };


const createEmployeeDocument = async (payload) => {
  try {
    console.log("Payload received:", payload);
    let expensesId, employeeid;

    if (payload.fields.expensesId) {
      expensesId = payload.fields.expensesId;
    } else {
      employeeid = payload.fields.employeeid;
    }

    console.log("Extracted IDs:", { expensesId, employeeid });

    const documentsData = [];

    for (let i = 0; i < Object.keys(payload.files).length; i++) {
      const formTypeField = payload.fields[`documentsData[${i}].form_type`];
      const fileField = payload.files[`documentsData[${i}].file`];
      const formType = formTypeField && formTypeField[0];
      const file = fileField && fileField[0];

      if (!formType || !file) {
        console.error(`Missing form type or file for index ${i}:`, { formType, file });
        continue;
      }

      const s3Response = await uploadFile(file, Allowed_type);
      console.log(`Uploaded file to S3: ${s3Response.url}`);

      documentsData.push({
        ...(expensesId ? { expensesId } : { employeeid }),
        form_type: formType,
        file_url: s3Response.url,
      });
    }

    console.log("Documents data prepared:", documentsData);
    return await EmployeeDocument.bulkCreate(documentsData);
  } catch (error) {
    console.error("Error in createEmployeeDocument:", error);
    throw error;
  }
};


const getEmployeeDocuments = async () => {
  try {
    const employeeDocuments = await EmployeeDocument.findAll();
    return employeeDocuments;
  } catch (error) {
    throw error;
  }
};

const getEmployeeDocumentById = async (id) => {
  try {
    const employeeDocument = await EmployeeDocument.findByPk(id);
    if (!employeeDocument) {
      throw new Error('Employee document not found');
    }
    return employeeDocument;
  } catch (error) {
    throw error;
  }
};

const updateEmployeeDocument = async (id, data) => {
  try {
    const [updated] = await EmployeeDocument.update(data, {
      where: { id: id }
    });
    if (!updated) {
      throw new Error('Employee document not found');
    }
    const updatedEmployeeDocument = await EmployeeDocument.findByPk(id);
    return updatedEmployeeDocument;
  } catch (error) {
    throw error;
  }
};

const deleteEmployeeDocument = async (id) => {
  try {
    const deleted = await EmployeeDocument.destroy({
      where: { id: id }
    });
    if (!deleted) {
      throw new Error('Employee document not found');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEmployeeDocument,
  getEmployeeDocuments,
  getEmployeeDocumentById,
  updateEmployeeDocument,
  deleteEmployeeDocument
};