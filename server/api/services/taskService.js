const Tasks = require("../models/taskCreation");
const Emp_onboarding = require("../models/Emp_onboarding");
const ProjectBoard = require("../models/projectBoardCreation");
const { Sequelize } = require("sequelize");
const moment = require("moment");
const { Op } = require("sequelize");
const cron = require("node-cron");
const sequelize = require("../../config/database");

const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const parseTime = (time) => {
  const [hrs, mins, secs] = time.split(":").map(Number);
  return hrs * 3600 + mins * 60 + secs;
};

function getAllFuncs(toCheck) {
  const props = [];
  let obj = toCheck;
  try {
    do {
      props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));
    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
    });
  } catch (error) {
    console.log("errorrrrr", error);
  }
}
console.log(getAllFuncs, "get all functionsss");

const createTask = async (data) => {
  try {
    const task = await Tasks.create(data);
    return task;
  } catch (error) {
    throw error;
  }
};

const createTaskAddEmployee = async (data) => {
  try {
    const { ProjectId, empOnboardingId } = data;

    const project = await ProjectBoard.findByPk(ProjectId, {
      include: [{ model: Emp_onboarding, through: { attributes: [] } }],
    });
    console.log(project, "projectsss");

    // if (!project) throw new Error("Project not found");
    if (!project) {
      throw new Error("project not found");
    }

    // Check if the employee is already assigned to the project
    const currentEmployeeIds = project.Emp_onboardings.map((e) => e.id);
    console.log(currentEmployeeIds, "currentEmployeeIddd");

    if (currentEmployeeIds.includes(empOnboardingId)) {
      throw new Error("Employee is already assigned to this project");
    }
    const addedEmployees = await Emp_onboarding.findAll({
      where: { id: empOnboardingId },
    });
    console.log(addedEmployees, "Ljmddd");
    // Assign the employee to the project
    await project.addEmp_onboarding(empOnboardingId);
    return {
      message: "Employee successfully assigned to the project",
      addedEmployees,
    };
  } catch (error) {
    console.log(error, "mcbndcb");

    throw error;
  }
};

const removeEmployeeFromProject = async (data) => {
  try {
    const { ProjectId, empOnboardingId } = data;
    const project = await ProjectBoard.findByPk(ProjectId, {
      include: [{ model: Emp_onboarding, through: { attributes: [] } }],
    });
    console.log(project, "projectsss");
    if (!project) {
      throw new Error("Project not found");
    }
    const currentEmployeeIds = project.Emp_onboardings.map((e) => e.id);
    console.log(currentEmployeeIds, "currentEmployeeIddd");
    const empIdsToRemove = Array.isArray(empOnboardingId)
      ? empOnboardingId
      : [empOnboardingId];
    const unassignedIds = empIdsToRemove.filter(
      (id) => !currentEmployeeIds.includes(id)
    );

    if (unassignedIds.length > 0) {
      throw new Error(
        `Employees with IDs ${unassignedIds.join(
          ", "
        )} are not assigned to this project`
      );
    }
    const removedEmployees = project?.Emp_onboardings.filter((employee) =>
      empIdsToRemove?.includes(employee?.id)
    );
    await project.removeEmp_onboarding(empIdsToRemove);

    console.log(removedEmployees, "jhvbn");
    // const removedEmployeeIds = removedEmployees.map((emp) => emp.id);
    // const deletedTasks = await Tasks.destroy({
    //   where: {
    //     ProjectId,
    //     empOnboardingId: { [Sequelize.Op.in]: removedEmployeeIds }, // Assuming employeeIds is an array
    //   },
    // });
    // console.log(
    //   `${deletedTasks} task(s) deleted for removed employees:`,
    //   removedEmployees.map((emp) => emp.emp_name)
    // );

    return {
      message: `${removedEmployees[0]?.emp_name} successfully removed from the project`,
      removedEmployees,
    };
  } catch (error) {
    throw error;
  }
};

