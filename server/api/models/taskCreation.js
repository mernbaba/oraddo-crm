const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Emp_onboarding = require("./Emp_onboarding");
const ProjectBoard = require("./projectBoardCreation");

const Tasks = sequelize.define("Tasks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // fromdate: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // todate: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  segment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      "Pending",
      "In Progress",
      "Completed",
      "Overdue",
      "Achieved"
    ),
    allowNull: true,
  },
  team_lead_status: {
    type: DataTypes.ENUM("Approved", "Declined"),
    allowNull: true,
  },
  reward_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  elapsed_time: {
    type: DataTypes.STRING, // Stored in hh:mm:ss format
    defaultValue: "00:00:00",
  },
  last_pause_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  running: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // new feilds

  startTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pauseTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ResumeTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recent_startTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taskDidTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  RecentTimeStatus: {
    type: DataTypes.ENUM("Start", "Pause", "Resume", "Complete"),
    allowNull: true,
  },
  isDecliane: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  organizationID: {
    type: DataTypes.INTEGER,
    allowNull: null,
  },
  tlstatusupdate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reshedule_time: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // repeat: {
  //   type: DataTypes.BOOLEAN,
  //   // defaultValue: true,
  //   allowNull: true,
  // },
  repeat_active: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
    allowNull: true,
  },
  recurrence_types: {
    type: DataTypes.ENUM("onetime", "daily", "weekly", "monthly"),
    allowNull: true,
  },
  recurrence_weekly_name: {
    type: DataTypes.INTEGER, // Store day as a number (Sunday = 0, Monday = 1, etc.)
    allowNull: true,
  },
  recurrence_task_date:{
    type:DataTypes.DATE,
    allowNull:true,
  },
  empOnboardingId: {
    type: DataTypes.INTEGER,
    references: {
      model: Emp_onboarding, // Referencing the Emp_onboarding model
      key: "id", // Primary key of Emp_onboarding
    },
    allowNull: true, // Allow null if a task does not belong to an onboarding
  },
  ProjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: ProjectBoard, // Referencing the Project model
      key: "id", // Primary key of Project
    },
    allowNull: true, // Allow null if a task does not belong to a project
  },
});

module.exports = Tasks;
