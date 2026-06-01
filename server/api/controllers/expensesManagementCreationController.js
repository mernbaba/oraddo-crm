const expensesManagementCreationServices = require("../services/expensesManagementCreationServices");



const controllExpensesCreationManagement = async (req, res) => {
    const data = req.body;
    try {
        const controllResponse = await expensesManagementCreationServices.expensesCreationManagement(data);
        return res.status(201).json({ message: controllResponse });
    } catch (error) {
        console.log(error, "error in controller");
    }
};

const controllAllExpensesManagement = async (req, res) => {
    try {
        const controllAllResponse = await expensesManagementCreationServices.getAllExpensesManagementCreation();
        return res.status(200).json({ message: controllAllResponse });
    } catch (error) {
        console.log(error, "error in controller");
    }
};
const getmanagementExpenxesOrgId = async (req, res) => {
    const id = req.params.id
    try {
        const controlResponse = await expensesManagementCreationServices.getExpensesManagementOrganId(id);
        return res.status(200).json({ message: controlResponse });
    } catch (error) {
        console.log(error, "error in controller");
    }
}

const getExpensesManagementByOrganization = async (req, res) => {
    const id = req.params.id
    const { page = 0, pageSize = 10, month, year } = req.query;
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);
    // const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);
    try {
        const controlResponse = await expensesManagementCreationServices.getExpensesManagementByOrganization(id, pageInt, pageSizeInt, month, yearInt);
        return res.status(200).json({ message: controlResponse });
    } catch (error) {
        console.log(error, "error in controller");
    }
}
const getExpensesManagementById = async (req, res) => {
    const { id } = req.params
    try {
        const expensesManagement = await expensesManagementCreationServices.getExpensesManagementCreationById(id);
        if (expensesManagement) {
            res.status(200).json(expensesManagement);
        } else {
            res.status(404).json({ message: 'Employee expense not found' });
        }
    } catch (error) {
        {
            res.status(500).json({ message: error.message });
        }
    }
}
const controllUpdateExpensesManagement = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const controllUpdateExpenses = await expensesManagementCreationServices.updateExpensesManagementCreation(id, data);
        return res.status(200).json({ message: controllUpdateExpenses });
    } catch (error) {
        console.log(error, "error in controller");

    }
};

const controllDeleteExpensesManagement = async (req, res) => {
    const { id } = req.params;
    try {
        const controllDelete = await expensesManagementCreationServices.deleteExpensesManagementCreation(id);
        return res.status(204).end();
    } catch (error) {
        console.log(error, 'error in controller');
    }
};

module.exports = {
    controllExpensesCreationManagement,
    controllAllExpensesManagement,
    getmanagementExpenxesOrgId,
    getExpensesManagementById,
    controllUpdateExpensesManagement,
    controllDeleteExpensesManagement,
    getExpensesManagementByOrganization
}