const Salary_Management = require("../models/salaryManagement");
const Emp_Details = require("../models/Emp_onboarding");
const { Op, Sequelize, fn, col, where, literal, cast } = require("sequelize");
const numberToWords = require("number-to-words");
const { parse } = require("dotenv");
const sequelize = require("../../config/database");
const LeavesCreation = require("../models/leavesCreation");
const createSalary = async (data) => {
  try {
    const salary = await Salary_Management.create(data);
    return salary;
  } catch (error) {
    throw error;
  }
};

// const getSalaries = async () => {
//   try {
//     const salaries = await Salary_Management.findAll({
//       include: [
//         {
//           model: Emp_Details,
//           as: "salary_management",
//         },
//       ],
//     });
//     return salaries;
//   } catch (error) {
//     throw error;
//   }
// };

const getSalaries = async (page, limit) => {
  console.log("entering service salaries");
  try {
    const limit = 20; // Number of records per page
    const offset = (page - 1) * limit;
    // Calculate offset
    // const salaries = await Salary_Management.findAll();
    const salaries = await Salary_Management.findAll({
      // limit, // Limit the number of records to 20
      // offset, // Offset for pagination
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
        },
      ],
    });
    return salaries;
  } catch (error) {
    throw error;
  }
};

// const getSalariesByOrganization = async (id, page, pageSize, year, month) => {
//   console.log("Fetching salaries for:", { id, page, pageSize, year, month });

//   try {
//     const offset = page * pageSize;

//     // Build dynamic where condition
//     let whereCondition = { organizationId: id };

//     if (year && month !== undefined) {
//       whereCondition[Op.and] = [
//         Sequelize.where(Sequelize.fn("DATE_PART", "year", Sequelize.col("salary_date")), year),
//         Sequelize.where(Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")), month + 1),
//       ];
//     } else if (year) {
//       whereCondition.salary_date = Sequelize.where(
//         Sequelize.fn("DATE_PART", "year", Sequelize.col("salary_date")),
//         year
//       );
//     } else if (month !== undefined) {
//       whereCondition.salary_date = Sequelize.where(
//         Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")),
//         month + 1
//       );
//     }

//     // Get total count with filters
//     const totalSalaries = await Salary_Management.count({ where: whereCondition });

//     // Fetch filtered salaries with pagination
//     const salaries = await Salary_Management.findAll({
//       where: whereCondition,
//       limit: pageSize,
//       offset: offset,
//       include: [
//         {
//           model: Emp_Details,
//           as: "salary_management",
//         },
//       ],
//     });

//     return { salaries, totalSalaries };
//   } catch (error) {
//     throw error;
//   }
// };

// const getSalariesByOrganization = async (id, page, pageSize, year, month,search) => {
//   console.log("Fetching salaries for:", { id, page, pageSize, year, month });

//   try {
//     const offset = page * pageSize;

//     // Build dynamic where condition
//     let whereCondition = { organizationId: id };

//     if (year && month !== undefined) {
//       whereCondition[Op.and] = [
//         where(fn("DATE_PART", "year", col("salary_date")), year),
//         where(fn("DATE_PART", "month", col("salary_date")), month + 1),
//       ];
//     } else if (year) {
//       whereCondition.salary_date = where(fn("DATE_PART", "year", col("salary_date")), year);
//     } else if (month !== undefined) {
//       whereCondition.salary_date = where(fn("DATE_PART", "month", col("salary_date")), month + 1);
//     }

//     // Get total count with filters
//     const totalSalaries = await Salary_Management.count({
//       where: whereCondition,
//     });

//     // Get total net pay for the filtered month (CAST net_pay as NUMERIC)
//     const totalNetPayResult = await Salary_Management.findOne({
//       attributes: [[fn("SUM", literal("CAST(net_pay AS NUMERIC)")), "totalNetPay"]],
//       where: whereCondition,
//       raw: true, // Returns plain object
//     });

//     const totalNetPay = totalNetPayResult.totalNetPay || 0; // Handle null case

//     // Fetch filtered salaries with pagination
//     const salaries = await Salary_Management.findAll({
//       where: whereCondition,
//       limit: pageSize,
//       offset: offset,
//       order: [["salary_date", "DESC"]], // Sorting by latest salary date
//       include: [
//         {
//           model: Emp_Details,
//           as: "salary_management",
//         },
//       ],
//     });

