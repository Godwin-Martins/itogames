// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAZWE_KLk1yGgai9WLD5Rp8z7mMcmSqZJU",
  authDomain: "itogames1.firebaseapp.com",
  projectId: "itogames1",
  storageBucket: "itogames1.appspot.com",
  messagingSenderId: "154526960232",
  appId: "1:154526960232:web:ed9d945e5c1befce3709dd",
  measurementId: "G-48PJ80R9SW"
};

const app = initializeApp(firebaseConfig);
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (err) {
  console.warn('Firebase analytics not initialized:', err);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
export { app };