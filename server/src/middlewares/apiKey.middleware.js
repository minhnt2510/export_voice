const ApiKey = require("../models/ApiKey");
const { hashApiKey } = require("../services/apiKey.service");

const apiKeyMiddleware = async (req, _res, next) => {
  try {
    const rawApiKey = req.headers["x-api-key"];

    if (!rawApiKey || typeof rawApiKey !== "string") {
      const error = new Error("x-api-key header is required");
      error.statusCode = 401;
      throw error;
    }

    const keyHash = hashApiKey(rawApiKey.trim());
    const apiKey = await ApiKey.findOne({ keyHash }).populate({
      path: "userId",
      select: "email credits"
    });

    if (!apiKey || !apiKey.userId) {
      const error = new Error("Invalid API key");
      error.statusCode = 401;
      throw error;
    }

    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    req.apiKey = apiKey;
    req.apiUser = apiKey.userId;

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

module.exports = apiKeyMiddleware;