//     return { salaries, totalSalaries, totalNetPay };
//   } catch (error) {
//     console.error("Error fetching salaries:", error);
//     throw error;
//   }
// };

const getSalariesByOrganization = async (
  id,
  page,
  pageSize,
  year,
  month,
  search
) => {
  console.log("Fetching salaries for:", {
    id,
    page,
    pageSize,
    year,
    month,
    search,
  });

  try {
    const offset = page * pageSize;

    // Build dynamic where condition for Salary_Management
    let whereCondition = { organizationId: id };

    if (year && month !== undefined) {
      whereCondition[Op.and] = [
        where(fn("DATE_PART", "year", col("salary_date")), year),
        where(fn("DATE_PART", "month", col("salary_date")), month + 1),
      ];
    } else if (year) {
      whereCondition.salary_date = where(
        fn("DATE_PART", "year", col("salary_date")),
        year
      );
    } else if (month !== undefined) {
      whereCondition.salary_date = where(
        fn("DATE_PART", "month", col("salary_date")),
        month + 1
      );
    }

    // Define where condition for searching emp_name
    let empWhereCondition = {};
    if (search) {
      empWhereCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Get total count with filters
    const totalSalaries = await Salary_Management.count({
      where: whereCondition,
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
          where: empWhereCondition, // Apply search filter
        },
      ],
    });

    // Get total net pay for the filtered month (Avoid GROUP BY issue)
    const totalNetPayResult = await Salary_Management.findOne({
      attributes: [
        [
          fn("COALESCE", fn("SUM", cast(col("net_pay"), "NUMERIC")), 0),
          "totalNetPay",
        ],
      ],
      where: whereCondition,
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
          attributes: [], // Prevent unnecessary columns that could trigger GROUP BY error
          where: empWhereCondition, // Apply search filter
        },
      ],
      raw: true,
    });

    const totalNetPay = totalNetPayResult?.totalNetPay || 0; // Handle null case

    // Fetch filtered salaries with pagination
    const salaries = await Salary_Management.findAll({
      where: whereCondition,
      limit: pageSize,
      offset: offset,
      order: [["salary_date", "DESC"]],
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
          where: empWhereCondition, // Apply search filter
          // attributes: ["emp_name"], // Fetch only employee name
        },
      ],
    });

    const employesCount = await Emp_Details.count({
      where: { orgnaizationId: id, isDelete: false },
    });

    const approveCount = await Salary_Management.count({
      where: { ...whereCondition, isApproved: true },
    });

    return {
      salaries,
      totalSalaries,
      totalNetPay,
      employesCount,
      approveCount,
    };
  } catch (error) {
    console.error("Error fetching salaries:", error);
    throw error;
  }
};

const getSalariesYearsByOrganization = async (id, year) => {
  try {
    if (!id || id === "null") {
      throw new Error("Invalid organization ID");
    }

    let whereCondition = {
      organizationId: id,
      salary_date: { [Op.ne]: null }, // Exclude null values
    };

    if (year) {
      whereCondition.salary_date = {
        [Op.and]: [
          { [Op.ne]: null }, // Ensure salary_date is not null
          Sequelize.where(
            Sequelize.fn("DATE_PART", "year", Sequelize.col("salary_date")),
            year
          ),
        ],
      };
    }

    // Get total count with filters
    // const totalSalaries = await Salary_Management.count({ where: whereCondition });

    // Fetch the monthly sum of net_pay
    const monthlyNetPay = await Salary_Management.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")),
          "month",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.cast(Sequelize.col("net_pay"), "NUMERIC")
          ),
          "total_net_pay",
        ], // Casting net_pay
      ],
      where: whereCondition,
      group: [Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date"))],
      order: [
        [
          Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")),
          "ASC",
        ],
      ],
      raw: true,
    });

    return monthlyNetPay;
  } catch (error) {
    throw error;
  }
};

const salariesForPreviousMonth = async (id) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 6,
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const salaries = await Salary_Management.findAll({
      attributes: ["salary_date", "net_pay"],
      where: {
        organizationId: id,
        salary_date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      order: [["salary_date", "DESC"]],
    });

    return salaries;
  } catch (error) {
    throw error;
  }
};

// const getSalaryById = async (id) => {
//   try {
//     console.log("iddddd",id);

