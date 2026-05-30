const TTSHistory = require("../models/TTSHistory");
const { validateTextInput } = require("../utils/textValidator");
const { ensureEnoughCredits, deductCredits } = require("../services/credit.service");
const { generateSpeech } = require("../services/tts.service");

const generateFromPublicApi = async (req, res, next) => {
  try {
    const { text, voice = "vi-VN-NamMinhNeural", speed = 1, pause = 100 } = req.body;

    validateTextInput(text);

    const userId = req.apiUser._id;
    const characterCount = text.length;
    const creditUsed = characterCount;

    await ensureEnoughCredits(userId, creditUsed);

    let speech;
    try {
      speech = await generateSpeech({ text, voice, speed, pause });
    } catch (ttsError) {
      const error = new Error(`TTS generation failed: ${ttsError.message}`);
      error.statusCode = 500;
      throw error;
    }
    const remainingCredits = await deductCredits({
      userId,
      amount: creditUsed,
      description: `Public API generate (${characterCount} chars)`
    });

    const history = await TTSHistory.create({
      userId,
      projectId: null,
      text,
      voice,
      speed,
      pause,
      audioUrl: speech.audioUrl,
      characterCount,
      creditUsed,
      duration: speech.duration ?? null,
      status: "success",
      errorMessage: null
    });

    res.status(201).json({
      audioUrl: speech.audioUrl,
      provider: speech.provider,
      remainingCredits,
      historyId: history._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFromPublicApi
};
