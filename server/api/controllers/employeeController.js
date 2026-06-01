const employeeService = require("../services/employeeService");
const parseRequestFiles = require("../../fileUpload/requestedfile");
const xlsx = require("xlsx");
const csv = require("csvtojson");
const Organization = require("../models/OrganizationModule");
const Employee_Onboarding = require("../models/Emp_onboarding");
const PremiumPlans = require("../models/premiumPlans");
const ExcelJS = require("exceljs");
const { where, Sequelize } = require("sequelize");
const LeavesCreation = require("../models/leavesCreation");

// const bulkUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "No file uploaded" });
//     }

//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const employeesData = xlsx.utils.sheet_to_json(sheet); // Converts sheet to JSON

//     // Call service to bulk create employees
//     const response = await employeeService.bulkCreateEmployees(employeesData);
//     res
//       .status(200)
//       .send({ message: "Employees uploaded successfully", response: response });
//   } catch (error) {
//     res.status(500).send({ message: "Error uploading file", error });
//   }
// };

const bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const { orgnaizationId, teamLeadId } = req.body;
    console.log(orgnaizationId, "orgnaizationId");
    if (!orgnaizationId) {
      return res.status(400).send({ message: "Organization ID is required" });
    }

    // Parse Excel file

    let employeesData;
    // if (req.file.mimetype === "text/csv") {
    //   // Parse CSV file
    //   const parsedData = await csv().fromString(req.file.buffer.toString());

    //   // Filter out rows that are completely empty (all values are falsy)
    //   employeesData = parsedData.filter((emp) =>
    //     Object.values(emp).some((value) => value && value.trim() !== "")
    //   );

    //   console.log(employeesData, "Filtered employee data");
    // } else {
    //   return res.status(400).send({ message: "Unsupported file format" });
    // }
    if (req.file.mimetype === "text/csv") {
      // Handle CSV
      const parsedData = await csv().fromString(req.file.buffer.toString());
      employeesData = parsedData.filter((emp) =>
        Object.values(emp).some((value) => value && value.trim() !== "")
      );
    } else if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
      req.file.mimetype === "application/vnd.ms-excel" // .xls
    ) {
      // Handle Excel (both .xlsx and .xls)
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = xlsx.utils.sheet_to_json(worksheet);

      employeesData = parsedData.filter((emp) =>
        Object.values(emp).some(
          (value) => value && value.toString().trim() !== ""
        )
      );
    } else {
      // Unsupported format
      return res.status(400).send({ message: "Unsupported file format" });
    }

    if (!employeesData.length) {
      return res
        .status(400)
        .send({ message: "Uploaded file is empty or has invalid data" });
    }

    //  Fetch organization and current employee count
    const orgData = await Organization.findByPk(orgnaizationId, {
      include: [
        {
          model: Employee_Onboarding,
          as: "Employees_data",
          // where: { isDelete: false },
          where: { isDelete: false },
          attributes: ["id"],
        },
        {
          model: PremiumPlans,
          as: "organization_plan",
          attributes: ["employeeLimit"],
        },
      ],
    });

    if (!orgData) {
      return res.status(404).send({ message: "Organization not found" });
    }

    const currentCount = orgData?.Employees_data?.length || 0;
    const employeeLimit = orgData?.organization_plan?.employeeLimit || 0;
    // const newCount = employeesData.length;
    const newCount = employeesData.length;

    const remainingCount = employeeLimit - currentCount;
    console.log(remainingCount, "remainingCount");

    console.log(currentCount, "currentCount");
    console.log(employeeLimit, "employeeeLimit");
    console.log(newCount, "newCount");

    if (currentCount + newCount > employeeLimit) {
      return res.status(400).json({
        message: "Employee limit will be exceeded. Please upgrade your plan.",
        currentCount,
        employeeLimit,
        newCount,
        remainingCount,
      });
    }

    // Add org and team lead IDs
    const employeesWithOrgId = employeesData.map((emp) => ({
      ...emp,
      orgnaizationId: parseInt(orgnaizationId, 10),
      teamLeadId: parseInt(teamLeadId, 10),
    }));

    console.log(employeesWithOrgId, "employeesWithOrgId");

    // Call service
    const response = await employeeService.bulkCreateEmployees(
      employeesWithOrgId
    );

    console.log(response, "employeesDataResponse");
    res.status(200).send({
      message: "Employees uploaded successfully",
      response: response,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res
      .status(500)
      .send({ message: "Error uploading file", error: error.message || error });
  }
};