//     const salary = await Emp_Details.findAll({where:{id:id},
//       include: [
//         {
//           model: Salary_Management,
//           as: "employee_salaries",
//         },
//       ],
//     }
//     );
//     return salary;
//   } catch (error) {
//     throw error;
//   }
// };

const getSalaryByOrgId = async (id) => {
  try {
    const salaries = await Salary_Management.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
        },
      ],
    });
    return salaries;
  } catch (error) {
    throw error;
  }
};

const getSalaryById = async (id) => {
  try {
    const employeeDetails = await Emp_Details.findAll({
      where: { id: id },
      include: [
        {
          model: Salary_Management,
          as: "employee_salaries",
          where: { isApproved: true },
        },
      ],
    });

    if (employeeDetails) {
      // Ensuring employee_salaries is always an array
      employeeDetails.employee_salaries = [employeeDetails.employee_salaries];
      return employeeDetails;
    } else {
      return {}; // return empty object if no employee found
    }
  } catch (error) {
    throw error;
  }
};

const getEmployeesWithoutSalaries = async (id, date) => {
  // Extract year and month from the date
  if (!date || !/^\d{4}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Expected format: YYYY-MM");
  }

  const [selectedYear, selectedMonth] = date.split("-");

  // Construct start and end dates properly
  const startDate = new Date(`${selectedYear}-${selectedMonth}-01T00:00:00Z`);
  const endDate = new Date(`${selectedYear}-${selectedMonth}-31T23:59:59Z`); // Fix: Ensure last day is included

  try {
    const employees = await Emp_Details.findAll({
      where: { orgnaizationId: id },
      include: [
        {
          model: Salary_Management,
          as: "employee_salaries",
          required: false,
          where: {
            salary_date: { [Op.gte]: startDate, [Op.lte]: endDate },
          },
        },
      ],
    });

    // Filtering employees who do NOT have a salary for the selected month
    const employeesWithoutSalary = employees
      .filter(
        (emp) =>
          (!emp.employee_salaries || emp.employee_salaries.length === 0) &&
          emp.employee_type === "Permanent" &&
          emp.isDelete !== true
      )
      .map((emp) => emp); // Return only names
    return employeesWithoutSalary; // Return only names
  } catch (error) {
    console.error("Error fetching employees without salaries:", error);
    throw error;
  }
};

const updateSalary = async (id, data) => {
  console.log(data, "dayuaigdsz");
  try {
    const salary = await Salary_Management.update(data, {
      where: { id: id },
    });
    console.log(salary, "salaryyyyyyyyyyyyyyyyybhdbjx");

    return salary;
  } catch (error) {
    throw error;
  }
};

