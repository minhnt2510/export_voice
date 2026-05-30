const express = require("express");
const { generateFromPublicApi } = require("../controllers/public.controller");
const apiKeyMiddleware = require("../middlewares/apiKey.middleware");

const router = express.Router();

router.post("/tts", apiKeyMiddleware, generateFromPublicApi);

module.exports = router;