// const bulkUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "No file uploaded" });
//     }
//     const { orgnaizationId } = req.body; // Ensure we get orgnaizationId
//     const { teamLeadId } = req.body;

//     if (!orgnaizationId) {
//       return res.status(400).send({ message: "Organization ID is required" });
//     }

//     // if (!orgnaizationId) {
//     //   return res.status(500).send({ message: "Organization ID is required" });
//     // }

//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const employeesData = xlsx.utils.sheet_to_json(sheet);

//     if (!employeesData.length) {
//       return res
//         .status(400)
//         .send({ message: "Uploaded file is empty or has invalid data" });
//     }
//     const employeesWithOrgId = employeesData.map((emp) => ({
//       ...emp,
//       orgnaizationId: parseInt(orgnaizationId),
//       teamLeadId: parseInt(teamLeadId),
//     }));
//     console.log(employeesWithOrgId, "employeesWithOrgId");

//     // Pass orgnaizationId to the service function
//     const response = await employeeService.bulkCreateEmployees(
//       employeesWithOrgId
//     );
//     console.log(response, "employeesDataResponse");
//     // console.log(orgnaizationId, "orgnaizationId")
//     res
//       .status(200)
//       .send({ message: "Employees uploaded successfully", response: response });
//   } catch (error) {
//     console.error("Bulk upload error:", error);
//     res
//       .status(500)
//       .send({ message: "Error uploading file", error: error.message || error });
//   }
// };

const createEmployee = async (req, res) => {
  try {
    const payload = await parseRequestFiles(req);
    console.log(payload, "bhjgjj");

    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0]; // Assuming single value per key
    }

    const orgId = req.body.orgnaizationId;
    console.log(orgId, "organizationIddddd");

    const empData = await Organization.findByPk(orgId, {
      include: [
        {
          model: Employee_Onboarding,
          as: "Employees_data",
          where: { isDelete: false },
        },
        {
          model: PremiumPlans,
          as: "organization_plan",
        },
      ],
    });
    console.log(empData, "empDataaaaa");
    const employeesLength = empData?.Employees_data.length || 0;
    const employeesLimit =
      empData?.organization_plan?.dataValues?.employeeLimit; // You can replace with: empData?.organization_plan?.dataValues?.employeeLimit

    console.log(employeesLength, "Current employees");
    console.log(employeesLimit, "Allowed limit");

    if (employeesLength >= employeesLimit) {
      return res
        .status(400)
        .json({ message: "Employees Limit Reached Please Upgrade Plan" });
    }

    // If files exist
    if (payload.files && Object.keys(payload.files).length > 0) {
      req.files = payload.files;
      const employee = await employeeService.createEmployee(
        req.body,
        req.files
      );
      console.log(employee, "employeeeee");
      return res.status(201).json(employee);
    } else {
      const employee = await employeeService.createEmployee(req.body);
      return res.status(201).json(employee);
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error.message === "Employee Already Registered") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// };

