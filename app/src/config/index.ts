interface AppConfig {
  VITE_API_TOKEN: string;
  VITE_BACKEND_URL: string;
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
}

const getDefaultConfig = (): AppConfig => ({
  VITE_API_TOKEN: import.meta.env.VITE_API_TOKEN || "test",
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "",
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  VITE_FIREBASE_STORAGE_BUCKET:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || "",
});

const config: AppConfig = import.meta.env.DEV
  ? getDefaultConfig()
  : window.APP_CONFIG;

export { config };
