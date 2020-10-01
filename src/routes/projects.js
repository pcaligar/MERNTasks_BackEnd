const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth.middleware");
const { check } = require("express-validator");

//Create projects
//api/projects
router.post(
  "/",
  auth,
  [check("name", "The name of the project is required").not().isEmpty()],
  projectController.createProject
);

//Get all projects
router.get("/", auth, projectController.getProjects);

//Update project by id
router.put(
  "/:id",
  auth,
  [check("name", "The name of the project is required").not().isEmpty()],
  projectController.updateProjects
);

//Dlete project by id
router.delete("/:id", auth, projectController.deleteProjects);

module.exports = router;
