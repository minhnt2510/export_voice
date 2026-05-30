const express = require("express");
const { listApiKeys, createApiKey, deleteApiKey } = require("../controllers/apiKey.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listApiKeys);
router.post("/", createApiKey);
router.delete("/:id", deleteApiKey);

module.exports = router;
