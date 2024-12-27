import axios from "axios";
import { auth } from "../firebase";
import { config } from "../config";

const PREDEFINED_API_TOKEN = config.VITE_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: `${config.VITE_BACKEND_URL}/api/v1`,
  timeout: 5000,
});

export function useApi() {
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        if (config.method === "get") {
          config.headers["Authorization"] = `${PREDEFINED_API_TOKEN}`;
        } else {
          const idToken = await auth.currentUser?.getIdToken();
          config.headers.Authorization = `${idToken}`;
        }
      } catch (err) {
        console.error("Error setting headers: ", err);
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return {
    axiosInstance,
  };
}
