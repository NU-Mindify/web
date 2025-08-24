import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SENDER_ID,
  appId: import.meta.env.VITE_APPID,
};

// Main app (used across the app)
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

//Secondary app (used only for creating new accounts)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { firebaseAuth, secondaryAuth };
export default app;
