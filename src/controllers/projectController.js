const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Create a new project
    const project = new Project(req.body);

    //Get project's owner (user id)
    project.owner = req.user.id;

    //Save the project
    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in project controller");
  }
};

//Get all projects of the current user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({
      timestamp: -1,
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in getProjects, projectController");
  }
};

//Get all projects of the current user
exports.updateProjects = async (req, res) => {
  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Get information about project
  const { name } = req.body;

  const newProject = {};

  if (name) {
    newProject.name = name;
  }

  try {
    //Id check
    let project = await Project.findById(req.params.id);

    // //Does the project existis check
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Project owner check
    if (project.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Update
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in updateProjects, projectController");
  }
};

//Delete project by id
exports.deleteProjects = async (req, res) => {
  try {
    //Id check
    let project = await Project.findById(req.params.id);

    // //Does the project existis check
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Project owner check
    if (project.owner.toString() !== req.user.id) {
      // req.user.id, is the id included in the payload of jwt
      return res.status(404).json({ msg: "Not authorized" });
    }

    //Delete project
    await Project.findOneAndRemove({ _id: req.params.id });

    //Return
    res.json({ msg: "Project deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in deleteProjects, projectController");
  }
};
