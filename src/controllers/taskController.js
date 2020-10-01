const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

//Create new task
exports.createTask = async (req, res) => {
  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Destructuring to get the project
    const { project } = req.body;

    //Checking if the project exist
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Reviewing if the current project belong to the user authenticated
    if (existingProject.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Create task and save
    const task = new Task(req.body);
    await task.save();

    //return
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in task controller, createTask method");
  }
};

//Get all tasks by project
exports.getTasks = async (req, res) => {
  try {
    //Destructuring to get the project
    const { project } = req.body;

    //Checking if the project exist
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Reviewing if the current project belong to the user authenticated
    if (existingProject.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Get tasks by projects
    const tasks = await Task.find({ project });

    //return
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in task controller, getTasks method");
  }
};

//Update a task
exports.updateTask = async (req, res) => {
  try {
    //Destructuring to get the project, name and state
    const { project, name, state } = req.body;

    //Checking if the project exist
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Reviewing if the current project belong to the user authenticated
    if (existingProject.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Checking if the task exist
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    //Create a task with the new information
    const newTask = {};
    //If the user send the name to update it, replaces it
    if (name) newTask.name = name;
    //If the user send the state to update it, replaces it
    if (state) newTask.state = state;

    const taskToReturn = await Task.findOneAndUpdate(
      { _id: req.params.id },
      newTask,
      { new: true }
    );

    //return
    res.json(taskToReturn);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in task controller, updateTasks method");
  }
};

//Delete Task
exports.deleteTask = async (req, res) => {
  try {
    //Destructuring to get the project, name and state
    const { project } = req.body;

    //Checking if the project exist
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Reviewing if the current project belong to the user authenticated
    if (existingProject.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Checking if the task exist
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    //Delete task
    await Task.findOneAndRemove({ _id: req.params.id });

    //return
    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in task controller, deleteTask method");
  }
};
