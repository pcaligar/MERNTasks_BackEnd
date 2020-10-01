const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth.middleware");
const { check } = require("express-validator");

// api/tasks
//create Task
router.post(
  "/",
  auth,
  [
    check("name", "The name is required").not().isEmpty(),
    check("project", "The project is required").not().isEmpty(),
  ],
  taskController.createTask
);

//Get all tasks by project
router.get("/", auth, taskController.getTasks);

//Get all tasks by project
router.put("/:id", auth, taskController.updateTask);

//Delete task
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
