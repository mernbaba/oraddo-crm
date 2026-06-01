const express = require("express");
const router = express.Router();
const expoensesCreationManagementRoute = require("../controllers/expensesManagementCreationController");



router.post("/expensesCreationManagement",expoensesCreationManagementRoute.controllExpensesCreationManagement);
router.get("/getExpensesManagement",expoensesCreationManagementRoute.controllAllExpensesManagement);
router.get("/getExpensesOrganizationId/:id",expoensesCreationManagementRoute.getmanagementExpenxesOrgId);
router.get("/getExpensesManagementByOrganization/:id",expoensesCreationManagementRoute.getExpensesManagementByOrganization);
router.get("/getExpensesManagement/:id",expoensesCreationManagementRoute.getExpensesManagementById);
router.put("/updateExpensesManagement/:id",expoensesCreationManagementRoute.controllUpdateExpensesManagement);
router.delete("/deleteExpensesManagement/:id",expoensesCreationManagementRoute.controllDeleteExpensesManagement);

module.exports = router;