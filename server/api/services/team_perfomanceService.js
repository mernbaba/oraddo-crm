const { where, Op, Sequelize } = require('sequelize');
const team_perfomance = require('../models/team_performance');
const Emp_onboarding = require('../models/Emp_onboarding');
const Department = require("../models/Department");

// const createTeamPerformance = async (data) => {
//   try {
//     console.log("daaattttuuuuu", data);
//     // Extract the month and year from the current date
//     const currentDate = new Date();
//     // Get the first day of the current month and the last day of the current month
//     const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month


//     // Extract the employee IDs from the data
//     const employeeId = data.empOnboardingId;

//     // Check if a performance record already exists for this month
//     const existingPerformance = await team_perfomance.findOne({
//       where: {
//         empOnboardingId: employeeId,
//         createdAt: {
//           [Op.between]: [startOfMonth, endOfMonth], // Find records created in the current month
//         },
//       },
//     });

//     // If a record exists, throw an error or return a message
//     if (existingPerformance) {
//       throw new Error(`Performance record for ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()} already exists.`);
//     }
//     const performance = await team_perfomance.create(data);
//     return performance;
//   } catch (error) {
//     throw error;
//   }
// };


const createTeamPerformance = async (data) => {
  try {
    console.log("Received Data:", data);

    // Extract the date and employee ID from the frontend data
    const { date, empOnboardingId } = data;

    if (!date || !empOnboardingId) {
      throw new Error("Missing required data: selectedDate or empOnboardingId");
    }

    // Split the date string (assuming format is YY-MM-DD)
    const [year, month, day] = date.split("-").map(Number);

    if (isNaN(day) || isNaN(year) || isNaN(month)) {
      throw new Error("Invalid date format. Expected format: DD-YY-MM");
    }

    // Convert YY to full year (assuming it's 2000+)
    const fullYear = year;

    // Get the first and last date of the selected month
    const startOfMonth = new Date(Date.UTC(fullYear, month - 1, 1, 0, 0, 0)); // 1st day of month at 00:00 UTC
    const endOfMonth = new Date(Date.UTC(fullYear, month, 0, 23, 59, 59));

    console.log(`Checking for records between ${startOfMonth} and ${endOfMonth}`);

    // Check if a performance record already exists for this month
    const existingPerformance = await team_perfomance.findOne({
      where: {
        empOnboardingId,
        date: {
          [Op.between]: [startOfMonth, endOfMonth], // Check records in the selected month
        },
      },
    });

    // If a record exists, throw an error
    if (existingPerformance) {
      throw new Error(`Performance record for ${fullYear}-${month.toString().padStart(2, "0")} already exists.`);
    }

    // Create new performance record
    const performance = await team_perfomance.create(data);
    return performance;

  } catch (error) {
    throw error;
  }
};



const getTeamPerformances = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const performances = await team_perfomance.findAll(
      // limit, offset,
      {
        include: [
          {
            model: Emp_onboarding,
            as: 'teamPerformance',
            // include:[
            //   {
            //     model:Department,
            //     as:"departentsOfEmp"
            //   }
            // ]


          },
          // {
          //   model:Department,
          //   as:'employeedepartment'
          // }
        ]
      }
    );
    return performances;
  } catch (error) {
    throw error;
  }
};

const getMonthNumber = (monthName) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.indexOf(monthName) + 1; // Months are 1-based in SQL
};

