const fs = require("fs");
const path = require("path");

const ensureDirectoryExists = async (directoryPath) => {
  await fs.promises.mkdir(directoryPath, { recursive: true });
};

const getUploadsDirectory = () => {
  return path.join(process.cwd(), "uploads", "audio");
};

const toPublicAudioUrl = (fileName) => {
  const baseUrl =
    process.env.SERVER_URL ||
    process.env.AUDIO_BASE_URL ||
    `http://localhost:${process.env.PORT || 5001}`;
  return `${baseUrl}/uploads/audio/${fileName}`;
};

module.exports = {
  ensureDirectoryExists,
  getUploadsDirectory,
  toPublicAudioUrl
};
