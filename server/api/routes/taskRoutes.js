const express = require('express');
const taskController = require('../controllers/taskController');
const { Middleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tasks', taskController.createTask);
router.post("/assignNewEmp", taskController.createTaskAddEmployee);
router.post("/project/removeemploee",taskController.removeEmployee)
router.get('/tasks', taskController.getTasks);
router.get('/tasksOrganizationId/:id',taskController.getTasksByOrganizationId);
router.get('/tasks/:id', taskController.getTaskById);
router.get("/task-for-employee/:id",taskController.getTaskbyEmployee)
router.get("/all-tasks-for-employee/:id", taskController.getAllTasksByEmployee)
router.put('/tasks/:id', taskController.updateTask);
router.put('/taskViaReAssignEmp/:id',taskController.updateTaskViaReAssignEmp);
router.post("/update-task", taskController.UpdateTimer);
router.delete('/tasks/:id', taskController.deleteTask);
router.delete('/tasks/:id', taskController.deleteTask); 
// router.post('/repeatedtasks',taskController.repeatedtasks)
router.put('/tlupdatetask/:id',taskController.tlupdatetask)

module.exports = router;
