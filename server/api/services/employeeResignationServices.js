const ALLOWED_EMP_DOC_TYPES = require("../../fileUpload/alowedtypes");
const uploadFile = require("../../fileUpload/fileupload");
const EmployeeResignation = require("../models/empResignationProcess");
const Emp_onboarding = require('../models/Emp_onboarding');
const { Model } = require("sequelize");
const EmployeeFinalSettlement = require('../models/employeeFinalSettlement');
const Gratuity_Settlement = require("../models/GratuitySettlement");
const Salary_advance = require("../models/salary_advance_loan");

const uploadFiles = async (files) => {
  console.log("filllllssssss", files, "jhdjfhdfhf", files[0].mimetype);
  if (files[0].mimetype) {
    const uploadPromises = await uploadFile(files[0], ALLOWED_EMP_DOC_TYPES);
    try {
      const resignationFileUrl = await uploadPromises;
      console.log("kkloooiiiii", resignationFileUrl.url);

      return resignationFileUrl.url;
    } catch (error) {
      console.error("Upload failed:", error);
    }
    console.log("kkloooiiiii", resignationFileUrl);

    return resignationFileUrl.url;
  }
  if (files) {
    const uploadPromises = files.map(file =>
      uploadFile(file, ALLOWED_EMP_DOC_TYPES)
    );
    console.log("orogooooo", uploadPromises);

    try {
      const results = await Promise.all(uploadPromises);
      console.log("jfjhdfjdhjdfh", results);
      if (results) {
        const uploadedData = {
          resignation_letter: results[0].success ? results[0].url : null,
          other_documents: results[1].success ? results[1].url : null
        }
        return uploadedData;
      }

    } catch (error) {
      console.log("errorrr", error);
      throw error;
    }
  }

}

const createEmployeeResignation = async (employeedata, files) => {
  console.log(employeedata, "hjbjbbnb.");

  const salaryLoan = await Salary_advance.findOne({
    where: {
      empOnboardingId: employeedata.emp_onboarding_id
    }
  })
  console.log("lllppppsss", salaryLoan);

  const hasCompletedLoan = salaryLoan?.loan_status;
  console.log("hascomplteddloannn", hasCompletedLoan);

  if (hasCompletedLoan === 'Closed' || hasCompletedLoan === null || salaryLoan === null) {
    console.log("emploeeeee......", employeedata, "filesss......", files);
    try {
      if (files) {
        console.log("insidefilessss", files);
        console.log("jhdjhjfssaaa", files.resignation_letter, files.other_documents);

        if (files?.resignation_letter || files?.other_documents) {
          if (files.resignation_letter) {
            const resignationUpload = await uploadFile(files.resignation_letter[0]);
            console.log(resignationUpload, 'response');

            employeedata.resignation_letter = resignationUpload.url;
          }

          // const uploadedData = await uploadFiles([
          //   files?.resignation_letter[0],
          //   // files?.other_documents[0]  
          // ]);
          // console.log("jsjshuj",uploadedData);
          if (files?.other_documents) {
            const uploadPromises = files.other_documents.map((doc) => uploadFile(doc));
            const uploadedDocuments = await Promise.all(uploadPromises);
            console.log("upppppppppppppp", uploadedDocuments);

            const documentUrls = uploadedDocuments?.map((doc) => doc.url);
            employeedata.other_documents = documentUrls; // Store array of URLs
          }

          // employeedata.other_documents = uploadedData.other_documents; 
          // employeedata.resignation_letter = uploadedData.resignation_letter;

          console.log(employeedata.other_documents, "data..");
          console.log(employeedata.resignation_letter, "data..");
        }
        // else {
        //   console.log("kaklklskllkll");

        //   const uploadedData = await uploadFiles([
        //     files?.resignation_letter[0]
        //   ]);
        //   console.log("ssssssssssss",uploadedData);
        //   employeedata.resignation_letter = uploadedData
        // }
        // employeedata.resignation_letter = uploadedData.receipt;

      }
      console.log("compomeeeee", employeedata);
      if (!Array.isArray(employeedata.other_documents)) {
        employeedata.other_documents = [];
      }
      console.log(employeedata, "hvhgv");

      const employeeResignation = await EmployeeResignation.create(employeedata);
      console.log(employeeResignation, "craeted")
      return employeeResignation;

    } catch (error) {
      console.log(error, "errr...");
      throw new Error("Error creating employee resignation");
    }
  } else {
    return { success: false, message: "Your loan has not yet been closed. Please close the loan before submitting your resignation." };
  }

};

const getAllEmployeeResignation = async (req, res) => {

  try {
    const employeeResignation = await Emp_onboarding.findAll(
      {
        include: [
          {
            model: EmployeeFinalSettlement,
            as: "FinalSettlements"
          }
          ,
          {
            model: Gratuity_Settlement,
            as: "emp_gratuitySettlements"
          },
          {
            model: EmployeeResignation,
            as: "emp_Resignation"
          }

        ]
      }
    );
    console.log(employeeResignation, "dara..");
    //  return res.status(200).json(employeeResignation)
    return employeeResignation;
  } catch (error) {
    console.log(error, "serviceError");
    throw new Error("Error ");
  }
};


const getAllEmployeeResignationbyOrganizationId = async (id) => {
  console.log(id,"fromGetAll")

  try {
    const employeeResignation = await Emp_onboarding.findAll(
      {
        where: { orgnaizationId: id },
        include: [
          {
            model: EmployeeFinalSettlement,
            as: "FinalSettlements"
          }
          ,
          {
            model: Gratuity_Settlement,
            as: "emp_gratuitySettlements"
          },
          {
            model: EmployeeResignation,
            as: "emp_Resignation",
            required: true
          }

        ]
      }
    );
    console.log(employeeResignation, "dara..");
    //  return res.status(200).json(employeeResignation)
    return employeeResignation;
  } catch (error) {
    console.log(error, "serviceError");
    throw new Error("Error ");
  }
};


const getEmployeeResignationById = async (id) => {
  console.log(id, "from employeeid");
  try {
    const employeeResignation = await Emp_onboarding.findByPk(id,
      {
        include: [
          {
            model: EmployeeFinalSettlement,
            as: "FinalSettlements"
          }
          ,
          {
            model: Gratuity_Settlement,
            as: "emp_gratuitySettlements"
          },
          {
            model: EmployeeResignation,
            as: "emp_Resignation"
          },
          {
            model: Emp_onboarding,
            as: "teamLead",
          }

        ]
      }
    );
    return employeeResignation;
  } catch (error) {
    console.log(error, "errorssss");

    throw new Error("Error");
  }
};

const updateEmployeeResignation = async (id, data) => {
  try {
    const updatedEmployeeResignation = await EmployeeResignation.update(data, {
      where: { id: id }
    });
    return updatedEmployeeResignation;
  } catch (error) {
    console.log(error,"jkbkbhb");
    
    throw new Error("Error");
  }
};

const deleteEmployeeResignation = async (id) => {
  try {
    await EmployeeResignation.destroy({ where: { id: id } });
  } catch (error) {
    throw new Error("Error deleting employee expense");
  }
};

module.exports = {
  createEmployeeResignation,
  getAllEmployeeResignation,
  getEmployeeResignationById,
  updateEmployeeResignation,
  deleteEmployeeResignation,
  getAllEmployeeResignationbyOrganizationId
};
