const crypto = require("crypto");
const ApiKey = require("../models/ApiKey");

const hashApiKey = (rawKey) => {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};

const generateRawApiKey = () => {
  return `vvb_${crypto.randomBytes(24).toString("hex")}`;
};

const createApiKeyForUser = async ({ userId, name }) => {
  const rawKey = generateRawApiKey();
  const keyHash = hashApiKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);

  const apiKey = await ApiKey.create({
    userId,
    name,
    keyHash,
    keyPrefix
  });

  return { apiKey, rawKey };
};

module.exports = {
  hashApiKey,
  generateRawApiKey,
  createApiKeyForUser
};
