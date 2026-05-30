const express = require("express");
const { generate, getHistory, getHistoryById, getVoices } = require("../controllers/tts.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/voices", getVoices);
router.post("/generate", generate);
router.get("/history", getHistory);
router.get("/history/:id", getHistoryById);

module.exports = router;
