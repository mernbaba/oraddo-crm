const { header } = require("express-validator");
const salaryManagementService = require("../services/salaryManagement");
const ExcelJS = require("exceljs");

const createSalary = async (req, res) => {
  console.log(req.body);
  try {
    const salary = await salaryManagementService.createSalary(req.body);
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaries = async (req, res) => {
  console.log("entering getcall");
  try {
    const page = req.query.page;
    const limit = req.params.limit;
    const salaries = await salaryManagementService.getSalaries();
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalariesByOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, pageSize = 10, year, month, search = "" } = req.query;

    // Ensure numeric values
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Call service function with filters
    const salaryData = await salaryManagementService.getSalariesByOrganization(
      id,
      pageInt,
      pageSizeInt,
      yearInt,
      monthInt,
      search
    );

    if (salaryData) {
      res.status(200).json(salaryData);
    } else {
      res.status(404).json({ message: "Salary records not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalariesYearsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;

    // Ensure numeric values
    // const pageInt = parseInt(page, 10);
    // const pageSizeInt = parseInt(pageSize, 10);
    const yearInt = parseInt(year, 10);
    // const monthInt = parseInt(month, 10);

    // Call service function with filters
    const salaryData = await salaryManagementService.getSalariesYearsByOrganization(
      id,
      // pageInt,
      // pageSizeInt,
      yearInt,
      // monthInt
    );

    if (salaryData) {
      res.status(200).json(salaryData);
    } else {
      res.status(404).json({ message: "Salary records not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const salariesForPreviousMonth = async (req, res) => {
  try {
    const { id } = req.params
    const salaryData = await salaryManagementService.salariesForPreviousMonth(id)
    if (salaryData) {
      res.status(200).json(salaryData);
    } else {
      res.status(404).json({ message: "Salary records not found" });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSalaryById = async (req, res) => {
  try {
    const salary = await salaryManagementService.getSalaryById(req.params.id);
    if (salary) {
      res.status(200).json(salary);
    } else {
      res.status(404).json({ message: "Salary record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalariesByEmployee = async (req, res) => {
  try {
    const salaries = await salaryManagementService.getSalariesByEmployee(
      req.params.empId
    );
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeesWithoutSalaries = async (req, res) => {
  console.log("getEmployeesWithoutSalaries controller called...", req);
  const { id, date } = req.params;
  console.log(id, date, "ID and Date received in controller");

  try {
    console.log("Before calling service");
    const salary = await salaryManagementService.getEmployeesWithoutSalaries(
      id,
      date
    );
    console.log("After calling service");

    if (salary) {
      res.status(200).json(salary);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error in getEmployeesWithoutSalaries:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateSalary = async (req, res) => {
  try {
    const salary = await salaryManagementService.updateSalary(
      req.params.id,
      req.body
    );
    console.log(salary, "sakaryyyyyyyyyy");
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSalary = async (req, res) => {
  try {
    await salaryManagementService.deleteSalary(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportSalaries = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Call service function with filters
    const salaryData = await salaryManagementService.exportSalaries(
      id,
      yearInt,
      monthInt,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("salary Data");

    worksheet.columns = [
      { header: "Id", key: "id", width: 10 },
      { header: "Employee Id", key: "emp_id", width: 20 },
      { header: "Employee Name", key: "emp_name", width: 32 },
      { header: "Position", key: "position", width: 15 },
      { header: "Department", key: "department", width: 15 },
      { header: "Bank Name", key: "bank_name", width: 15 },
      { header: "Account Number", key: "bank_account", width: 15 },
      { header: "IFSC Code", key: "IFSC_code", width: 15 },
      { header: "PAN Number", key: "pancard", width: 15 },
      { header: "Salary Date", key: "salary_date", width: 15 },
      { header: "Working Days", key: "working_days", width: 15 },

      { header: "Leaves", key: "leaves", width: 15 },
      { header: "Leave Balance", key: "leave_balance", width: 15 },

      { header: "Monthly Lop", key: "monthly_lop", width: 15 },

      { header: "Basic", key: "basic", width: 15 },
      { header: "Special Allowance", key: "special_allowance", width: 15 },
      { header: "Houserent Allowance", key: "HRA_allowances", width: 15 },
      { header: "Travel Allowance", key: "travel_allowances", width: 15 },
      { header: "PF Employer Contribution", key: "pf_employeer_contribution", width: 15 },
      { header: "Medical Allowance", key: "medical_allowances", width: 15 },


      { header: "Profetional Tax", key: "profetional_tax", width: 15 },
      { header: "Food Allowance", key: "food_allowances", width: 15 },
      { header: "Insurance", key: "insurance", width: 15 },
      { header: "PF Employee Contribution", key: "pf_emp_contribution", width: 15 },
      { header: "System Allowance", key: "system_Allowance", width: 15 },
      { header: "ESI Contribution", key: "emp_ESI_contribution", width: 15 },
      { header: "Loss of pay & Other Deductions", key: "loss_of_pay", width: 15 },

      { header: "Gross Pay", key: "gross_pay", width: 15 },
      { header: "Gross Deduction", key: "gross_deduction", width: 15 },

      { header: "Net pay", key: "net_pay", width: 15 },
      // { header: "Amount in Words", key: "amount_in_words", width: 15 },
    ];

    salaryData.forEach((salary, index) => {
      worksheet.addRow({
        id: index + 1,
        emp_id: salary.salary_management?.id || "",
        emp_name: salary.salary_management?.emp_name || "",
        position: salary.salary_management?.position || "",
        department: salary.salary_management?.department || "",
        bank_name: salary.salary_management?.bank_name || "",
        bank_account: salary.salary_management?.bank_account || "",
        IFSC_code: salary.salary_management?.IFSC_code || "",
        pancard: salary.salary_management?.pancard || "",
        salary_date: salary.salary_date || "",
        working_days: salary.working_days || 0,
        leaves: salary.leaves || 0,
        leave_balance: salary.leave_balance || 0,
        monthly_lop: salary.monthly_lop || 0,
        basic: salary.basic || 0,
        special_allowance: salary.special_allowance || 0,
        house_rent_allowance: salary.HRA_allowances || 0,
        travel_allowances: salary.travel_allowances || 0,
        pf_employer_contribution: salary.pf_employeer_contribution || 0,
        medical_allowances: salary.medical_allowances || 0,
        profetional_tax: salary.profetional_tax || 0,
        food_allowances: salary.food_allowances || 0,
        insurance: salary.insurance || 0,
        pf_emp_contribution: salary.pf_emp_contribution || 0,
        system_allowance: salary.system_Allowance || 0,
        emp_ESI_contribution: salary.emp_ESI_contribution || 0,
        loss_of_pay: salary.loss_of_pay || 0,
        gross_pay: salary.gross_pay || 0,
        gross_deduction: salary.gross_deduction || 0,
        net_pay: salary.net_pay || 0,
        // amount_in_words: salary.amount_in_words || "",
      });
    });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="salary_data_${id}.xlsx"`
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createAllSalaries = async (req, res) => {
  try {
    const salary = await salaryManagementService.createAllSalaries(req.body);
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveAllSalaries = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;
    console.log(year, month, "year and month in approveAllSalaries")
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);
    const salary = await salaryManagementService.approveAllSalaries(id, yearInt, monthInt);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const approveSalary = async (req, res) => {
  try {
    const id = req.params.id;
    const salary = await salaryManagementService.approveSalary(id, req.body);
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllSalary = async (req, res) => {
  try {
    const id = req.params.id;
    const { year, month } = req.query;
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);
    const salary = await salaryManagementService.deleteAllSalary(id, yearInt, monthInt);
    console.log(salary, "salaryyyyyyyyyyyyyyyyyyyyyyy")
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteSalaryById = async (req, res) => {
  try {
    const salary = await salaryManagementService.deleteSalaryById(req.params.id);
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  createSalary,
  getSalaries,
  // getSalariesByOrgId,
  getSalaryById,
  getSalariesByEmployee,
  updateSalary,
  deleteSalary,
  getSalariesByOrganization,
  getEmployeesWithoutSalaries,
  getSalariesYearsByOrganization,
  salariesForPreviousMonth,
  exportSalaries,
  createAllSalaries,
  approveSalary,
  approveAllSalaries,
  deleteAllSalary,
  deleteSalaryById,
};
