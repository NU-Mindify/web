import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API,
  authDomain: "nu-mindify.firebaseapp.com",
  databaseURL: import.meta.env.VITE_DB,
  projectId: "nu-mindify",
  storageBucket: "nu-mindify.firebasestorage.app",
  messagingSenderId: "342146446671",
  appId: import.meta.env.VITE_APPID,
};

// Main app (used across the app)
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

// ✅ Secondary app (used only for creating new accounts)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { firebaseAuth, secondaryAuth };
export default app;