const deleteSalary = async (id) => {
  try {
    await Salary_Management.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

const exportSalaries = async (id, year, month) => {
  try {
    // Build dynamic where condition for Salary_Management
    let whereCondition = { organizationId: id };

    if (year && month !== undefined) {
      whereCondition[Op.and] = [
        where(fn("DATE_PART", "year", col("salary_date")), year),
        where(fn("DATE_PART", "month", col("salary_date")), month + 1),
      ];
    } else if (year) {
      whereCondition.salary_date = where(
        fn("DATE_PART", "year", col("salary_date")),
        year
      );
    } else if (month !== undefined) {
      whereCondition.salary_date = where(
        fn("DATE_PART", "month", col("salary_date")),
        month + 1
      );
    }

    // Fetch filtered salaries with pagination
    const salaries = await Salary_Management.findAll({
      where: whereCondition,
      order: [["salary_date", "DESC"]],
      include: [
        {
          model: Emp_Details,
          as: "salary_management",
        },
      ],
    });

    return salaries;
  } catch (error) {
    console.error("Error fetching salaries:", error);
    throw error;
  }
};

// const createAllSalaries = async (data) => {
//   try {

//     console.log("createAllSalaries service called with data:", data);
//     const employeeDetails = await Emp_Details.findAll({
//       where: { orgnaizationId: data.organizationId, isDelete: false },
//     });

//     const mappedData = employeeDetails.map((employee) => {

//       const grossPay =
//         (employee.employee_type === "Permanent" ? Number(employee.salary) : Number(employee.stipend)) +
//         Number(employee.DNS_allowances) +
//         Number(employee.HRA_allowances) +
//         Number(employee.travel_allowances) +
//         Number(employee.medical_allowances) +
//         Number(employee.special_allowance) +
//         Number(employee.pf_employeer_contribution);

//       const grossDeduction =
//         Number(employee.pf_employeer_contribution) +
//         Number(employee.pf_emp_contribution) +
//         Number(employee.emp_ESI_contribution) +
//         Number(employee.variable_allowances) +
//         Number(employee.food_allowances);

//       const netPay = grossPay - grossDeduction;
//       const amountInWords = numberToWords.toWords(netPay);
//       return {
//         working_days: 0,
//         // house_rent_allowance: 0,
//         // convaynce_allowance: 0,
//         // perfomance_incentives: 0,
//         // insentives: 0,
//         special_allowance: employee.special_allowance,
//         // gratuity: 0,
//         profetional_tax: 0,
//         // income_tax: 0,
//         net_pay: netPay,
//         amount_in_words: amountInWords,
//         loss_of_pay: 0,
//         other_deductions: 0,
//         gross_pay: grossPay,
//         gross_deduction: grossDeduction,
//         empOnboardingId: employee.id,
//         salary_date: data.salary_date,
//         // pf_amount: 0,
//         monthly_lop: null,
//         leaves: null,
//         leave_balance: null,
//         basic: employee.employee_type === "Permanent" ? employee.salary : employee.stipend,
//         DNS_allowances: employee.DNS_allowances,
//         HRA_allowances: employee.HRA_allowances,
//         travel_allowances: employee.travel_allowances,
//         medical_allowances: employee.medical_allowances,
//         food_allowances: employee.food_allowances,
//         variable_allowances: employee.variable_allowances,
//         pf_employeer_contribution: employee.pf_employeer_contribution,
//         pf_emp_contribution: employee.pf_emp_contribution,
//         emp_ESI_contribution: employee.emp_ESI_contribution,
//         organizationId: data.organizationId,
//       };
//     });

//     const salary = await Salary_Management.bulkCreate(mappedData);

//     // const salary = await Salary_Management.bulkCreate(data, {
//     //   updateOnDuplicate: ["net_pay", "salary_date"],
//     // });
//     return salary;
//   } catch (error) {
//     throw error;
//   }
// }

// const createAllSalaries = async (data) => {
//   try {
//     console.log("createAllSalaries service called with data:", data);

//     const employeeDetails = await Emp_Details.findAll({
//       where: { orgnaizationId: data.organizationId, isDelete: false },
//     });

//     if (!employeeDetails.length) {
//       throw new Error("No employees found for the given organization.");
//     }

//     const mappedData = employeeDetails.map((employee) => {
//       console.log("Processing employee:", employee);

//       const grossPay =
//         (employee.employee_type === "Permanent" ? Number(employee.salary) || 0 : Number(employee.stipend) || 0) +
//         (Number(employee.DNS_allowances) || 0) +
//         (Number(employee.HRA_allowances) || 0) +
//         (Number(employee.travel_allowances) || 0) +
//         (Number(employee.medical_allowances) || 0) +
//         (Number(employee.special_allowance) || 0) +
//         (Number(employee.pf_employeer_contribution) || 0);

//       const grossDeduction =
//         (Number(employee.pf_employeer_contribution) || 0) +
//         (Number(employee.pf_emp_contribution) || 0) +
//         (Number(employee.emp_ESI_contribution) || 0) +
//         (Number(employee.variable_allowances) || 0) +
//         (Number(employee.food_allowances) || 0);

//       const netPay = grossPay - grossDeduction;
//       const amountInWords = Number.isFinite(netPay) ? numberToWords.toWords(netPay) : "Zero";

//       return {
//         working_days: 0,
//         special_allowance: employee.special_allowance || 0,
//         profetional_tax: 0,
//         net_pay: netPay,
//         amount_in_words: amountInWords,
//         loss_of_pay: 0,
//         other_deductions: 0,
//         gross_pay: grossPay,
//         gross_deduction: grossDeduction,
//         empOnboardingId: employee.id,
//         salary_date: data.salary_date,
//         monthly_lop: null,
//         leaves: null,
//         leave_balance: null,
//         basic: employee.employee_type === "Permanent" ? employee.salary || 0 : employee.stipend || 0,
//         DNS_allowances: employee.DNS_allowances || 0,
//         HRA_allowances: employee.HRA_allowances || 0,
//         travel_allowances: employee.travel_allowances || 0,
//         medical_allowances: employee.medical_allowances || 0,
//         food_allowances: employee.food_allowances || 0,
//         variable_allowances: employee.variable_allowances || 0,
//         pf_employeer_contribution: employee.pf_employeer_contribution || 0,
//         pf_emp_contribution: employee.pf_emp_contribution || 0,
//         emp_ESI_contribution: employee.emp_ESI_contribution || 0,
//         organizationId: data.organizationId,
//       };
//     });

//     const salary = await Salary_Management.bulkCreate(mappedData);
//     return salary;
//   } catch (error) {
//     console.error("Error in createAllSalaries:", error);
//     throw error;
//   }
// };

const createAllSalaries = async (data) => {
  try {
    const salaryDate = new Date(data.salary_date);
    const selectedYear = salaryDate.getFullYear();
    const selectedMonth = salaryDate.getMonth(); // 0-indexed

    const totalDaysInMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();

    const existingSalaries = await Salary_Management.findAll({
      where: {
        organizationId: data.organizationId,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM salary_date")),
            selectedYear
          ),
          Sequelize.where(
            Sequelize.fn(
              "EXTRACT",
              Sequelize.literal("MONTH FROM salary_date")
            ),
            selectedMonth + 1
          ),
        ],
      },
      attributes: ["empOnboardingId"],
    });

    const existingEmployeeIds = existingSalaries.map(
      (salary) => salary.empOnboardingId
    );

    const employeeDetails = await Emp_Details.findAll({
      where: {
        orgnaizationId: data.organizationId,
        isDelete: false,
        id: { [Op.notIn]: existingEmployeeIds },
      },
      include: [
        {
          model: LeavesCreation,
          as: "Employee_LeaveCreation",
        },
      ],
    });

    if (!employeeDetails.length) {
      return { message: "All employees already have a salary for this month." };
    }

    const mappedData = employeeDetails.map((employee) => {
      const stipend = parseFloat(Number(employee.stipend).toFixed(2)) || 0;
      const basic = parseFloat((Number(employee.salary) / 12).toFixed(2)) || 0;
      const special_allowance =
        parseFloat((Number(employee.Speciel_allowances) / 12).toFixed(2)) || 0;
      const HRA_allowances =
        parseFloat((Number(employee.HRA_allowances) / 12).toFixed(2)) || 0;
      const travel_allowances =
        parseFloat((Number(employee.travel_allowances) / 12).toFixed(2)) || 0;
      const medical_allowances =
        parseFloat((Number(employee.medical_allowances) / 12).toFixed(2)) || 0;
      const pf_employeer_contribution =
        parseFloat(
          (Number(employee.pf_employeer_contribution) / 12).toFixed(2)
        ) || 0;
      const food_allowances =
        parseFloat((Number(employee.food_allowances) / 12).toFixed(2)) || 0;
      const emp_ESI_contribution =
        parseFloat((Number(employee.emp_ESI_contribution) / 12).toFixed(2)) ||
        0;
      const pf_emp_contribution =
        parseFloat((Number(employee.pf_emp_contribution) / 12).toFixed(2)) || 0;

      const leaveData = employee.Employee_LeaveCreation || [];

      // ----- LOP Count -----
      let lopCount = 0;
      leaveData.forEach((leave) => {
        if (Array.isArray(leave.lop_days)) {
          leave.lop_days.forEach((dateStr) => {
            const date = new Date(dateStr);
            if (
              date.getMonth() === selectedMonth &&
              date.getFullYear() === selectedYear
            ) {
              lopCount++;
            }
          });
        }
      });

      // ----- Approved Leave Count -----
      let totalLeaves = 0;
      leaveData.forEach((leave) => {
        if (leave.status === "Approved" && leave.from_date && leave.to_date) {
          const fromDate = new Date(leave.from_date);
          const toDate = new Date(leave.to_date);

          for (
            let d = new Date(fromDate);
            d <= toDate;
            d.setDate(d.getDate() + 1)
          ) {
            const loopDate = new Date(d);
            if (
              loopDate.getMonth() === selectedMonth &&
              loopDate.getFullYear() === selectedYear
            ) {
              totalLeaves += 1;
            }
          }
        }
      });

      const workingDays = totalDaysInMonth - totalLeaves;

      const grossPay = (
        (employee.employee_type === "Permanent" ? basic : stipend) +
        HRA_allowances +
        travel_allowances +
        medical_allowances +
        special_allowance +
        pf_employeer_contribution
      ).toFixed(2);

      const grossDeduction = (
        pf_employeer_contribution +
        pf_emp_contribution +
        emp_ESI_contribution +
        food_allowances
      ).toFixed(2);

      const netPay = Number((grossPay - grossDeduction).toFixed(2));
      const amountInWords = Number.isFinite(netPay)
        ? numberToWords.toWords(netPay)
        : "Zero";

      return {
        working_days: workingDays,
        special_allowance: special_allowance,
        profetional_tax: 0,
        net_pay: netPay,
        amount_in_words: amountInWords,
        loss_of_pay: 0,
        gross_pay: grossPay,
        gross_deduction: grossDeduction,
        empOnboardingId: employee.id,
        salary_date: data.salary_date,
        monthly_lop: lopCount,
        leaves: totalLeaves,
        leave_balance: 0,
        basic: employee.employee_type === "Permanent" ? basic : stipend,
        HRA_allowances: HRA_allowances,
        travel_allowances: travel_allowances,
        medical_allowances: medical_allowances,
        food_allowances: food_allowances,
        pf_employeer_contribution: pf_employeer_contribution,
        pf_emp_contribution: pf_emp_contribution,
        emp_ESI_contribution: emp_ESI_contribution,
        system_Allowance: 0,
        insurance: 0,
        organizationId: data.organizationId,
      };
    });

    const salary = await Salary_Management.bulkCreate(mappedData);
    return { message: "Salaries created successfully.", salary };
  } catch (error) {
    console.error("Error in createAllSalaries:", error);
    throw error;
  }
};

