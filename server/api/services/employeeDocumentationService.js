const Emp_onboarding = require("../models/Emp_onboarding");
const EmployeeLetter = require("../models/EmployeeDocumentationModel");
const EmployeeDocumentation = require("../models/EmployeeDocumentationModel");

const createEmployeeDocumentation = async (employeeDocumentation) => {
  console.log(employeeDocumentation, "employeeDocumentationaaaa");
  try {
    const CreateEmployeeDocumentation = await EmployeeDocumentation.create(
      employeeDocumentation
    );
    return CreateEmployeeDocumentation;
  } catch (error) {
    console.error("Error in createEmployeeDocumentation:", error);
    throw new Error("Error creating employee documentation");
  }
};

const getEmployeeDocumentation = async () => {
  try {
    const getEmployeeDocumentation = await EmployeeDocumentation.findAll({
      // include: [
      //   {
      //     model: Organization,
      //     as: "organization",
      //   },
      // ],
    });
    console.log(getEmployeeDocumentation, "Employee Documentationaaaa");
    return getEmployeeDocumentation;
  } catch (error) {
    console.error("Error in getEmployeeDocumentation:", error);
    throw new Error("Error retrieving employee documentation");
  }
};

const getEmployeeDocumentationByOrgId = async (id) => {
  console.log(id, "idddddorgid");
  try {
    const getDocumentsByOrgId = await EmployeeDocumentation.findAll({
      where: { organizationId: id },
      include:[
        {
          model: Emp_onboarding,
          as:"employeeLetters"
        }
      ]
    });
    console.log(getDocumentsByOrgId, "getDocumentsByOrgId called");
    return getDocumentsByOrgId;
  } catch (err) {
    console.error("Error in getEmployeeDocumentationByOrgId:", err);
    throw new Error("Error retrieving employee documentation by org ID");
  }
};



const updateEmployeeDocumentation = async (id, employeeDocumentation) => {
  try {
    const [updated] = await EmployeeDocumentation.update(
      employeeDocumentation,
      {
        where: { id: id },
      }
    );
    if (updated) {
      const updatedEmployeeDocumentation = await EmployeeDocumentation.findOne({
        where: { id: id },
      });
      return updatedEmployeeDocumentation;
    }
  } catch (error) {
    console.error("Error in updateEmployeeDocumentation:", error);
    throw new Error("Error updating employee documentation");
  }
};

const deleteEmployeeDocumentation = async (id) => {
  try {
    const deleteEmployeeDocumentation = await EmployeeDocumentation.destroy({
      where: { id: id },
    });
    return deleteEmployeeDocumentation;
  } catch (error) {
    console.error("Error in deleteEmployeeDocumentation:", error);
    throw new Error("Error deleting employee documentation");
  }
};

module.exports = {
  createEmployeeDocumentation,
  getEmployeeDocumentation,
  getEmployeeDocumentationByOrgId,
  updateEmployeeDocumentation,
  deleteEmployeeDocumentation,
};
