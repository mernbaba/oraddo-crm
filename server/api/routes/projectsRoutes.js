const express = require("express");
const projectController = require("../controllers/projectsController");
// const { Middleware } = require('../middleware/authMiddleware');
// console.log(projectController, "ajhhjhjhj");
const router = express.Router();

router.post("/projects", projectController.createProject);
router.post(
  "/updateProjectDatapoints",
  projectController.updateProjectDatapoints
);
router.get("/projects", projectController.getProjects);
router.get(
  "/projectsbyorganization/:id",
  projectController.getProjectsByOrganization
);
router.get("/projects/:id", projectController.getProjectById);
router.get("/getprojectById/:id",projectController.getprojectDetailsById)
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);



router.get("/export-project/:id",projectController.getExportProjects)



module.exports = router;