// const createAllSalaries = async (data) => {
//   try {
//     console.log("createAllSalaries service called with data:", data);

//     const salaryDate = new Date(data.salary_date); // Convert string to Date

//     const existingSalaries = await Salary_Management.findAll({
//       where: {
//         organizationId: data.organizationId,
//         [Op.and]: [
//           Sequelize.where(Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM salary_date")), salaryDate.getFullYear()),
//           Sequelize.where(Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM salary_date")), salaryDate.getMonth() + 1)
//         ],
//       },
//       attributes: ["empOnboardingId"], // Fetch only employee IDs
//     });

//     const existingEmployeeIds = existingSalaries.map((salary) => salary.empOnboardingId);
//     console.log("Existing salary records for employees:", existingEmployeeIds);

//     // Fetch all employees of the organization who don't have a salary created
//     const employeeDetails = await Emp_Details.findAll({
//       where: {
//         orgnaizationId: data.organizationId,
//         isDelete: false,
//         id: { [Op.notIn]: existingEmployeeIds }, // Exclude employees who already have a salary
//       },
//     });

//     if (!employeeDetails.length) {
//       return { message: "All employees already have a salary for this month." };
//     }

//     const mappedData = employeeDetails.map((employee) => {
//       console.log("Creating salary for employee:", employee.id);
//       const stipend = parseFloat(Number(employee.stipend).toFixed(2)) || 0;
//       const basic = parseFloat((Number(employee.salary) / 12).toFixed(2)) || 0;
//       const special_allowance = parseFloat((Number(employee.Speciel_allowances) / 12).toFixed(2)) || 0;
//       const HRA_allowances = parseFloat((Number(employee.HRA_allowances) / 12).toFixed(2)) || 0
//       const travel_allowances = parseFloat((Number(employee.travel_allowances) / 12).toFixed(2)) || 0
//       const medical_allowances = parseFloat((Number(employee.medical_allowances) / 12).toFixed(2)) || 0
//       const pf_employeer_contribution = parseFloat((Number(employee.pf_employeer_contribution) / 12).toFixed(2)) || 0

