import axiosClient from "./axiosClient";

const ttsApi = {
  getVoices: () => axiosClient.get("/tts/voices"),
  generate: (payload) => axiosClient.post("/tts/generate", payload),
  getHistory: () => axiosClient.get("/tts/history"),
  getHistoryById: (id) => axiosClient.get(`/tts/history/${id}`)
};

export default ttsApi;
