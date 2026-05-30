import axiosClient from "./axiosClient";

const projectApi = {
  getAll: () => axiosClient.get("/projects"),
  create: (payload) => axiosClient.post("/projects", payload),
  getById: (id) => axiosClient.get(`/projects/${id}`),
  update: (id, payload) => axiosClient.put(`/projects/${id}`, payload),
  remove: (id) => axiosClient.delete(`/projects/${id}`)
};

export default projectApi;
