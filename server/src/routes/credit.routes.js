const express = require("express");
const { getBalance, getHistory } = require("../controllers/credit.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/balance", getBalance);
router.get("/history", getHistory);

module.exports = router;
