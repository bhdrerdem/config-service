import axios from "axios";
import { auth } from "../firebase";

const PREDEFINED_API_TOKEN = import.meta.env.VITE_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
