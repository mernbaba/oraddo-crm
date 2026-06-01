const Emp_onboarding = require("../models/Emp_onboarding");
const Salary_Management = require("../models/salaryManagement");
const Salary_Advance_Loan = require("../models/salary_advance_loan");
const Team_Performance = require("../models/team_performance");
const LeaveCreation = require("../models/leavesCreation");
const ReportSubmission = require("../models/report_submission");
const Emp_Roles = require("../models/empRoles");
const Department = require("../models/Department");
const Dep_Modules = require("../models/Modules");
const Attendance = require("../models/attendence");
const Praposals = require("../models/ProposalQuotation");
const praposalService = require("../models/praposalServices");
const Task = require("../models/taskCreation");
const Employee_documents = require("../models/empDocuments");
const Meetings = require("../models/meetingsEvents");
const EmployeeNotes = require("../models/notes");
const EmployeeExpenses = require("../models/employeeExpenses");
const Projects = require("../models/projects");
const EmpResignationProcess = require("../models/empResignationProcess");
const GratuitySettlements = require("../models/GratuitySettlement");
const Survey = require("../models/formSurvey");
const Response = require("../models/formResponse");
const Question = require("../models/formQuestions");
const invoiveModulePoints = require("../models/invoiceModule");
const InvoiceManagement = require("../models/InvoiceManagement");
const LeadCreation = require("../models/leadCreation");
const FAQ = require("../models/faq");
const EmployeeFinalSettlement = require("../models/employeeFinalSettlement");
const DataPoints = require("../models/Datapoints");
const blogModelDb = require("../models/blogCreation");
const ProjectBoard = require("../models/projectBoardCreation");
const Sprints = require("../models/projectSprints");
const Tasks = require("../models/taskCreation");
const Notification = require("../models/Notifications");
const Module = require("../models/trainingModule");
const Lesson = require("../models/lessionsModule");
const TraineeLessonStatus = require("../models/moduleTraineLessionStatus");
const { Message } = require("../models/ChatModel");
const PremiumPlan = require("../models/premiumPlans");
const Organization = require("../models/OrganizationModule");
const GroupChat = require("../models/GroupModel");
const OrganizationInvoices = require("../models/organizationInvoiceModule");
const invoiveModuleService = require("../models/invoiceModuleServices");
const assetsImages = require("../models/assetsImageModel");
const mainImage = require("../models/imagesModel");
const testCandidate = require("../models/testFormName");
const HrPanel = require("../models/HrPanel");
const EmployeeLetter = require('../models/EmployeeDocumentationModel');
const Announcement = require("../models/announcement");
const GroupMessage = require("../models/GroupMessages");

