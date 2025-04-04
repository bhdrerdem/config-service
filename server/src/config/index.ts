import dotenv from "dotenv";

dotenv.config();

export type CacheConfig = {
  host: string;
  isDisabled: boolean;
};

export type FirebaseConfig = {
  projectId: string;
  privateKey: string;
  clientEmail: string;
};

export type Config = {
  port: number;
  cache: CacheConfig;
  firebase: FirebaseConfig;
  apiToken: string;
};

export default {
  port: process.env.PORT || 8080,
  cache: {
    host: process.env.CACHE_HOST || "localhost",
    isDisabled: process.env.CACHE_DISABLED === "true",
  } as CacheConfig,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n") || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  } as FirebaseConfig,
  apiToken: process.env.API_TOKEN || "",
} as Config;
