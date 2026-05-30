const express = require("express");
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
