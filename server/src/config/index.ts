import dotenv from "dotenv";

dotenv.config();

export type RedisConfig = {
  url: string;
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
  port: process.env.PORT || 3001,
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  } as RedisConfig,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n") || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  } as FirebaseConfig,
  apiToken: process.env.API_TOKEN || "",
} as Config;
