const RevenueCreation = require("../models/RevenueCreation");
const InvoiceMangement = require("../models/InvoiceManagement");
const salaryManagement = require("../models/salaryManagement");
const expensesManagement = require("../models/expensesManagementCreation");
const { Op, fn, col, literal, cast } = require("sequelize");
const createRevenue = async (data) => {
  try {
    const revenue = await RevenueCreation.create(data);
    return revenue;
  } catch (error) {
    throw error;
  }
};

const getAllRevenues = async () => {
  try {
    const revenues = await RevenueCreation.findAll();
    return revenues;
  } catch (error) {
    throw error;
  }
};





// const getAllRevenuesbyOrganizationId = async (id, year) => {
//   try {
//     // Fetch monthly revenue and tax from invoices
//     const invoices = await InvoiceMangement.findAll({
//       attributes: [
//         [fn("DATE_TRUNC", "month", col("Date")), "month"],  // Ensure "Date" is correct
//         [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("Total"), ""), "NUMERIC"), 0), "NUMERIC")), "revenue"], // Handle empty strings as NULL
//         [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("GST"), ""), "NUMERIC"), 0), "NUMERIC")), "tax"], // Handle empty strings as NULL
//       ],
//       where: {
//         organizationID: id,
//         [Op.and]: [literal(`EXTRACT(YEAR FROM "Date") = ${year}`)], // Ensure "Date" is correct
//       },
//       group: [fn("DATE_TRUNC", "month", col("Date"))],  // Use fn() instead of literal()
//       raw: true,
//     });

//     console.log(invoices, "invoices");  

//     // Fetch monthly salary (sum of net_pay)
//     const salaries = await salaryManagement.findAll({
//       attributes: [
//         [fn("DATE_TRUNC", "month", col("salary_date")), "month"],
//         [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("net_pay"), ""), "NUMERIC"), 0), "NUMERIC")), "salary"], // Handle empty strings as NULL
//       ],
//       where: {
//         organizationId: id,
//         [Op.and]: [literal(`EXTRACT(YEAR FROM salary_date) = ${year}`)], // Corrected column reference
//       },
//       group: [fn("DATE_TRUNC", "month", col("salary_date"))], // Used fn() instead of literal()
//       raw: true,
//     });

// console.log(salaries, "salaries");  

//     const expenses = await expensesManagement.findAll({
//       attributes: [
//         [fn("DATE_TRUNC", "month", col("dateOfPurchasing")), "month"],
//         [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("price"), ""), "NUMERIC"), 0), "NUMERIC")), "expenses"], // Handle empty strings as NULL
//       ],
//       where: {
//         organizationID: id,
//         [Op.and]: [literal(`EXTRACT(YEAR FROM "dateOfPurchasing") = ${year}`)], // Corrected column reference
//       },
//       group: [fn("DATE_TRUNC", "month", col("dateOfPurchasing"))], // Used fn() instead of literal()
//       raw: true,
//     });
//     console.log(expenses, "expenses");
    
    
    
    




//     // Merge data into a single structured response
//     const monthlyData = {};

//     invoices.forEach((inv) => {
//       const month = inv.month.toISOString().slice(0, 7); // Extract YYYY-MM
//       monthlyData[month] = {
//         revenue: inv.revenue || 0,
//         tax: inv.tax || 0,
//         salary: 0,
//         expenses: 0,
//       };
//     });

//     salaries.forEach((sal) => {
//       const month = sal.month.toISOString().slice(0, 7);
//       if (!monthlyData[month]) monthlyData[month] = { revenue: 0, tax: 0, salary: 0, expenses: 0 };
//       monthlyData[month].salary = sal.salary || 0;
//     });

//     expenses.forEach((exp) => {
//       const month = exp.month.toISOString().slice(0, 7);
//       if (!monthlyData[month]) monthlyData[month] = { revenue: 0, tax: 0, salary: 0, expenses: 0 };
//       monthlyData[month].expenses = exp.expenses || 0;
//     });

//     return Object.keys(monthlyData).map((month) => ({
//       month,
//       ...monthlyData[month],
//     }));
//   } catch (error) {
//     throw error;
//   }
// };


const getAllRevenuesbyOrganizationId = async (id, year) => {
  try {
    // Fetch monthly revenue and tax from invoices
    const invoices = await InvoiceMangement.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("Date")), "month"],
        [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("Total"), ""), "NUMERIC"), 0), "NUMERIC")), "revenue"],
        [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("GST"), ""), "NUMERIC"), 0), "NUMERIC")), "tax"],
      ],
      where: {
        organizationID: id,
        status:"Approved",
        [Op.and]: [literal(`EXTRACT(YEAR FROM "Date") = ${year}`)],
      },
      group: [fn("DATE_TRUNC", "month", col("Date"))],
      raw: true,
    });

    const salaries = await salaryManagement.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("salary_date")), "month"],
        [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("net_pay"), ""), "NUMERIC"), 0), "NUMERIC")), "salary"],
      ],
      where: {
        organizationId: id,
        [Op.and]: [literal(`EXTRACT(YEAR FROM salary_date) = ${year}`)],
      },
      group: [fn("DATE_TRUNC", "month", col("salary_date"))],
      raw: true,
    });

    const expenses = await expensesManagement.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("dateOfPurchasing")), "month"],
        [fn("SUM", cast(fn("COALESCE", cast(fn("NULLIF", col("price"), ""), "NUMERIC"), 0), "NUMERIC")), "expenses"],
      ],
      where: {
        organizationID: id,
        [Op.and]: [literal(`EXTRACT(YEAR FROM "dateOfPurchasing") = ${year}`)],
      },
      group: [fn("DATE_TRUNC", "month", col("dateOfPurchasing"))],
      raw: true,
    });

    // Initialize all 12 months with default values
    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(year, i, 1).toLocaleString("en-US", { month: "long" }); // Format as "January", "February", etc.
      monthlyData[monthName] = { revenue: 0, tax: 0, salary: 0, expenses: 0 };
    }

    // Populate data from fetched results
    invoices.forEach((inv) => {
      const monthName = new Date(inv.month).toLocaleString("en-US", { month: "long" });
      monthlyData[monthName].revenue = parseFloat(inv.revenue) || 0;
      monthlyData[monthName].tax = parseFloat(inv.tax) || 0;
    });

    salaries.forEach((sal) => {
      const monthName = new Date(sal.month).toLocaleString("en-US", { month: "long" });
      monthlyData[monthName].salary = parseFloat(sal.salary) || 0;
    });

    expenses.forEach((exp) => {
      const monthName = new Date(exp.month).toLocaleString("en-US", { month: "long" });
      monthlyData[monthName].expenses = parseFloat(exp.expenses) || 0;
    });

    // Convert to final output format
    return Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));
  } catch (error) {
    throw error;
  }
};


const getRevenueById = async (id) => {
  try {
    const revenue = await RevenueCreation.findByPk(id);
    return revenue;
  } catch (error) {
    throw error;
  }
};

const updateRevenue = async (id, data) => {
  try {
    const revenue = await RevenueCreation.update(data, {
      where: { id: id },
    });
    return revenue;
  } catch (error) {
    throw error;
  }
};

const deleteRevenue = async (id) => {
  try {
    await RevenueCreation.destroy({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRevenue,
  getAllRevenues,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
  getAllRevenuesbyOrganizationId
};