const getTeamPerformancesByOrganizationId = async (id, page, pageSize, year, monthName, search) => {
  console.log("Fetching performance for:", { id, page, pageSize, year, monthName });
  try {

    const offset = page * pageSize;

    // Convert short month name (e.g., "Jan") to numeric month (e.g., 1)
    const month = parseInt(getMonthNumber(monthName), 10);

    // Build dynamic where condition
    let whereCondition = { organizationId: id };

    if (year && month !== undefined) {
      whereCondition[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE_PART", "year", Sequelize.col("date")), year),
        Sequelize.where(Sequelize.fn("DATE_PART", "month", Sequelize.col("date")), month),
      ];
    } else if (year) {
      whereCondition.date = Sequelize.where(
        Sequelize.fn("DATE_PART", "year", Sequelize.col("date")),
        year
      );
    } else if (month !== undefined) {
      whereCondition.date = Sequelize.where(
        Sequelize.fn("DATE_PART", "month", Sequelize.col("date")),
        month
      );
    }

    let empWhereCondition = {};
    if (search) {
      empWhereCondition.emp_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // Get total count with filters
    const totalPerformance = await team_perfomance.count({
      where: whereCondition,
      include: [
        {
          model: Emp_onboarding,
          as: 'teamPerformance',
          where: empWhereCondition,
        },
      ]
    });


    // const offset = (page-1)*limit;
    const performances = await team_perfomance.findAll(
      {
        where: whereCondition,
        limit: pageSize,
        offset: offset,
        include: [
          {
            model: Emp_onboarding,
            as: 'teamPerformance',
            where: empWhereCondition,
            // include:[
            //   {
            //     model:Department,
            //     as:"departentsOfEmp"
            //   }
            // ]


          },
          // {
          //   model:Department,
          //   as:'employeedepartment'
          // }
        ]
      }
    );
    return { performances, totalPerformance };
  } catch (error) {
    throw error;
  }
};

const getTeamPerformanceById = async (id) => {
  try {
    const teamLead = await Emp_onboarding.findOne(
      { where: { emp_id: id } },
      {
        include: [
          {
            model: Emp_onboarding,
            as: "teamPerformance",
          },
        ],
      }
    );

    if (!teamLead) {
      throw new Error("Team lead not found");
    }

    return teamLead;
  } catch (error) {
    throw error;
  }
};
const updateTeamPerformance = async (id, data) => {
  console.log(id, "idddddddddddd")
  try {
    const performance = await team_perfomance.update(data, {
      where: { id: id },
    });
    return performance;
  } catch (error) {
    throw error;
  }
};

const deleteTeamPerformance = async (id) => {
  try {
    await team_perfomance.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};


// const getEmployeesWithoutPerformance = async (id, selectedYear, selectedMonth) => {

//   // // Extract year and month from the date
//   // if (!date || !/^\d{4}-\d{2}$/.test(date)) {
//   //   throw new Error("Invalid date format. Expected format: YYYY-MM");
//   // }

//   // const [selectedYear, selectedMonth] = date.split("-");

//   // Construct start and end dates properly
//   const startDate = new Date(`${selectedYear}-${selectedMonth}-01T00:00:00Z`);
//   const endDate = new Date(`${selectedYear}-${selectedMonth}-31T23:59:59Z`); // Fix: Ensure last day is included

//   try {
//     const employees = await Emp_onboarding.findAll({
//       where: { orgnaizationId: id },
//       include: [
//         {
//           model: team_perfomance,
//           as: "Emp_teamPerformance",
//           required: false,
//           where: {
//             date: { [Op.gte]: startDate, [Op.lte]: endDate },
//           },
//         },
//       ],
//     });


//     // Filtering employees who do NOT have a salary for the selected month
//     const employeesWithoutSalary = employees
//       .filter(
//         (emp) =>
//           (!emp.Emp_teamPerformance || emp.Emp_teamPerformance.length === 0) &&
//           (emp.employee_type === "Permanent") && (emp.isDelete !== true)
//       )
//       .map((emp) => emp); // Return only names

//     console.log(employeesWithoutSalary, "employeesWithoutSalary")
//     return employeesWithoutSalary; // Return only names
//   } catch (error) {
//     console.error("Error fetching employees without salaries:", error);
//     throw error;
//   }
// };

const getEmployeesWithoutPerformance = async (id, selectedYear, selectedMonth) => {
  console.log("getEmployeesWithoutPerformance service called...", id, selectedYear, selectedMonth);
  // Ensure selectedMonth is zero-padded
  const monthStr = String(selectedMonth).padStart(2, "0");

  // Get the last day of the month dynamically
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate(); // This gets the correct last day

  // Construct start and end dates properly
  const startDate = new Date(`${selectedYear}-${monthStr}-01T00:00:00Z`);
  const endDate = new Date(`${selectedYear}-${monthStr}-${lastDay}T23:59:59Z`);

  try {
    const employees = await Emp_onboarding.findAll({
      where: { orgnaizationId: id },
      include: [
        {
          model: team_perfomance,
          as: "Emp_teamPerformance",
          required: false,
          where: {
            date: { [Op.gte]: startDate, [Op.lte]: endDate },
          },
        },
      ],
    });

    // Filtering employees who do NOT have a salary for the selected month
    const employeesWithoutSalary = employees
      .filter(
        (emp) =>
          (!emp.Emp_teamPerformance || emp.Emp_teamPerformance.length === 0) &&
          emp.employee_type === "Permanent" &&
          emp.isDelete !== true
      );

    console.log(employeesWithoutSalary, "employeesWithoutSalary");
    return employeesWithoutSalary;
  } catch (error) {
    console.error("Error fetching employees without salaries:", error);
    throw error;
  }
};


module.exports = {
  createTeamPerformance,
  getTeamPerformances,
  getTeamPerformanceById,
  updateTeamPerformance,
  deleteTeamPerformance,
  getTeamPerformancesByOrganizationId,
  getEmployeesWithoutPerformance,
};
