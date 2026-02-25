// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAZWE_KLk1yGgai9WLD5Rp8z7mMcmSqZJU",
  authDomain: "itogames1.firebaseapp.com",
  projectId: "itogames1",
  // use the proper storage bucket host
  storageBucket: "itogames1.appspot.com",
  messagingSenderId: "154526960232",
  appId: "1:154526960232:web:ed9d945e5c1befce3709dd",
  measurementId: "G-48PJ80R9SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics can fail/throw in some mobile webviews or if the environment
// doesn't expose `window`. Guard it so initialization doesn't break.
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (err) {
  // Non-fatal: log and continue without analytics
  // This avoids breaking the app in restrictive mobile browsers/webviews.
  // Keep console.warn to help debugging if needed.
  // eslint-disable-next-line no-console
  console.warn('Firebase analytics not initialized:', err);
}

// Export services to use in your pages
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
export { app };