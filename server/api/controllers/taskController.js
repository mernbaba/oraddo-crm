const ProjectBoard = require("../models/projectBoardCreation");
const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await taskService.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTaskAddEmployee = async (req, res) => {
  try {
    const { ProjectId, empOnboardingId } = req.body;

    if (!ProjectId || !empOnboardingId) {
      return res
        .status(400)
        .json({ error: "ProjectId and EmployeeId are required" });
    }

    const result = await taskService.createTaskAddEmployee({
      ProjectId,
      empOnboardingId,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeEmployee = async (req, res) => {
  const { ProjectId, empOnboardingId } = req.body;
  if (!ProjectId || !Array.isArray(empOnboardingId)) {
    return res.status(400).json({ message: "Invalid data format." });
  }
  try {
    const result = await taskService.removeEmployeeFromProject({
      ProjectId,
      empOnboardingId
    })
    res.status(200).json(result)
  } catch (err) {
    console.log(err, "errorInremoveEmp");

    res.status(500).json({ error: err.message });
  }
};


const getTasks = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.params.limit;
    const tasks = await taskService.getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTasksByOrganizationId = async (req, res) => {
  const id = req.params.id
  try {
    const tasks = await taskService.getByOrganizationId(id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const getEmployeeTasks = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.params.limit;
    const tasks = await taskService.getEmployeeTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskbyEmployee = async (req, res) => {
  try {
    const id = req.params.id
    const { page = 0, pageSize = 10, search = "" } = req.query
    const pageInt = parseInt(page, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    const task = await taskService.getTaskbyEmployee(id, pageInt, pageSizeInt, search);
    res.status(200).json(task);
  }
  catch (error) {
    res.status(200).json({ error: error.message });
  }
}

const getAllTasksByEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const tasks = await taskService.getAllTasksByEmployee(id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const taskData = req.body;
    console.log(taskData, "Data....");
    console.log(id, "id....");

    const updatedTask = await taskService.updateTask(id, taskData);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tlupdatetask = async (req, res) => {
  try {
    const id = req.params.id;
    const taskData = req.body;
    console.log(taskData, "Data....");
    console.log(id, "id....");

    const updatedTask = await taskService.updatetlTask(id, taskData);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateTaskViaReAssignEmp = async (req, res) => {
//   console.log(req,"hvhgvb");
//   try {
//     const id = req.params.id;
//     const taskData = req.body;
//     console.log(taskData, "Data....");
//     console.log(id, "id....");

//     const updatedTask = await taskService.UpdateTaskViaReAssignEmp(id, taskData);
//     res.status(200).json(updatedTask);
//   } catch (error) {
//     console.log(error,"gfhvhbv");

//     res.status(500).json({ error: error.message });
//   }
// };

// controller/taskController.js
const updateTaskViaReAssignEmp = async (req, res) => {
  try {
    const id = req.params.id; // Extract the task ID from URL params
    console.log(id, "idddddd")
    const taskData = req.body; // Extract task data from request body

    console.log(`Updating Task with ID: ${id}`);
    console.log("Update Data:", taskData);

    // Call the service to update the task
    const updatedTask = await taskService.UpdateTaskViaReAssignEmp(id, taskData);

    if (updatedTask[0] === 0) {
      // No rows updated (e.g., invalid ID)
      return res.status(404).json({ message: "Task not found or no changes made" });
    }

    // Send success response
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: error.message });
  }
};

const UpdateTimer = async (req, res) => {
  try {
    const { id, action } = req.body;

    const updatedTask = await taskService.UpdateTaskViaReAssignEmp(id, action);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createTask,
  createTaskAddEmployee,
  getTasks,
  getTasksByOrganizationId,
  getTaskById,
  updateTask,
  UpdateTimer,
  getEmployeeTasks,
  deleteTask,
  removeEmployee,
  updateTaskViaReAssignEmp,
  getTaskbyEmployee,
  getAllTasksByEmployee,
  tlupdatetask
};