const defineAssociations = () => {

  Emp_onboarding.hasMany(EmployeeLetter, {
    foreignKey: "emp_id",
    as: "letters"
  })
  EmployeeLetter.belongsTo(Emp_onboarding,{
  foreignKey: "emp_id",
  as:"employeeLetters"
})
  Organization.hasMany(HrPanel, {
    foreignKey: "organizationID",
    as: "panel_data",
  });
  HrPanel.belongsTo(Organization, {
    foreignKey: "organizationID",
    as: "organization_panel_data",
  });

  Organization.hasMany(OrganizationInvoices, {
    foreignKey: "organizationId",
    as: "CompanyInvoices",
  });
  OrganizationInvoices.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "CompanyInvoices",
  });

  PremiumPlan.hasMany(OrganizationInvoices, {
    foreignKey: "planId",
    as: "organizationInvoice_plan",
  });
  OrganizationInvoices.belongsTo(PremiumPlan, {
    foreignKey: "planId",
    as: "organizationInvoice_plan",
  });

  Organization.belongsTo(PremiumPlan, {
    foreignKey: "planId",
    as: "organization_plan",
  });
  PremiumPlan.hasMany(Organization, {
    foreignKey: "planId",
    as: "organization_plan",
  });

  Organization.hasMany(Emp_onboarding, {
    foreignKey: "orgnaizationId",
    as: "Employees_data",
  });
  Emp_onboarding.belongsTo(Organization, {
    foreignKey: "orgnaizationId",
    as: "organization_Employees",
  });


  Organization.hasMany(Announcement,{
    foreignKey:"organizationID",
    as:"organizationAnnouncements"
  });
  Announcement.belongsTo(Organization,{
    foreignKey:"organizationID",
    as:"announcementOfOrganization"
  });

  Emp_onboarding.hasMany(Announcement,{
    foreignKey:"senderId",
    as:"emp_announcement"
  });
  Announcement.belongsTo(Emp_onboarding,{
    foreignKey:"senderId",
    as:"senderDetails"
  });



  // Organization.belongsTo(PremiumPlan, { foreignKey: 'planId', as: 'organization_plan' });
  // PremiumPlan.hasMany(Organization, { foreignKey: 'planId', as: 'organization_plan' });

  Module.hasMany(Lesson, { foreignKey: "moduleId", as: "lessons" });
  Lesson.belongsTo(Module, { foreignKey: "moduleId", as: "module_lessons" });

  Module.belongsToMany(Emp_onboarding, {
    through: "ModuleTrainees",
    as: "trainees",
  });
  Emp_onboarding.belongsToMany(Module, {
    through: "ModuleTrainees",
    as: "modules",
  });

  Lesson.hasMany(TraineeLessonStatus, {
    foreignKey: "lessonId",
    as: "statuses",
  });
  TraineeLessonStatus.belongsTo(Lesson, { foreignKey: "lessonId" });
  TraineeLessonStatus.belongsTo(Emp_onboarding, { foreignKey: "traineeId" });

  Emp_onboarding.hasOne(Notification, {
    foreignKey: "userId",
    as: "employee_notification",
  });

  Notification.belongsTo(Emp_onboarding, {
    foreignKey: "userId",
    as: "notification_data",
  });

  Emp_onboarding.hasOne(Salary_Management, {
    foreignKey: "empOnboardingId",
    as: "employee_salaries",
  });

  Salary_Management.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "salary_management",
  });

  Emp_onboarding.hasMany(FAQ, {
    foreignKey: "employeeID",
    as: "questions",
  });

  Projects.belongsToMany(DataPoints, {
    through: "ProjectDataPoints",
  });

  DataPoints.belongsToMany(Projects, {
    through: "ProjectDataPoints",
  });

  FAQ.belongsTo(Emp_onboarding, {
    foreignKey: "employeeID",
    as: "FAQ_Employee",
  });

  EmployeeFinalSettlement.belongsTo(Emp_onboarding, {
    foreignKey: "emp_onboarding_id",
    as: "Emp_FinalSettlements",
  });

  Emp_onboarding.hasOne(EmployeeFinalSettlement, {
    foreignKey: "emp_onboarding_id",
    as: "FinalSettlements",
  });

  Projects.hasMany(LeadCreation, {
    foreignKey: "projectId",
    as: "projectLeads",
  });
  LeadCreation.belongsTo(Projects, {
    foreignKey: "projectId",
    as: "LeadProjects",
  });

  Emp_onboarding.belongsToMany(Projects, {
    through: "EmployeeProjects",
  });

  Projects.belongsToMany(Emp_onboarding, {
    through: "EmployeeProjects",
  });

  Survey.hasMany(Question, {
    foreignKey: "survey_id",
    as: "questions",
  });

  Question.belongsTo(Survey, {
    foreignKey: "survey_id",
    as: "survey",
  });

  Emp_onboarding.hasMany(Survey, {
    foreignKey: "created_by",
    as: "Employee_Survey",
  });

  Survey.belongsTo(Emp_onboarding, {
    foreignKey: "created_by",
    as: "Surveys",
  });

  Survey.hasMany(Response, {
    foreignKey: "QuestionSurvey_id",
    as: "Response_Surveys",
  });

  Response.belongsTo(Survey, {
    foreignKey: "QuestionSurvey_id",
    as: "Response",
  });

  Emp_onboarding.hasMany(Response, {
    foreignKey: "user_id",
    as: "Users_Response",
  });

  Response.belongsTo(Emp_onboarding, {
    foreignKey: "user_id",
    as: "Users",
  });

  Question.hasMany(Response, {
    foreignKey: "question_id",
    as: "Question_Response",
  });

  Response.belongsTo(Question, {
    foreignKey: "question_id",
    as: "Questions",
  });
  Emp_onboarding.belongsToMany(Meetings, {
    through: "EventAttendees",
  });

  Meetings.belongsToMany(Emp_onboarding, {
    through: "EventAttendees",
  });

  Emp_onboarding.hasMany(Meetings, {
    foreignKey: "createdBy",
    as: "EmployeeMettings",
  });

  Meetings.belongsTo(Emp_onboarding, {
    foreignKey: "createdBy",
    as: "Meeting",
  });

  Emp_onboarding.hasMany(Employee_documents, {
    foreignKey: "employeeid",
    as: "employeedocuments",
  });
  Employee_documents.belongsTo(Emp_onboarding, {
    foreignKey: "employeeid",
    as: "DocumentsofEmployee",
  });
  EmployeeExpenses.hasMany(Employee_documents, {
    foreignKey: "expensesId",
    as: "expensesdocuments",
  });

  Employee_documents.belongsTo(EmployeeExpenses, {
    foreignKey: "expensesId",
    as: "documents",
  });

  Emp_onboarding.hasMany(Salary_Advance_Loan, {
    foreignKey: "empOnboardingId",
    as: "Employee_Advance_Salary",
  });

  Salary_Advance_Loan.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "salary_advance",
  });

  Emp_onboarding.hasMany(Emp_onboarding, {
    as: "teamMembers",
    foreignKey: "teamLeadId",
  });

  Emp_onboarding.belongsTo(Emp_onboarding, {
    as: "teamLead",
    foreignKey: "teamLeadId",
  });

  Emp_onboarding.hasMany(Team_Performance, {
    foreignKey: "empOnboardingId",
    as: "Emp_teamPerformance",
  });

  Team_Performance.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "teamPerformance",
  });
  Emp_onboarding.hasMany(LeaveCreation, {
    foreignKey: "empOnboardingId",
    as: "Employee_LeaveCreation",
  });

  LeaveCreation.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "LeaveCreation",
  });

  // Emp_onboarding has many LeaveCreation by TeamLeadId
  Emp_onboarding.hasMany(LeaveCreation, {
    foreignKey: "TeamLeadId",
    as: "teamMembersLeaves",
  });

  LeaveCreation.belongsTo(Emp_onboarding, {
    foreignKey: "TeamLeadId",
    as: "teamMemebersLeaves",
  });

  Emp_onboarding.hasMany(Task, {
    foreignKey: "empOnboardingId",
    as: "Employeetask",
  });

  Task.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "taskOfEmploye",
  });

  ReportSubmission.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId",
    as: "reportSubmission",
  });
  Emp_onboarding.hasMany(ReportSubmission, {
    foreignKey: "empOnboardingId",
    as: "Employee_Reports",
  });

  // Define association in the Sprints model
  Sprints.belongsTo(Emp_onboarding, {
    foreignKey: "empOnboardingId", // Matches the column in your table
    as: "SprintsCreation", // Alias for association
  });
  Emp_onboarding.hasMany(Sprints, {
    foreignKey: "empOnboardingId",
    as: "Employee_ProjectSprint", // Alias for association
  });

  Tasks.belongsTo(ProjectBoard, {
    foreignKey: "ProjectId",
    as: "ProjectCreation",
  });

  ProjectBoard.hasMany(Tasks, {
    foreignKey: "ProjectId",
    as: "task_projectData",
  });

  invoiveModuleService.belongsTo(InvoiceManagement, {
    foreignKey: "InvoiceId",
    as: "invoiceCreation",
  });

  InvoiceManagement.hasMany(invoiveModuleService, {
    foreignKey: "InvoiceId",
    as: "serviceInvoiceData",
  });

  Emp_onboarding.belongsToMany(Emp_Roles, {
    through: "Employee_Roles",
  });

  Emp_Roles.belongsToMany(Emp_onboarding, {
    through: "Employee_Roles",
  });

  // Department.belongsToMany(Dep_Modules, {
  //   through: "Dep_modules",
  // });

  // Dep_Modules.belongsToMany(Department, {
  //   through: "Dep_modules",
  // });

  PremiumPlan.belongsToMany(Dep_Modules, {
    through: "Plan_modules",
  });

  Dep_Modules.belongsToMany(PremiumPlan, {
    through: "Plan_modules",
  });

  Praposals.belongsToMany(praposalService, {
    through: "Praposals_PraposalServices",
  });

  praposalService.belongsToMany(Praposals, {
    through: "Praposals_PraposalServices",
  });

  invoiveModulePoints.belongsToMany(InvoiceManagement, {
    through: "invoice-modules",
  });

  InvoiceManagement.belongsToMany(invoiveModulePoints, {
    through: "invoice-modules",
  });

  Emp_onboarding.belongsToMany(ProjectBoard, {
    through: "Project_employees",
  });
  ProjectBoard.belongsToMany(Emp_onboarding, {
    through: "Project_employees",
  });

  // Emp_onboarding Model
  Emp_onboarding.hasMany(ProjectBoard, {
    foreignKey: "team_lead", // Ensure this matches your migration column
    as: "teamLeadProjects", // Alias for projects where the employee is the team lead
  });

  // ProjectBoard Model
  ProjectBoard.belongsTo(Emp_onboarding, {
    as: "teamLead", // Alias for the team lead
    foreignKey: "team_lead",
  });

  // Department.hasOne(Emp_onboarding, {
  //   foreignKey: "empDepartment",
  //   as: "employeedepartment",
  // });

  // Emp_onboarding.belongsTo(Department, {
  //   foreignKey: "empDepartment",
  //   as: "departentsOfEmp",
  // });

  Emp_onboarding.hasMany(Attendance, {
    foreignKey: "empAttendence",
    as: "employeeAttendence",
  });

  Attendance.belongsTo(Emp_onboarding, {
    foreignKey: "empAttendence",
    as: "EmployeeDetails",
  });

  Emp_onboarding.hasMany(EmployeeNotes, {
    foreignKey: "employeeId",
    as: "employeeNotes",
  });

  EmployeeNotes.belongsTo(Emp_onboarding, {
    foreignKey: "employeeId",
    as: "empnotes",
  });

  Emp_onboarding.hasMany(EmployeeExpenses, {
    foreignKey: "employeeid",
    as: "employeeExpenses",
  });

  EmployeeExpenses.belongsTo(Emp_onboarding, {
    foreignKey: "employeeid",
    as: "employee",
  });

  // Emp_onboarding.hasMany(bolgModel,{
  //   foreignKey:"empOnBoardingId",
  //   as:"employeeOnboarding"
  // })

  // bolgModel.belongsTo(Emp_onboarding,{
  //   foreignKey:"empOnBoardingId",
  //   as:"employeeOnId"
  // })

  Emp_onboarding.hasMany(blogModelDb, {
    foreignKey: "empOnBoardingId",
    as: "employeeOnboarding",
  });

  blogModelDb.belongsTo(Emp_onboarding, {
    foreignKey: "empOnBoardingId",
    as: "employeeOnId",
  });

  EmpResignationProcess.belongsTo(Emp_onboarding, {
    foreignKey: "emp_onboarding_id",
    as: "Resignation",
  });

  Emp_onboarding.hasOne(EmpResignationProcess, {
    foreignKey: "emp_onboarding_id",
    as: "emp_Resignation",
  });

  GratuitySettlements.belongsTo(Emp_onboarding, {
    foreignKey: "employee_onboarding_id",
    as: "gratuitySettlements",
  });

  Emp_onboarding.hasOne(GratuitySettlements, {
    foreignKey: "employee_onboarding_id",
    as: "emp_gratuitySettlements",
  });

  Message.hasMany(Employee_documents, {
    foreignKey: "MessageId",
    as: "messagedocuments",
  });
  Employee_documents.belongsTo(Message, {
    foreignKey: "MessageId",
    as: "DocumentsofMessage",
  });

  assetsImages.hasMany(mainImage, {
    foreignKey: "MainImageId",
    as: "assetsImage",
  });

  mainImage.belongsTo(assetsImages, {
    foreignKey: "MainImageId",
    as: "mainImage",
  });

  assetsImages.hasMany(testCandidate, {
    foreignKey: "taskId",
    as: "figmataskCandidate",
  });

  testCandidate.belongsTo(assetsImages, {
    foreignKey: "taskId",
    as: "figmaTask",
  });

  // Group ↔ Members
GroupChat.belongsToMany(Emp_onboarding, {
  through: "GroupMembers",
  foreignKey: "groupId",
  as: "members",
});

Emp_onboarding.belongsToMany(GroupChat, {
  through: "GroupMembers",
  foreignKey: "empId",
  as: "groups", // ✅ only once!
});

GroupChat.belongsTo(Emp_onboarding, {
  as: "admin",
  foreignKey: "adminId",
});

// Group ↔ Message
GroupChat.hasMany(GroupMessage, {
  foreignKey: "groupId",
  as: "messages",
  onDelete: "CASCADE",
});

GroupMessage.belongsTo(GroupChat, {
  foreignKey: "groupId",
  as: "chatGroup", // ✅ unique alias
});

GroupMessage.belongsTo(Emp_onboarding, {
  foreignKey: "senderId",
  as: "sender",
});

};

module.exports = defineAssociations;
