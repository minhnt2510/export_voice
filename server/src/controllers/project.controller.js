const Project = require("../models/Project");
const TTSHistory = require("../models/TTSHistory");

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    res.json({ projects });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const normalizedName = typeof name === "string" && name.trim() ? name.trim() : "Untitled project";

    const project = await Project.create({
      userId: req.user._id,
      name: normalizedName
    });

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      const error = new Error("Project name is required");
      error.statusCode = 400;
      throw error;
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        name: name.trim()
      },
      {
        new: true
      }
    );

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    await TTSHistory.deleteMany({
      projectId: project._id,
      userId: req.user._id
    });

    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject
};
