import axios from "axios";
import { auth } from "../firebase";

// Environment değişkeninden alınması önerilir.
const PREDEFINED_API_TOKEN = "test";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/v1",
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