//       const food_allowances = parseFloat((Number(employee.food_allowances) / 12).toFixed(2)) || 0
//       const emp_ESI_contribution = parseFloat((Number(employee.emp_ESI_contribution) / 12).toFixed(2)) || 0
//       const pf_emp_contribution = parseFloat((Number(employee.pf_emp_contribution) / 12).toFixed(2)) || 0

//       const grossPay = (
//         (employee.employee_type === "Permanent" ? basic : stipend) +
//         // (Number(employee.DNS_allowances) || 0) +
//         HRA_allowances +
//         travel_allowances +
//         medical_allowances +
//         special_allowance +
//         pf_employeer_contribution).toFixed(2) || 0;

//       const grossDeduction = (
//         pf_employeer_contribution +
//         pf_emp_contribution +
//         emp_ESI_contribution +
//         food_allowances).toFixed(2) || 0;

//       const netPay = Number((grossPay - grossDeduction).toFixed(2)); // Convert back to number
//       const amountInWords = Number.isFinite(netPay) ? numberToWords.toWords(netPay) : "Zero";

//       return {
//         working_days: 0,
//         special_allowance: special_allowance,
//         profetional_tax: 0,
//         net_pay: netPay,
//         amount_in_words: amountInWords,
//         loss_of_pay: 0,
//         // other_deductions: 0,
//         gross_pay: grossPay,
//         gross_deduction: grossDeduction,
//         empOnboardingId: employee.id,
//         salary_date: data.salary_date,
//         monthly_lop: 0,
//         leaves: 0,
//         leave_balance: 0,
//         basic: employee.employee_type === "Permanent" ? basic : stipend,
//         // DNS_allowances: 0,
//         HRA_allowances: HRA_allowances,
//         travel_allowances: travel_allowances,
//         medical_allowances: medical_allowances,
//         food_allowances: food_allowances,
//         // variable_allowances: ,
//         pf_employeer_contribution: pf_employeer_contribution,
//         pf_emp_contribution: pf_emp_contribution,
//         emp_ESI_contribution: emp_ESI_contribution,
//         system_Allowance: 0,
//         insurance: 0,
//         organizationId: data.organizationId,
//       };
//     });

