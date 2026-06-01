const { Op, Sequelize } = require("sequelize");
const Emp_onboarding = require("../models/Emp_onboarding");
const ProjectBoard = require("../models/projectBoardCreation");
const Tasks = require("../models/taskCreation");
const sequelize = require("../../config/database");

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
console.log(getAllFuncs, "getOwnMethods");

const createProjectBoard = async (data) => {
  try {
    const { assignedMembers, team_lead, TaskDetailes, ...projectData } = data;
    if (!team_lead) {
      throw new Error("Team lead is required.");
    }
    const teamLeadExists = await Emp_onboarding.findByPk(team_lead);
    if (!teamLeadExists) {
      throw new Error("Invalid team lead ID.");
    }
    console.log({ ...projectData }, "from service");
    // Create the project board
    const project = await ProjectBoard.create({ ...projectData, team_lead });
    // Assign employees to the project
    if (assignedMembers && assignedMembers.length > 0) {
      await project.addEmp_onboardings(assignedMembers);
    }

    if (TaskDetailes) {
      const tasks = TaskDetailes.map((each) => ({
        ...each,
        ProjectId: project.id,
      }));
      const taskData = await Tasks.bulkCreate(tasks, {
        validate: true,
      });
      console.log(taskData, "from tasssssssss");
      project.tasksInfo = taskData;
    }

    return project;
  } catch (error) {
    console.error("Error creating project board:", error);
    throw error;
  }
};

const getProjectBoards = async () => {
  try {
    const projectBoards = await ProjectBoard.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          // attributes: ["id", "emp_name"],
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] },
        },
        {
          model: Tasks,
          as: "task_projectData",
          include: [
            {
              model: Emp_onboarding,
              as: "taskOfEmploye",
            },
          ],
        },
      ],
      logging: console.log, // Logs the SQL query
    });

    return projectBoards;
  } catch (error) {
    console.error("Error fetching project boards:", error);
    throw error;
  }
};


const getCompletedProjects = async (id, page, pageSize, search) => {
  try {
    const offset = page * pageSize;

    let whereCondition = { organizationID: id, isComplete: true }

    if (search) {
      whereCondition.title = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    const projectCount = await ProjectBoard.count({
      where: whereCondition
    })

    const projectBoard = await ProjectBoard.findAll({
      where: whereCondition,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "Desc"]],
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          attributes: ["id", "emp_name"],
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] },
        },
        {
          model: Tasks,
          as: "task_projectData",
          include: [
            {
              model: Emp_onboarding,
              as: "taskOfEmploye",
            },
          ],
        },
      ],
    });
    console.log(projectCount, projectBoard, "from complete")
    return { projectBoard, totalCount: projectCount };
  } catch (error) {
    throw error;
  }
};


const getProjectsByOrganization = async (id) => {
  try {
    const projectBoard = await ProjectBoard.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          attributes: ["id", "emp_name"],
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] },
        },
        {
          model: Tasks,
          as: "task_projectData",
          include: [
            {
              model: Emp_onboarding,
              as: "taskOfEmploye",
            },
          ],
        },
      ],
    });
    return projectBoard;
  } catch (error) {
    throw error;
  }
};

const getProjectTitle = async (id) => {
  try {
    const projectBoard = await ProjectBoard.findAll({
      where: { organizationID: id },
      attributes: ["id", "title"],
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          attributes: ["id", "emp_name"],
        },
        // {
        //   model: Emp_onboarding,
        //   through: { attributes: [] },
        // },
        // {
        //   model: Tasks,
        //   as: "task_projectData",
        //   include: [
        //     {
        //       model: Emp_onboarding,
        //       as: "taskOfEmploye",
        //     },
        //   ],
        // },
      ],
    });
    return projectBoard;
  } catch (error) {
    throw error;
  }
};

const getInprogressProject = async (id) => {
  try {
    let whereCondition = { organizationID: id, isComplete: false }
    const projectBoard = await ProjectBoard.findAll({
      where: whereCondition,
      order: [["createdAt", "Desc"]],
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          attributes: ["id", "emp_name"],
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] },
        },
        {
          model: Tasks,
          as: "task_projectData",
          include: [
            {
              model: Emp_onboarding,
              as: "taskOfEmploye",
            },
          ],
        },
      ],
    });
    return projectBoard;
  } catch (error) {
    throw error;
  }
}

const getProjectBoardById = async (id) => {
  try {
    const projectBoard = await ProjectBoard.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] }, // This ensures the through table's attributes are not included
        },
        {
          model: Tasks,
          as: "task_projectData", // Include the tasks associated with this project
          include: [
            {
              model: Emp_onboarding,
              as: "taskOfEmploye",
            },
          ],
        },
      ],
      logging: console.log, // Logs the SQL query
    });

    if (!projectBoard) {
      throw new Error("Project Board not found");
    }

    return projectBoard;
  } catch (error) {
    console.error("Error fetching project board by id:", error);
    throw error;
  }
};

const updateProjectBoard = async (id, data) => {
  try {
    const { assignedMembers, team_lead, ...projectData } = data;

    // Validate if the project board exists
    const project = await ProjectBoard.findByPk(id);
    if (!project) {
      throw new Error("Project Board not found");
    }

    if (team_lead) {
      const teamLeadExists = await Emp_onboarding.findByPk(team_lead);
      if (!teamLeadExists) {
        throw new Error("Invalid team lead ID.");
      }
    }

    // Update the project board data
    await project.update({ ...projectData, team_lead });

    // Update the assigned members if provided
    if (assignedMembers) {
      // Remove existing members and add the new ones
      await project.setEmp_onboardings(assignedMembers);
    }

    // Fetch and return the updated project board with associations
    const updatedProjectBoard = await ProjectBoard.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "teamLead",
          // attributes: ["id", "emp_name"],
        },
        {
          model: Emp_onboarding,
          through: { attributes: [] },
        },
      ],
    });

    return updatedProjectBoard;
  } catch (error) {
    console.error("Error updating project board:", error);
    throw error;
  }
};

const deleteProjectBoard = async (id) => {
  try {
    const deleted = await ProjectBoard.destroy({
      where: { id: id },
    });
    if (!deleted) {
      throw new Error("Project Board not found");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProjectBoard,
  getProjectBoards,
  getProjectsByOrganization,
  getProjectBoardById,
  updateProjectBoard,
  deleteProjectBoard,
  getCompletedProjects,
  getInprogressProject,
  getProjectTitle
};
