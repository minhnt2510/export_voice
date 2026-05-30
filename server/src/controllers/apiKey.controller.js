const ApiKey = require("../models/ApiKey");
const { createApiKeyForUser } = require("../services/apiKey.service");

const listApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ userId: req.user._id })
      .select("name keyPrefix lastUsedAt createdAt")
      .sort({ createdAt: -1 });

    res.json({ apiKeys: keys });
  } catch (error) {
    next(error);
  }
};

const createApiKey = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      const error = new Error("API key name is required");
      error.statusCode = 400;
      throw error;
    }

    const { apiKey, rawKey } = await createApiKeyForUser({
      userId: req.user._id,
      name: name.trim()
    });

    res.status(201).json({
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        createdAt: apiKey.createdAt
      },
      rawKey
    });
  } catch (error) {
    next(error);
  }
};

const deleteApiKey = async (req, res, next) => {
  try {
    const deleted = await ApiKey.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deleted) {
      const error = new Error("API key not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "API key deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listApiKeys,
  createApiKey,
  deleteApiKey
};
