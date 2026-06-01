const express = require("express");
const employeePollController=require("../controllers/employeePollController");
// const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/employeePoll",employeePollController.createEmployeePoll);
router.get("/employeePoll",employeePollController.getAllEmployeePoll);
router.get("/employeePoll/:id",employeePollController.getEmployeePollById);
router.put("/employeePoll/:id",employeePollController.updateEmployeePoll);
router.delete("/employeePoll/:id",employeePollController.deleteEmployeePoll);

module.exports = router;
