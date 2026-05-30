const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const textToSpeech = require("@google-cloud/text-to-speech");
const { EdgeTTS } = require("node-edge-tts");
const { ensureDirectoryExists, getUploadsDirectory, toPublicAudioUrl } = require("../utils/fileHelper");

const MIN_VALID_AUDIO_SIZE = 1000;
let googleClient = null;

const EDGE_VOICE_MAP = {
  "adam-3": "vi-VN-NamMinhNeural",
  "hoai-tien": "vi-VN-NamMinhNeural",
  "nam-minh": "vi-VN-NamMinhNeural",
  "nam-mien-nam": "vi-VN-NamMinhNeural",
  "nu-mien-bac": "vi-VN-HoaiMyNeural",
  "vi-VN-HoaiMyNeural": "vi-VN-HoaiMyNeural",
  "vi-VN-NamMinhNeural": "vi-VN-NamMinhNeural",
  "vi-VN-Neural2-A": "vi-VN-HoaiMyNeural",
  "vi-VN-Neural2-D": "vi-VN-NamMinhNeural"
};

const getProvider = () => {
  return (process.env.TTS_PROVIDER || "edge").toLowerCase();
};

const assertAudioFileValid = (outputPath) => {
  if (!fs.existsSync(outputPath)) {
    throw new Error("edge-tts khong tao ra file audio.");
  }

  const stat = fs.statSync(outputPath);
  if (!stat.size || stat.size < MIN_VALID_AUDIO_SIZE) {
    throw new Error("File audio tao ra bi rong hoac khong hop le.");
  }
};

const getRate = (speed) => {
  const n = Number(speed || 1);
  if (n === 0.75) {
    return "-25%";
  }
  if (n === 1) {
    return "+0%";
  }
  if (n === 1.25) {
    return "+25%";
  }
  if (n === 1.5) {
    return "+50%";
  }
  return "+0%";
};

const runEdgeTTSWithNode = async ({ text, voice, speed, outputPath }) => {
  const edgeVoice = EDGE_VOICE_MAP[voice] || "vi-VN-NamMinhNeural";
  const tts = new EdgeTTS({
    voice: edgeVoice,
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3",
    rate: getRate(speed),
    timeout: 20000
  });

  await tts.ttsPromise(text, outputPath);
  assertAudioFileValid(outputPath);
};

const runEdgeTTSWithCli = ({ text, voice, speed, outputPath }) => {
  return new Promise((resolve, reject) => {
    const edgeVoice = EDGE_VOICE_MAP[voice] || "vi-VN-NamMinhNeural";

    const args = [
      "--voice",
      edgeVoice,
      "--text",
      text,
      `--rate=${getRate(speed)}`,
      "--write-media",
      outputPath
    ];

    const child = spawn("edge-tts", args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stderr = "";
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(
        new Error(
          `Khong chay duoc edge-tts. Hay cai bang lenh: pip install edge-tts. Chi tiet: ${error.message}`
        )
      );
    });

    child.on("close", (code) => {
      if (code !== 0) {
        const errorText = `${stderr || ""} ${stdout || ""}`.toLowerCase();
        if (errorText.includes("not recognized") || errorText.includes("no such file") || errorText.includes("command not found")) {
          reject(
            new Error(
              "Khong chay duoc edge-tts. Hay cai bang lenh: pip install edge-tts va dam bao command edge-tts co trong PATH."
            )
          );
          return;
        }

        reject(new Error(`edge-tts tao audio that bai: ${stderr || "unknown error"}`));
        return;
      }

      try {
        assertAudioFileValid(outputPath);
        resolve({ stdout, stderr });
      } catch (validationError) {
        reject(validationError);
      }
    });
  });
};

const runEdgeTTS = async (params) => {
  let nodeError = null;

  try {
    await runEdgeTTSWithNode(params);
    return;
  } catch (error) {
    nodeError = error;
  }

  try {
    await runEdgeTTSWithCli(params);
  } catch (cliError) {
    const nodeMessage = nodeError ? nodeError.message : "unknown error";
    throw new Error(`node-edge-tts that bai: ${nodeMessage}. edge-tts CLI that bai: ${cliError.message}`);
  }
};

const getGoogleClient = () => {
  if (!googleClient) {
    googleClient = new textToSpeech.TextToSpeechClient();
  }

  return googleClient;
};

const generateWithGoogle = async ({ text, voice, speed, outputPath }) => {
  const client = getGoogleClient();
  const speakingRate = Number.isFinite(Number(speed)) ? Number(speed) : 1;

  const request = {
    input: { text },
    voice: {
      languageCode: "vi-VN",
      name: voice && voice.startsWith("vi-VN-Neural2-") ? voice : "vi-VN-Neural2-D"
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: Math.min(2, Math.max(0.25, speakingRate))
    }
  };

  const [response] = await client.synthesizeSpeech(request);
  if (!response.audioContent) {
    throw new Error("Google TTS tra ve file audio rong.");
  }

  const audioBuffer = Buffer.isBuffer(response.audioContent)
    ? response.audioContent
    : Buffer.from(response.audioContent, "base64");

  fs.writeFileSync(outputPath, audioBuffer);
  assertAudioFileValid(outputPath);
};

const generateWithMock = async ({ outputPath }) => {
  const samplePath = path.join(getUploadsDirectory(), "sample.mp3");
  if (!fs.existsSync(samplePath)) {
    throw new Error("Mock audio sample not found. Please add server/uploads/audio/sample.mp3");
  }

  fs.copyFileSync(samplePath, outputPath);
  assertAudioFileValid(outputPath);
};

const generateSpeech = async ({ text, voice = "vi-VN-NamMinhNeural", speed = 1, pause = 100 }) => {
  const normalizedText = typeof text === "string" ? text.trim() : "";
  if (!normalizedText) {
    throw new Error("Text khong duoc de trong.");
  }

  if (normalizedText.length > 5000) {
    throw new Error("Text khong duoc vuot qua 5000 ky tu.");
  }

  const provider = getProvider();
  const uploadsDir = getUploadsDirectory();
  await ensureDirectoryExists(uploadsDir);

  const fileName = `tts-${Date.now()}-${uuidv4()}.mp3`;
  const outputPath = path.join(uploadsDir, fileName);

  if (provider === "edge") {
    await runEdgeTTS({
      text: normalizedText,
      voice,
      speed,
      outputPath
    });
  } else if (provider === "google") {
    await generateWithGoogle({
      text: normalizedText,
      voice,
      speed,
      pause,
      outputPath
    });
  } else {
    await generateWithMock({ outputPath });
  }

  return {
    audioUrl: toPublicAudioUrl(fileName),
    filePath: outputPath,
    fileName,
    duration: null,
    provider
  };
};

module.exports = {
  generateSpeech
};
