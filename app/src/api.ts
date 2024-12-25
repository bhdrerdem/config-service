import axios from "axios";
import { auth } from "./firebase";

// TODO: get from environment variable
const PREDEFINED_API_TOKEN = "test";

// TODO: get from environment variable
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.method === "get") {
      config.headers["Authorization"] = `Bearer ${PREDEFINED_API_TOKEN}`;
    } else {
      const idToken = await auth.currentUser?.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
