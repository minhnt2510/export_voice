const mongoose = require("mongoose");

const ttsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },
    text: {
      type: String,
      required: true
    },
    voice: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      default: 1
    },
    pause: {
      type: Number,
      default: 100
    },
    audioUrl: {
      type: String,
      required: true
    },
    characterCount: {
      type: Number,
      required: true
    },
    creditUsed: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("TTSHistory", ttsHistorySchema);
