import axiosClient from "./axiosClient";

const creditApi = {
  getBalance: () => axiosClient.get("/credits/balance"),
  getHistory: () => axiosClient.get("/credits/history")
};

export default creditApi;
