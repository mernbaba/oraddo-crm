const express = require("express");
const leavesController = require("../controllers/leavesCreationController");
const { Middleware } = require("../middleware/authMiddleware");

const router = express.Router();

//getLeavebyId

router.post("/leaves", leavesController.createLeave);
router.get("/leaves", leavesController.getLeaves);
router.get("/leavesbyorganizationid/:id", leavesController.getLeavesByOrganizationId);
router.get("/getLeavesforManagement/:id", leavesController.getLeavesforLeaveManagement);
router.get('/leavesbyid/:id',leavesController.getLeavebyId);
router.get("/leaves/:id", leavesController.getLeaveById);
router.put("/leaves/:id", leavesController.updateLeave);
router.delete("/leaves/:id", leavesController.deleteLeave);

module.exports = router;
