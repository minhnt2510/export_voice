import axiosClient from "./axiosClient";

const apiKeyApi = {
  getAll: () => axiosClient.get("/api-keys"),
  create: (payload) => axiosClient.post("/api-keys", payload),
  remove: (id) => axiosClient.delete(`/api-keys/${id}`)
};

export default apiKeyApi;
