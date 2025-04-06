import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API,
  authDomain: "nu-mindify.firebaseapp.com",
  databaseURL: import.meta.env.VITE_DB,
  projectId: "nu-mindify",
  storageBucket: "nu-mindify.firebasestorage.app",
  messagingSenderId: "342146446671",
  appId: import.meta.env.VITE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app)