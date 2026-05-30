import axios from "axios";

const AUTH_STORAGE_KEY = "vivibe-auth";

const getStoredToken = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 30000
});

axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const token = getStoredToken();

    if (status === 401 && token) {
      clearStoredAuth();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:expired"));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
