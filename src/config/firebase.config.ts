import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
});

export const firebaseAuth = getAuth(firebaseApp);