const getTasks = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const tasks = await Tasks.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: "taskOfEmploye",
          attributes: ["emp_name"],
        },
        {
          model: ProjectBoard,
          as: "ProjectCreation",
        },
      ],
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getByOrganizationId = async (id) => {
  try {
    const tasks = await Tasks.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Emp_onboarding,
          as: "taskOfEmploye",
          attributes: ["emp_name"],
        },
        {
          model: ProjectBoard,
          as: "ProjectCreation",
        },
      ],
    });
    return tasks;
  } catch (error) {
    throw error;
  }

}



const getEmployeeTasks = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const tasks = await Emp_onboarding.findAll({
      include: [
        {
          model: Tasks,
          as: "Employeetask",
        },
      ],
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

// const getTaskById = async (id) => {
//   try {
//     const task = await Emp_onboarding.findByPk(id, {
//       include: [{
//         model: Emp_onboarding,
//         as: "teamMembers",
//         include: [{
//           model: Tasks,
//           as: "Employeetask"
//         }]
//       },
//       {
//         model: Tasks,
//         as: "Employeetask"
//       }]

//     });
//     if (!task) {
//       throw new Error('Task not found');
//     }
//     return task;
//   } catch (error) {
//     throw error;
//   }
// };

const getTaskById = async (id) => {
  try {
    const task = await Emp_onboarding.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamMembers",
          include: [
            {
              model: Tasks,
              as: "Employeetask",
              include: [
                {
                  model: ProjectBoard,
                  as: "ProjectCreation",
                },
              ],
            },
          ],
        },
        {
          model: Tasks,
          as: "Employeetask",
          include: [
            {
              model: ProjectBoard,
              as: "ProjectCreation",
            },
          ],
        },
      ],
    });
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  } catch (error) {
    throw error;
  }
};

const getTaskbyEmployee = async (id, page, pageSize, search) => {
  try {

    const offset = page * pageSize;
    const taskFilter = {
      [Sequelize.Op.or]: [
        { status: "Completed" },
        { status: "Achieved" },
        { status: "Overdue" }
      ]
    };
    const taskCount = await Emp_onboarding.count({
      where: { id },
      include: [{
        model: Tasks,
        as: "Employeetask",
        // required: true
        where: taskFilter
      }]
    }
    );

    const task = await Emp_onboarding.findByPk(id, {
      include: [{
        model: Tasks,
        as: "Employeetask",
        offset: offset,
        limit: pageSize,
        where: taskFilter,
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: ProjectBoard,
            as: "ProjectCreation",
          },
        ],
      }]
    });

    if (!task) {
      throw new Error("Task not found");
    }
    return { task, totalCount: taskCount };
  }
  catch (error) {
    throw error
  }
}

