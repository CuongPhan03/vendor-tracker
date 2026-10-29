import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { getCookie } from "./cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");

  if (accessToken) {
    config.headers.set("Authorization", "Bearer " + accessToken);
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
