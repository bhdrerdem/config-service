import dotenv from "dotenv";

dotenv.config();

export type RedisConfig = {
  host: string;
};

export type FirebaseConfig = {
  projectId: string;
  privateKey: string;
  clientEmail: string;
};

export type Config = {
  port: number;
  redis: RedisConfig;
  firebase: FirebaseConfig;
  apiToken: string;
};

export default {
  port: process.env.PORT || 8080,
  redis: {
    host: process.env.REDIS_HOST || "localhost",
  } as RedisConfig,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n") || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  } as FirebaseConfig,
  apiToken: process.env.API_TOKEN || "",
} as Config;