//     // Bulk create salaries for remaining employees
//     const salary = await Salary_Management.bulkCreate(mappedData);
//     console.log("Salaries created successfully for remaining employees.");
//     return { message: "Salaries created successfully.", salary };
//   } catch (error) {
//     console.error("Error in createAllSalaries:", error);
//     throw error;
//   }
// };

const approveAllSalaries = async (id, year, month) => {
  try {
    console.log("Approving all salaries for:", { id, year, month });
    const whereCondition = {
      organizationId: id,
      isApproved: false, // Ensuring we only update pending salaries
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("salary_date")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")),
          month + 1
        ),
      ],
    };
    const approvedCount = await Salary_Management.update(
      { isApproved: true },
      {
        where: whereCondition,
        returning: true, // Return the updated records
      }
    );
    console.log(approvedCount, "approvedCount");
    if (approvedCount[0] === 0) {
      return { message: "No pending salaries found for approval." };
    }

    return {
      message: "Salaries approved successfully.",
      updatedRecords: approvedCount[0],
    };
  } catch (error) {
    console.error("Error approving salaries:", error);
    throw error;
  }
};

const approveSalary = async (id, data) => {
  try {
    const salary = await Salary_Management.update(
      { isApproved: data.isApproved },
      { where: { id: id } }
    );
    return salary;
  } catch (error) {
    throw error;
  }
};

const deleteAllSalary = async (id, year, month) => {
  try {
    // Define the where condition correctly
    const whereCondition = {
      organizationId: id,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE_PART", "year", Sequelize.col("salary_date")),
          year
        ),
        Sequelize.where(
          Sequelize.fn("DATE_PART", "month", Sequelize.col("salary_date")),
          month + 1
        ),
      ],
    };

    // Delete all salaries for the given month and organization
    const deletedCount = await Salary_Management.destroy({
      where: whereCondition,
    });

    if (deletedCount === 0) {
      return { message: "No salaries found for deletion." };
    }

    return {
      message: "Salaries deleted successfully.",
      deletedRecords: deletedCount,
    };
  } catch (error) {
    console.error("Error deleting salaries:", error);
    throw error;
  }
};

const deleteSalaryById = async (id) => {
  console.log("Deleting salary with ID:", id);
  try {
    const salary = await Salary_Management.destroy({ where: { id: id } });
    return salary;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSalary,
  getSalaries,
  getSalaryByOrgId,
  getSalaryById,
  updateSalary,
  deleteSalary,
  getSalariesByOrganization,
  getEmployeesWithoutSalaries,
  getSalariesYearsByOrganization,
  salariesForPreviousMonth,
  exportSalaries,
  createAllSalaries,
  approveAllSalaries,
  approveSalary,
  deleteAllSalary,
  deleteSalaryById,
};
