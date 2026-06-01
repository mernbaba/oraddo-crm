const { where, Op } = require("sequelize");
const ExpensesMangementCreation = require("../models/expensesManagementCreation");




const expensesCreationManagement = async (data) => {
    try {
        const responseCreation = await ExpensesMangementCreation.create(data);
        return responseCreation;
    } catch (error) {
        console.log(error, "creation failed in services");
    }
};

const getAllExpensesManagementCreation = async () => {
    try {
        const getAllResponses = await ExpensesMangementCreation.findAll();
        return getAllResponses;
    } catch (error) {
        console.log(error, "data fetched error in services");
    }
};

const getExpensesManagementOrganId = async (id) => {
    try {
        const getAllResponses = await ExpensesMangementCreation.findAll({ where: { organizationID: id } });
        return getAllResponses;
    } catch (error) {
        console.log(error, "data fetched error in services");
    }
}


const getExpensesManagementByOrganization = async (id, page, pageSize, selectedMonth, selectedYear) => {
    console.log("Fetching expenses for:", { id, page, pageSize, selectedYear, selectedMonth });

    try {
        const offset = page * pageSize;

        // Map months from "Jan" format to their numerical representation (1-12)
        const monthMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };

        const monthNumber = monthMap[selectedMonth]; // Convert month name to number

        if (!monthNumber) {
            throw new Error("Invalid month provided");
        }

        // Construct the date range for filtering (start and end of the month)
        const startDate = new Date(selectedYear, monthNumber - 1, 1); // First day of month
        const endDate = new Date(selectedYear, monthNumber, 0, 23, 59, 59); // Last day of month

        // Get total count of expenses for pagination
        const totalExpenses = await ExpensesMangementCreation.count({
            where: {
                organizationID: id,
                dateOfPurchasing: {
                    [Op.between]: [startDate, endDate] // Filter between start and end of the month
                }
            }
        });

        // Fetch expenses with filtering, pagination, and sorting
        const expenses = await ExpensesMangementCreation.findAll({
            where: {
                organizationID: id,
                dateOfPurchasing: {
                    [Op.between]: [startDate, endDate]
                }
            },
            offset: offset,
            limit: pageSize,
            order: [['dateOfPurchasing', 'DESC']],
        });

        console.log(expenses, "ExpensesMangementCreation");
        return { expenses, totalExpenses };
    } catch (error) {
        console.error(error, "Expenses not found");
        throw new Error("Expenses not found");
    }
};




const getExpensesManagementCreationById = async (id) => {
    console.log(id, "expensesIddd");
    try {
        const expenseManagement = await ExpensesMangementCreation.findByPk(id);
        return expenseManagement;
    } catch (error) {
        throw new Error("Error retriving expenses by id")
    }
}


const updateExpensesManagementCreation = async (id, updateExpenses) => {
    try {
        const updateResponse = await ExpensesMangementCreation.update(updateExpenses, { where: { id } });
        console.log(updateResponse, 'uuuuu');

        return updateResponse;
    } catch (error) {
        console.log(error, "error updation in servises");
    }
};


const deleteExpensesManagementCreation = async (id) => {
    try {
        const deleteResponse = await ExpensesMangementCreation.destroy({ where: { id } });
        return deleteResponse;
    } catch (error) {
        console.log(error, "delete failed in services");
    }
};

module.exports = {
    expensesCreationManagement,
    getAllExpensesManagementCreation,
    getExpensesManagementOrganId,
    getExpensesManagementCreationById,
    updateExpensesManagementCreation,
    deleteExpensesManagementCreation,
    getExpensesManagementByOrganization
}