const updateTask = async (id, data) => {
  const {
    startTime,
    endTime,
    pauseTime,
    ResumeTime,
    taskDidTime,
    ...Taskdata
  } = data;

  let updatedTask = { ...Taskdata }; // Start with the basic fields
  let totalTaskDuration = 0; // Parse existing taskDidTime into milliseconds

  try {
    // Retrieve existing task data from the database
    const existingTask = await Tasks.findByPk(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Use existing startTime if not provided
    const currentStartTime = startTime || existingTask.startTime;

    // Handle startTime
    if (currentStartTime) {
      const parsedStartTime = new Date(currentStartTime);
      if (isNaN(parsedStartTime)) {
        throw new Error(`Invalid startTime format: ${currentStartTime}`);
      }
      updatedTask.startTime = parsedStartTime.toISOString(); // Convert to ISO format
    }

    // Handle pauseTime
    if (pauseTime) {
      const parsedPauseTime = new Date(pauseTime);
      if (isNaN(parsedPauseTime)) {
        throw new Error(`Invalid pauseTime format: ${pauseTime}`);
      }

      const taskResumeTime = ResumeTime || existingTask.ResumeTime;
      const taskStartTime = currentStartTime || existingTask.startTime;

      // Calculate duration between startTime and pauseTime or ResumeTime and pauseTime
      if (taskResumeTime) {
        const parsedResumeTime = new Date(taskResumeTime);
        totalTaskDuration += parsedPauseTime - parsedResumeTime;
      } else if (taskStartTime) {
        const parsedStartTime = new Date(taskStartTime);
        totalTaskDuration += parsedPauseTime - parsedStartTime;
      }

      updatedTask.pauseTime = parsedPauseTime.toISOString();
    }

    // Handle ResumeTime
    if (ResumeTime) {
      const parsedResumeTime = new Date(ResumeTime);
      if (isNaN(parsedResumeTime)) {
        throw new Error(`Invalid ResumeTime format: ${ResumeTime}`);
      }
      updatedTask.ResumeTime = parsedResumeTime.toISOString();
    }

    // Handle endTime
    if (endTime) {
      const parsedEndTime = new Date(endTime);
      if (isNaN(parsedEndTime)) {
        throw new Error(`Invalid endTime format: ${endTime}`);
      }

      const taskResumeTime = ResumeTime || existingTask.ResumeTime; // ResumeTime if task resumed
      const taskStartTime = currentStartTime || existingTask.startTime; // StartTime for the initial session
      const taskPauseTime = pauseTime || existingTask.pauseTime; // PauseTime (if any)

      // If task is resumed, calculate duration from resume time to end time
      if (taskResumeTime) {
        const parsedResumeTime = new Date(taskResumeTime);
        totalTaskDuration += parsedEndTime - parsedResumeTime;
      }
      // If task was never resumed but started, calculate duration from start time to end time
      else if (taskStartTime) {
        const parsedStartTime = new Date(taskStartTime);
        totalTaskDuration += parsedEndTime - parsedStartTime;
      }

      // If task is paused, retain the already calculated task duration as final
      if (taskPauseTime) {
        totalTaskDuration = totalTaskDuration; // Keep duration as it is
      }

      updatedTask.endTime = parsedEndTime.toISOString();
    }

    // Update taskDidTime with the cumulative duration
    if (existingTask.taskDidTime) {
      totalTaskDuration += parseDuration(existingTask.taskDidTime); // Add the existing duration
    }

    // Convert totalTaskDuration to "hh:mm:ss" format and set taskDidTime
    updatedTask.taskDidTime = formatDuration(totalTaskDuration);

    // Perform the update operation
    const [updated] = await Tasks.update(updatedTask, {
      where: { id: id },
    });

    if (!updated) {
      throw new Error("Task not found");
    }

    const updatedResult = await Tasks.findByPk(id);
    return updatedResult;
  } catch (error) {
    console.error(error.message); // Log error for debugging
    throw error;
  }
};


const updatetlTask = async (id, data) => {
  try {
    const updated = await Tasks.update(data, {
      where: { id: id }
    });
    return updated
  } catch (err) {
    throw err
  }
}


// const UpdateTaskViaReAssignEmp = async (id,data)=>{ 
//   console.log(data,"nbnjbnm");

//   try {
//       const UpTask = await Tasks.update(data, {
//         where: { id: id }
//       });
//       console.log(UpTask,"jhghjb");

//       return UpTask;
//     }
//   catch(err){
//     console.log(err,"Updating Task"); 
//     throw err;

//   }
// }

//// Helper Functions ////

// Parse a duration string ("hh:mm:ss") into milliseconds

// service/taskService.js
const UpdateTaskViaReAssignEmp = async (id, data) => {
  try {
    console.log(`Updating Task with ID: ${id}`);
    console.log("Update Data:", data);

    const updatedTask = await Tasks.update(data, {
      where: { id: id }
    });

    console.log("Update Result:", updatedTask); // Logs number of rows updated
    return updatedTask;
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
};



const parseDuration = (duration) => {
  if (!duration) return 0;
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
};

// Format a duration in milliseconds to "hh:mm:ss"
const formatDuration = (durationMs) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
};

// const updateTask = async (id, data) => {

//   const {startTime,endTime,pauseTime,ResumeTime,recent_startTime,taskDidTime,...Taskdata} = data
//   let updatedTask = { ...Taskdata };
//   console.log(updatedTask,"Taskdata");
//   if(startTime){
//     const StDate = new Date(startTime)
//     updatedTask.startTime = StDate

//     }

//   try {
//     const [updated] = await Tasks.update(updatedTask, {
//       where: { id: id }
//     });
//     if (!updated) {
//       throw new Error('Task not found');
//     }
//     const updatedTask = await Tasks.findByPk(id);
//     return updatedTask;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateTimer = async (id, action) => {
//   try {
//     const task = await Tasks.findByPk(id);

//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     const now = new Date();

//     if (action === "start") {
//       if (!task.dataValues.running) {
//         console.log(task.dataValues,"ffffffffffffffff")
//         if (task.dataValues.last_pause_time) {
//           const pauseDuration =
//             (now - new Date(task.dataValues.last_pause_time)) / 1000; // Calculate seconds
//             console.log(pauseDuration,"pauseDuration")
//           const elapsedSeconds =
//             parseTime(task.dataValues.elapsed_time) + Math.round(pauseDuration);
//             console.log(elapsedSeconds,"elapsedSeconds")
//             task.dataValues.elapsed_time = formatTime(elapsedSeconds);
//         }
//         task.dataValues.running = true;
//         task.dataValues.last_pause_time = null;
//       }
//     } else if (action === "pause") {
//       if (task.dataValues.running) {
//         task.dataValues.last_pause_time = now;
//         task.dataValues.running = false;
//       }
//     } else if (action === "end") {
//       task.dataValues.running = false;
//       task.dataValues.last_pause_time = null;
//     }
// console.log("tasks",task)
//     const updatetime = await Tasks.update(task.dataValues, {
//       where: { id: id }
//     });
//     console.log(updatetime,"ttttttttttttt")
//     return({ success: true, updatetime});
//   } catch (error) {
//     res.status(500).json({ error: "Error updating task" });
//   }
// };

// const updateTimer = async (id, action) => {
//   try {
//     const task = await Tasks.findByPk(id);

//     if (!task) {
//       return { error: "Task not found" };
//     }

//     const now = new Date();

//     if (action === "start") {
//       if (!task.running) {
//         if (task.last_pause_time) {
//           // const pauseDuration = Math.round(
//           //   (new Date(task.last_pause_time)) / 1000
//           // );
//           // console.log("Pause Duration:", pauseDuration);

//           const elapsedSeconds =
//             parseTime(task.elapsed_time)
//             // + pauseDuration;
//           console.log("Updated Elapsed Seconds:", elapsedSeconds);

//           task.elapsed_time = formatTime(elapsedSeconds);
//         }

//         task.running = true;
//         task.last_pause_time = null;
//       }
//     } else if (action === "pause") {
//       if (task.running) {
//         task.last_pause_time = now.toISOString(); // Save consistent timestamp
//         task.running = false;
//       }
//     } else if (action === "end") {
//       task.running = false;
//       task.last_pause_time = null;
//     }

//     task.updatedAt = now.toISOString(); // Update timestamp explicitly
//     await task.save();

//     console.log("Updated Task:", task);
//     return { success: true, task };
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return { error: "Error updating task" };
//   }
// };

// const updateTimer = async (id, action) => {
//   try {
//     const task = await Tasks.findByPk(id);

//     if (!task) {
//       return { error: "Task not found" };
//     }

//     const now = new Date();

//     if (action === "start") {
//       if (!task.running) {
//         if (!task.elapsed_time) {
//           task.elapsed_time = "00:00:00"; // Initialize elapsed_time for a new task
//         }
//         task.last_start_time = now.toISOString(); // Track when the timer starts
//         task.running = true;
//       }
//     } else if (action === "pause") {
//       if (task.running) {
//         // Calculate elapsed time since the last start
//         const elapsedSeconds =
//           parseTime(task.elapsed_time) +
//           Math.round((now - new Date(task.last_start_time)) / 1000);

//         task.elapsed_time = formatTime(elapsedSeconds); // Update total elapsed time
//         task.running = false; // Pause the timer
//         task.last_start_time = null; // Clear the start time
//         task.last_pause_time = now.toISOString(); // Record pause time
//       }
//     } else if (action === "end") {
//       if (task.running) {
//         // Calculate final elapsed time
//         const elapsedSeconds =
//           parseTime(task.elapsed_time) +
//           Math.round((now - new Date(task.last_start_time)) / 1000);

//         task.elapsed_time = formatTime(elapsedSeconds); // Final elapsed time
//       }

//       task.running = false; // Stop the timer
//       task.last_start_time = null; // Clear start time
//       task.last_pause_time = null; // Clear pause time
//     }

//     task.updatedAt = now.toISOString(); // Update the timestamp
//     await task.save();

//     console.log("Updated Task:", task);
//     return { success: true, task };
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return { error: "Error updating task" };
//   }
// };

const updateTimer = async (id, action) => {
  try {
    const task = await Tasks.findByPk(id);

    if (!task) {
      return { error: "Task not found" };
    }

    const now = new Date();

    if (action === "start") {
      if (!task.running) {
        if (!task.elapsed_time) {
          task.elapsed_time = "00:00:00"; // Initialize elapsed_time for a new task
        }
        task.status = "In Progress";
        task.last_start_time = now.toISOString(); // Record the start time
        task.running = true;
      }
    } else if (action === "pause") {
      if (task.running) {
        // Ensure `last_start_time` exists
        if (task.last_start_time) {
          // Calculate elapsed time since the last start
          const elapsedSeconds =
            parseTime(task.elapsed_time) +
            Math.round((now - new Date(task.last_start_time)) / 1000);

          task.elapsed_time = formatTime(elapsedSeconds); // Update total elapsed time
        }

        // Update the task state to paused
        task.running = false;
        task.last_start_time = null; // Clear the start time
        task.last_pause_time = now.toISOString(); // Record the pause time
      }
    } else if (action === "end") {
      if (task.running && task.last_start_time) {
        // Calculate final elapsed time
        const elapsedSeconds =
          parseTime(task.elapsed_time) +
          Math.round((now - new Date(task.last_start_time)) / 1000);

        task.elapsed_time = formatTime(elapsedSeconds); // Final elapsed time
      }

      // Stop the timer
      task.running = false;
      task.last_start_time = null; // Clear the start time
      task.last_pause_time = null; // Clear the pause time
    }

    task.updatedAt = now.toISOString(); // Update the timestamp
    await task.save();

    console.log("Updated Task:", task);
    return { success: true, task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Error updating task" };
  }
};

const deleteTask = async (id) => {
  try {
    const deleted = await Tasks.destroy({
      where: { id: id },
    });
    if (!deleted) {
      throw new Error("Task not found");
    }
  } catch (error) {
    throw error;
  }
};





// Execute Missed Tasks on Server Restart
// const executeMissedTasks = async () => {
//   // const now = moment().format("HH:mm:ss");
//   const now = moment().tz('Asia/Kolkata').format('HH:mm:ss'); // current time in IST

//   const missedTasks = await Tasks.findAll({
//     where: {
//       repeat_active: true,
//       repeat: true,
//       reshedule_time: { [Op.lte]: now },
//     },
//   });

//   missedTasks.forEach( async (task) => {
//     console.log(`Executing missed task: ${task.task_name}`);
//     // Perform your task logic here
//     try {
//       const tasks = await Tasks.create(task);
//       return tasks;
//     } catch (error) {
//       throw error;
//     }
//   });
// };

// Schedule Future Tasks (Mon-Fri)

const scheduleTasks = async () => {
  // Fetch tasks that need to be scheduled
  const tasks = await Tasks.findAll({
    where: { repeat_active: true }
  });

  console.log(tasks, "Fetched tasks for scheduling");

  if (tasks.length === 0) {
    console.log("No tasks found to schedule.")
  }

  tasks.forEach((task) => {
    // Extract the time (e.g., '15:00:00')
    const [hours, minutes] = task.reshedule_time.split(":");

    // Convert the reshedule_time to IST (Indian Standard Time)
    const timeInIST = moment.tz(`${hours}:${minutes}`, 'HH:mm', 'Asia/Kolkata').format('HH:mm');

    // Extract hours and minutes from IST converted time
    const [istHours, istMinutes] = timeInIST.split(":");

    // Debug: Log the formatted time
    console.log(`Scheduled Time in IST: ${istHours}:${istMinutes}`);

    // Check the recurrence type and schedule accordingly
    if (task.recurrence_types === 'daily') {
      // Schedule task to run daily (Monday to Saturday)
      cron.schedule(`${istMinutes} ${istHours} * * 1-6`, async () => {
        console.log(`Executing scheduled daily task: ${task.task_name} at ${istHours}:${istMinutes} IST`);
        try {
          const recreatedTask = await Tasks.create({
            task_name: task.task_name,
            duration: task.duration,
            task_description: task.task_description,
            segment: task.segment,
            reward_points: task.reward_points,
            recurrence_task_date :task.recurrence_task_date ,
            empOnboardingId: task.empOnboardingId,
            ProjectId: task.ProjectId,
            status: "Pending"
          });
          console.log(recreatedTask, "Task recreated successfully for daily recurrence");
        } catch (error) {
          console.log(error, "Error recreating daily task");
        }
      })
    } else if (task.recurrence_types === 'weekly') {
        const taskDateMoment = moment(task.recurrence_task_date);
        if (!taskDateMoment.isValid()) {
          console.error(`Invalid recurrence_task_date for weekly recurrence: ${task.recurrence_task_date}`);
          return;
        }
        const taskDay = taskDateMoment.day(); // Get day (0=Sunday, 6=Saturday)
        console.log(`Weekly task scheduled for day: ${taskDay}`);
  
        cron.schedule(`${istMinutes} ${istHours} * * ${taskDay}`, async () => {
          console.log(`Executing scheduled weekly task: ${task.task_name} at ${istHours}:${istMinutes} IST on weekday ${taskDay}`);
          
        try {
          const recreatedTask = await Tasks.create({
            task_name: task.task_name,
            duration: task.duration,
            task_description: task.task_description,
            segment: task.segment,
            reward_points: task.reward_points,
            recurrence_task_date :task.recurrence_task_date ,
            empOnboardingId: task.empOnboardingId,
            ProjectId: task.ProjectId,
            status: "Pending"
          });
          console.log(recreatedTask, "Task recreated successfully for weekly recurrence");
        } catch (error) {
          console.log(error, "Error recreating weekly task");
        }
      });
    } else if (task.recurrence_types === 'monthly') {
      // Extract the day of the month from the provided date
      const taskDate = moment(task.recurrence_task_date).date(); // Get day (1-31)  
      if (isNaN(taskDate) || taskDate < 1 || taskDate > 31) {
        console.error(`Invalid date for monthly recurrence: ${task.recurrence_task_date}`);
        return;
      }
    
      // Schedule task to run on the given date every month
      cron.schedule(`${istMinutes} ${istHours} ${taskDate} * *`, async () => {
        console.log(`Executing scheduled monthly task: ${task.task_name} on ${taskDate} of every month at ${istHours}:${istMinutes} IST`);
        
        try {
          const recreatedTask = await Tasks.create({
            task_name: task.task_name,
            duration: task.duration,
            task_description: task.task_description,
            segment: task.segment,
            reward_points: task.reward_points,
            recurrence_task_date: task.recurrence_task_date,
            empOnboardingId: task.empOnboardingId,
            ProjectId: task.ProjectId,
            status: "Pending"
          });
    
          console.log(recreatedTask, "Task recreated successfully for monthly recurrence");
        } catch (error) {
          console.log(error, "Error recreating monthly task");
        }
      });
    }  else  if (task.recurrence_types === "onetime") {
      const cronDate = moment(task.recurrence_task_date);
      if (cronDate.isBefore(moment())) {
        console.error(`Skipping one-time task ${task.task_name}: Scheduled time is in the past.`);
        return;
      }

      const cronExpression = `${istMinutes} ${istHours} ${cronDate.date()} ${cronDate.month() + 1} *`;
      console.log(`Scheduling one-time task ${task.task_name} with cron: ${cronExpression}`);

      cron.schedule(cronExpression, async () => {
        console.log(`Executing one-time task: ${task.task_name} at ${istHours}:${istMinutes} IST`);

        try {
          const recreatedTask = await Tasks.create({
            task_name: task.task_name,
            duration: task.duration,
            task_description: task.task_description,
            segment: task.segment,
            reward_points: task.reward_points,
            recurrence_task_date: task.recurrence_task_date,
            empOnboardingId: task.empOnboardingId,
            ProjectId: task.ProjectId,
            status: "Pending",
          });

          console.log("One-time task executed successfully:", recreatedTask);
        } catch (error) {
          console.log("Error executing one-time task", error);
        }
      });
    }
    
  });
};


// const scheduleTasks = async () => {
//   const tasks = await Tasks.findAll({
//     where: { repeat_active: true },
//   });

//   tasks.forEach((task) => {
//     if (!task.reshedule_time) return;
//     const [hours, minutes] = task.reshedule_time.split(":");
//     const timeInIST = moment.tz(`${hours}:${minutes}`, "HH:mm", "Asia/Kolkata").format("HH:mm");
//     const [istHours, istMinutes] = timeInIST.split(":");
//     console.log(istHours, "istHoursss", istMinutes, "isMinutesss")

//     console.log(`Scheduled Time in IST: ${istHours}:${istMinutes}`);

//     if (task.recurrence_types === "daily") {
//       cron.schedule(`${istMinutes} ${istHours} * * 1-6`, async () => {
//         await recreateTask(task, "daily");
//       });
//     } else if (task.recurrence_types === "weekly" && task.recurrence_weekly_name !== null) {
//       cron.schedule(`${istMinutes} ${istHours} * * ${task.recurrence_weekly_name}`, async () => {
//         await recreateTask(task, "weekly");
//       });
//     } else if (task.recurrence_types === "monthly") {
//       cron.schedule(`${istMinutes} ${istHours} 1 * *`, async () => {
//         await recreateTask(task, "monthly");
//       });
//     }
//   });
// };

// const recreateTask = async (task, recurrenceType) => {
//   try {
//     const recreatedTask = await Tasks.create({
//       task_name: task.task_name,
//       duration: task.duration,
//       task_description: task.task_description,
//       segment: task.segment,
//       reward_points: task.reward_points,
//       empOnboardingId: task.empOnboardingId,
//       ProjectId: task.ProjectId,
//       status: "Pending",
//       recurrence_types: recurrenceType,
//       recurrence_weekly_name: task.recurrence_weekly_name,
//     });
//     console.log(recreatedTask, `Task recreated successfully for ${recurrenceType} recurrence`);
//   } catch (error) {
//     console.log(error, `Error recreating ${recurrenceType} task`);
//   }
// };

// Initialize Scheduler
const initializeScheduler = async () => {
  await scheduleTasks();
};

// Synchronize database and start scheduler
sequelize.sync().then(() => {
  console.log("Database connected");
  initializeScheduler(); // Start the scheduler
});

module.exports = {
  createTask,
  createTaskAddEmployee,
  getTasks,
  getByOrganizationId,
  getEmployeeTasks,
  getTaskById,
  updateTask,
  updateTimer,
  deleteTask,
  removeEmployeeFromProject,
  UpdateTaskViaReAssignEmp,
  getTaskbyEmployee,
  updatetlTask
};
