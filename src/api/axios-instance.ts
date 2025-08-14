import axios from "axios";
import { useAuthStore } from "../state/use-auth-store";

const axiosInstance = axios.create({
  // baseURL: "/api",
  baseURL: "http://ec2-13-60-94-109.eu-north-1.compute.amazonaws.com:3333/api",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
