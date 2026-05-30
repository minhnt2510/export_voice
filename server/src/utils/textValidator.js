const MAX_TEXT_LENGTH = Number(process.env.TTS_MAX_CHARACTERS || 5000);

const validateTextInput = (text) => {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    const error = new Error("Text is required");
    error.statusCode = 400;
    throw error;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    const error = new Error(`Text exceeds max ${MAX_TEXT_LENGTH} characters`);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  MAX_TEXT_LENGTH,
  validateTextInput
};
