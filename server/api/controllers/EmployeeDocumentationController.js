const employeeDocumentationService = require("../services/employeeDocumentationService");

const createEmployeeDocumentation = async (req, res) => {
  console.log(req.body, "Request received:");
  try {
    const employeeDocumentation =
      await employeeDocumentationService.createEmployeeDocumentation(req.body);
    console.log(
      employeeDocumentation,
      "Employee Documentation created successfully"
    );
    res.status(201).json(employeeDocumentation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeDocumentation = async (req, res) => {
  try {
    const employeeDocumentation =
      await employeeDocumentationService.getEmployeeDocumentation();
    console.log(employeeDocumentation, "Employee Documentationaaaa");
    res.status(200).json(employeeDocumentation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getEmployeeDocumentationByOrgId = async (req, res) => {
  try {
    const getDocumentsByOrgId =
      await employeeDocumentationService.getEmployeeDocumentationByOrgId(
        req.params.id
      );
    console.log(getDocumentsByOrgId, "Employee Documentationaaaasss");
    res.status(200).json(getDocumentsByOrgId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployeeDocumentation = async (req, res) => {
  try {
    const employeeDocumentation =
      await employeeDocumentationService.updateEmployeeDocumentation(
        req.params.id,
        req.body
      );
    if (employeeDocumentation) {
      res.status(200).json(employeeDocumentation);
    } else {
      res.status(404).json({ message: "Employee documentation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployeeDocumentation = async (req, res) => {
  try {
    const employeeDocumentaion =
      await employeeDocumentationService.deleteEmployeeDocumentation(
        req.params.id
      );
    if (employeeDocumentaion) {
      res
        .status(200)
        .json({ message: "Employee documentation deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployeeDocumentation,
  getEmployeeDocumentation,
  getEmployeeDocumentationByOrgId,
  updateEmployeeDocumentation,
  deleteEmployeeDocumentation,
};
