const TTSHistory = require("../models/TTSHistory");
const Project = require("../models/Project");
const { VOICES } = require("../constants/voices");
const { validateTextInput } = require("../utils/textValidator");
const { ensureEnoughCredits, deductCredits } = require("../services/credit.service");
const { generateSpeech } = require("../services/tts.service");

const generate = async (req, res, next) => {
  try {
    const { text, voice = "vi-VN-NamMinhNeural", speed = 1, pause = 100, projectId = null } = req.body;

    validateTextInput(text);

    if (projectId) {
      const project = await Project.findOne({ _id: projectId, userId: req.user._id });

      if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
      }
    }

    const characterCount = text.length;
    const creditUsed = characterCount;

    await ensureEnoughCredits(req.user._id, creditUsed);

    let speech;
    try {
      speech = await generateSpeech({ text, voice, speed, pause });
    } catch (ttsError) {
      const error = new Error(`TTS generation failed: ${ttsError.message}`);
      error.statusCode = 500;
      throw error;
    }

    const remainingCredits = await deductCredits({
      userId: req.user._id,
      amount: creditUsed,
      description: `Generate audio (${characterCount} chars)`
    });

    const history = await TTSHistory.create({
      userId: req.user._id,
      projectId,
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

    const historyPayload = {
      id: history._id,
      text: history.text,
      voice: history.voice,
      speed: history.speed,
      pause: history.pause,
      audioUrl: history.audioUrl,
      characterCount: history.characterCount,
      creditUsed: history.creditUsed,
      duration: history.duration,
      createdAt: history.createdAt
    };

    res.status(201).json({
      message: "Tao voice thanh cong",
      audio: {
        audioUrl: speech.audioUrl,
        fileName: speech.fileName,
        duration: speech.duration ?? null
      },
      history: historyPayload,
      user: {
        credits: remainingCredits
      },
      audioUrl: speech.audioUrl,
      remainingCredits,
      provider: speech.provider,
      characterCount,
      creditUsed,
      historyId: history._id
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await TTSHistory.find({ userId: req.user._id })
      .populate({ path: "projectId", select: "name" })
      .sort({ createdAt: -1 });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

const getHistoryById = async (req, res, next) => {
  try {
    const item = await TTSHistory.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate({ path: "projectId", select: "name" });

    if (!item) {
      const error = new Error("History not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ history: item });
  } catch (error) {
    next(error);
  }
};

const getVoices = (_req, res) => {
  res.json({ voices: VOICES });
};

module.exports = {
  generate,
  getHistory,
  getHistoryById,
  getVoices
};
