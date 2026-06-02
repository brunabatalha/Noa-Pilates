// Firebase initialization for Noa Pilates
// These keys are public-by-design — security comes from Firestore rules.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7KnanFNsiIQR_WV-V3oYl_8pa1ZrszTo",
  authDomain: "noa-pilates.firebaseapp.com",
  projectId: "noa-pilates",
  storageBucket: "noa-pilates.firebasestorage.app",
  messagingSenderId: "78715165917",
  appId: "1:78715165917:web:56ccd17c0b871d0bb48f34"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
