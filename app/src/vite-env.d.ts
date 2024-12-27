/// <reference types="vite/client" />

declare interface Window {
  APP_CONFIG: {
    VITE_API_TOKEN: string;
    VITE_BACKEND_URL: string;
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
  };
}