const getEmployees = async (req, res) => {
  try {
    // Get the page and limit from the request query parameters, or default to page 1 and limit 20
    // console.log("getemployeeee",req.query.page, req.query.limit);

    // const page = parseInt(req.query.page);
    // const limit = parseInt(req.query.limit);
    // console.log("pagelimit", page, limit);

    // Call the service with the page and limit
    const employees = await employeeService.getEmployees();

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getEmployeeByOrganizationId = async (req, res) => {
//   try {
//     const employeeId = req.params.id;
//     const employee = await employeeService.getEmployeeByOrganizationId(employeeId);
//     if (employee) {
//       res.status(200).json(employee);
//     } else {
//       res.status(404).json({ message: "Employee not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getOnboardemployeesOrganizationWise = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, search = "" } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    // Fetch employee data with pagination
    const employeeData =
      await employeeService.getOnboardemployeesOrganizationWise(
        id,
        pageInt,
        pageSizeInt,
        search
      );

    if (employeeData) {
      res.status(200).json(employeeData); // Send paginated data
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamLeadEmployeesReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, search = "" } = req.query;
    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    // Fetch employee data with pagination
    const employeeData = await employeeService.getTeamLeadEmployeesReport(
      id,
      pageInt,
      pageSizeInt,
      search
    );

    if (employeeData) {
      res.status(200).json(employeeData); // Send paginated data
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamLeadEmployeesPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, year, month, search = "" } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    // const monthInt = parseInt(month, 10);

    // Fetch employee data with pagination
    const employeeData = await employeeService.getTeamLeadEmployeesPerformance(
      id,
      pageInt,
      pageSizeInt,
      yearInt,
      month,
      search
    );

    if (employeeData) {
      res.status(200).json(employeeData); // Send paginated data
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamLeadEmployees = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch employee data with pagination
    const employeeData = await employeeService.getTeamLeadEmployees(id);

    if (employeeData) {
      res.status(200).json(employeeData); // Send paginated data
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch employee data with pagination
    const employeeData = await employeeService.getEmployeeByOrganizationId(id);

    if (employeeData) {
      res.status(200).json(employeeData); // Send paginated data
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeByIdforUpdation = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await employeeService.getEmployeeByIdforUpdation(
      employeeId
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getEmployeeChangeStatus = async (req, res) => {
//   try {
//     const employeeId = req.params.id;
//     const { isDelete, orgnaizationId } = req.body
//     console.log("isDelete", isDelete, "orgnaizationId", orgnaizationId)
//     if (!orgnaizationId) {
//       return res.status(400).json({ message: "Organization ID is required" });
//     }
//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }
//     if (isDelete === undefined) {
//       return res.status(400).json({ message: "isDelete status is required" });
//     }

//     if (isDelete === true) {
//       const empData = await Organization.findByPk(orgnaizationId, {
//         include: [
//           {
//             model: Employee_Onboarding,
//             as: "Employees_data",
//             where: { isDelete: false },
//           },
//           {
//             model: PremiumPlans,
//             as: "organization_plan",
//           },
//         ],
//       });

//       const employeesLength = empData?.Employees_data.length || 0;
//       const employeesLimit = empData?.organization_plan?.dataValues?.employeeLimit; // You can replace with: empData?.organization_plan?.dataValues?.employeeLimit

//       console.log(employeesLength, "Current employees");
//       console.log(employeesLimit, "Allowed limit");

//       if (employeesLength >= employeesLimit) {
//         return res
//           .status(400)
//           .json({ message: "Employees Limit Reached Please Upgrade Plan" });
//       }
//       const employee = await employeeService.updateEmployeeStatus(
//         employeeId, true
//       );
//       if (employee) {
//         res.status(200).json(employee);
//       } else {
//         res.status(404).json({ message: "Employee not found" });
//       }
//     }
//     const employee = await employeeService.updateEmployeeStatus(
//       employeeId, false
//     );
//     if (employee) {
//       res.status(200).json(employee);
//     } else {
//       res.status(404).json({ message: "Employee not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getEmployeeChangeStatus = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { isDelete, orgnaizationId } = req.body;

    if (!orgnaizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    if (isDelete === undefined) {
      return res.status(400).json({ message: "isDelete status is required" });
    }

    if (isDelete === false) {
      const empData = await Organization.findByPk(orgnaizationId, {
        include: [
          {
            model: Employee_Onboarding,
            as: "Employees_data",
            where: { isDelete: false },
          },
          {
            model: PremiumPlans,
            as: "organization_plan",
          },
        ],
      });

      const employeesLength = empData?.Employees_data.length || 0;
      const employeesLimit = empData?.organization_plan?.dataValues?.employeeLimit;
      console.log(employeesLength, "Current employees");
      console.log(employeesLimit, "Allowed limit");
      if (employeesLength >= employeesLimit) {
        return res
          .status(400)
          .json({ message: "Employees Limit Reached Please Upgrade Plan" });
      }

      const employee = await employeeService.updateEmployeeStatus(employeeId, false);
      if (employee) {
        return res.status(200).json(employee); // ✅ return added
      } else {
        return res.status(404).json({ message: "Employee not found" }); // ✅ return added
      }
    }

    // If isDelete === false
    const employee = await employeeService.updateEmployeeStatus(employeeId, true);
    if (employee) {
      return res.status(200).json(employee); // ✅ return added
    } else {
      return res.status(404).json({ message: "Employee not found" }); // ✅ return added
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // ✅ return added
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 0, pageSize = 10, type } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const employee = await employeeService.getEmployeeById(
      employeeId,
      pageInt,
      pageSizeInt,
      type
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeAdvanceSalaryById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 0, pageSize = 10 } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const employee = await employeeService.getEmployeeAdvanceSalaryById(
      employeeId,
      pageInt,
      pageSizeInt
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeePerformanceById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 0, pageSize = 10 } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const employee = await employeeService.getEmployeePerformanceById(
      employeeId,
      pageInt,
      pageSizeInt
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamMembersLeave = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 0, pageSize = 10 } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const employee = await employeeService.getTeamMembersLeave(
      employeeId,
      pageInt,
      pageSizeInt
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeLevaveById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { page = 0, pageSize = 10 } = req.query; // Use query params for pagination

    // Ensure page and pageSize are integers
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const employee = await employeeService.getEmployeeLevaveById(
      employeeId,
      pageInt,
      pageSizeInt
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeLeaveByYear = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { year } = req.query;
    const yearInt = parseInt(year, 10);

    if (!yearInt) {
      return res.status(400).json({ message: "Employee year is required." });
    }

    let whereCondition = {
      id: employeeId,
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("from_date")), // Filtering based on `from_date`
          yearInt
        ),
      ],
    };

    const employeeLeaveData = await LeavesCreation.findAll({
      where: whereCondition,
      attributes: ["to_date", "status", "from_date"],
    });

    res.status(200).json({
      employeeLeave: employeeLeaveData,
      YearlyCount: employeeLeaveData.length, // Fixed `yearlyAttendanceCount`
      message: employeeLeaveData.length
        ? "Attendance records found."
        : "No attendance records for this year.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeWeeklyAttendance = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await employeeService.getEmployeeWeeklyAttendance(
      employeeId
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  console.log(req, "req from frontend");
  try {
    const empId = req.params.id;
    const payload = await parseRequestFiles(req);
    req.body = {};
    for (const [key, value] of Object.entries(payload.fields)) {
      req.body[key] = value[0]; // Assuming single value per key
    }
    req.files = payload.files;
    const { body, files } = req;

    console.log("employeecontroller", body, files, empId);
    const employee = await employeeService.updateEmployee(empId, body, files);
    res.status(201).json(employee);
    console.log("updateemployesssssss");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getEmployeesByOrganizationForChat = async (req, res) => {
  console.log("Params:", req.params); // Should log { id: "1" }
  console.log("Query:", req.query); // Should log { currentUserId: "1" }
  try {
    const { id } = req.params;
    const currentUserId = req.query.currentUserId;
    console.log("currentUserId:", currentUserId); // Should log "1"
    if (!currentUserId) {
      return res.status(400).json({ message: "currentUserId is required" });
    }
    const employeeData =
      await employeeService.getEmployeesByOrganizationForChat(
        id,
        currentUserId
      );
    console.log("Employee Data:", employeeData); // Debug service response
    if (employeeData && employeeData.length > 0) {
      res.status(200).json(employeeData);
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportEmployees = async (req, res) => {
  try {
    const id = req.params.id;
    const employees = await employeeService.exportEmployees(id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Data");

    worksheet.columns = [
      { header: "Id", key: "id", width: 20 },
      { header: "Employee Id", key: "emp_id", width: 20 },
      { header: "Employee Name", key: "emp_name", width: 20 },
      { header: "Calling Name", key: "calling_name", width: 20 },
      { header: "Date of Birth", key: "date_of_birth", width: 20 },
      { header: "Role", key: "role", width: 20 },
      // { header: "Password", key: "password", width: 20 },
      { header: "Date of Joining", key: "date_of_joining", width: 20 },
      // { header: "Email", key: "email", width: 20 },
      { header: "Contact Number", key: "contact_number", width: 20 },
      {
        header: "Emergency Contact Number",
        key: "alternative_number",
        width: 20,
      },
      {
        header: "Father or Husband Name",
        key: "father_or_husband_name",
        width: 20,
      },
      {
        header: "Father or Husband Number",
        key: "father_or_husband_number",
        width: 20,
      },
      { header: "Mother Name", key: "mother_name", width: 20 },
      { header: "Mother Number", key: "mother_number", width: 20 },
      { header: "Permanent Address", key: "permanent_address", width: 20 },
      { header: "Current Address", key: "current_address", width: 20 },
      { header: "City", key: "city", width: 20 },
      { header: "Education", key: "education_qualification", width: 20 },
      { header: "Pan Number", key: "pancard", width: 20 },
      { header: "PF Account Number", key: "pf_account", width: 20 },
      { header: "UAN Number", key: "UAN_Number", width: 20 },
      { header: "Aadhar Number", key: "adharnumber", width: 20 },
      { header: "Bank Name", key: "bank_name", width: 20 },
      { header: "Account Number", key: "bank_account", width: 20 },
      { header: "IFSC Code", key: "IFSC_code", width: 20 },
      { header: "UPI Id", key: "UPI_Id", width: 20 },
      { header: "Religion", key: "Religion", width: 20 },
      // { header: "Other Documents", key: "other_documents", width: 20 },
      // { header: "userName", key: "userName", width: 20 },
      { header: "Position", key: "position", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Gender", key: "gender", width: 20 },
      { header: "Employee Type", key: "employee_type", width: 20 },
      { header: "Status", key: "status", width: 20 },

      { header: "leave Balance", key: "leave_balance", width: 20 },
      { header: "leave Bucket", key: "leave_bucket", width: 20 },
      { header: "work from home", key: "wfh_no_ofdays", width: 20 },
      { header: "Form24Q", key: "Form24Q", width: 20 },
      { header: "Form16", key: "Form16", width: 20 },
      { header: "TDS", key: "TDS", width: 20 },
      { header: "bussiness_email", key: "bussiness_email", width: 20 },
      { header: "personal_email", key: "personal_email", width: 20 },
      { header: "Salary", key: "salary", width: 20 },
      { header: "CTC", key: "gross_CTC", width: 20 },
      { header: "Dearness Allownaces", key: "DNS_allowances", width: 20 },
      { header: "House Rent Allowances", key: "HRA_allowances", width: 20 },
      { header: "Special Allowances", key: "Speciel_allowances", width: 20 },
      { header: "Travel Allowances", key: "travel_allowances", width: 20 },
      { header: "Medical Allowances", key: "medical_allowances", width: 20 },
      { header: "Food Allowances", key: "food_allowances", width: 20 },
      { header: "Variable Allowances", key: "variable_allowances", width: 20 },
      {
        header: "PF Employeer Contribution",
        key: "pf_employeer_contribution",
        width: 20,
      },
      {
        header: "PF Employee Contribution",
        key: "pf_emp_contribution",
        width: 20,
      },
      {
        header: "Employee ESI Contribution",
        key: "emp_ESI_contribution",
        width: 20,
      },
    ];

    // Add rows for each employee
    employees
      .sort((a, b) => a.id - b.id)
      .forEach((employee, id) => {
        worksheet.addRow({
          id: id + 1,
          emp_id: employee.id,
          emp_name: employee.emp_name,
          calling_name: employee.calling_name,
          salary: employee.salary,
          date_of_birth: employee.date_of_birth,
          role: employee.role,
          // password: employee.password,
          date_of_joining: employee.date_of_joining,
          // email: employee.email,
          contact_number: employee.contact_number,
          alternative_number: employee.alternative_number,
          father_or_husband_name: employee.father_or_husband_name,
          father_or_husband_number: employee.father_or_husband_number,
          mother_name: employee.mother_name,
          mother_number: employee.mother_number,
          permanent_address: employee.permanent_address,
          current_address: employee.current_address,
          city: employee.city,
          education_qualification: employee.education_qualification,
          pancard: employee.pancard,
          pf_account: employee.pf_account,
          UAN_Number: employee.UAN_Number,
          adharnumber: employee.adharnumber,
          bank_name: employee.bank_name,
          bank_account: employee.bank_account,
          IFSC_code: employee.IFSC_code,
          UPI_Id: employee.UPI_Id,
          Religion: employee.Religion,
          // other_documents: employee.other_documents,
          // userName: employee.userName,
          position: employee.position,
          gender: employee.gender,
          employee_type: employee.employee_type,
          status: employee.isDelete ? "Inactive" : "Active",

          leave_balance: employee.leave_balance,
          leave_bucket: employee.leave_bucket,
          wfh_no_ofdays: employee.wfh_no_ofdays,
          Form24Q: employee.Form24Q,
          Form16: employee.Form16,
          TDS: employee.TDS,
          bussiness_email: employee.bussiness_email,
          personal_email: employee.personal_email,
          gross_CTC: employee.gross_CTC,
          DNS_allowances: employee.DNS_allowances,
          HRA_allowances: employee.HRA_allowances,
          Speciel_allowances: employee.Speciel_allowances,
          travel_allowances: employee.travel_allowances,
          medical_allowances: employee.medical_allowances,
          food_allowances: employee.food_allowances,
          variable_allowances: employee.variable_allowances,
          pf_employeer_contribution: employee.pf_employeer_contribution,
          pf_emp_contribution: employee.pf_emp_contribution,
          emp_ESI_contribution: employee.emp_ESI_contribution,
        });
      });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="employee_data_${id}.xlsx"`
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateEmployeeProfile = async (req, res) => {
  try {
    const empId = req.params.id;
    const profileData = req.body;
    console.log("Profile update request for Employee ID:", empId);
    console.log("Profile data from frontend:", profileData);

    const updatedEmployee = await employeeService.updateEmployeeProfile(
      empId,
      profileData
    );
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error in updateEmployeeProfile:", error);
    res.status(500).json({ error: error.message });
  }
};
const getEmployeesForDocumentLetters = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeLettersData =
      await employeeService.getEmployeesForDocumentLetters(id);
    if (employeeLettersData) {
      res.status(200).json(employeeLettersData);
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    console.error("Error Fetching employees for letters", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createEmployee,
  bulkUpload,
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
  exportEmployees,
  getEmployeeLeaveByYear,
  updateEmployeeProfile,
  getEmployeesForDocumentLetters,
  getEmployeeChangeStatus
};
