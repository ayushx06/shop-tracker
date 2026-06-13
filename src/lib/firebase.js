import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔧 REPLACE THESE WITH YOUR FIREBASE PROJECT CONFIG
// Go to: Firebase Console → Your Project → Project Settings → Your Apps → Web App → Config
const firebaseConfig = {
  apiKey: "AIzaSyCFVN_99oAxm0L0YpeZPvWJg4M44EZpP-U",
  authDomain: "data-19182.firebaseapp.com",
  projectId: "data-19182",
  storageBucket: "data-19182.firebasestorage.app",
  messagingSenderId: "347591512293",
  appId: "1:347591512293:web:301172fecea922414f040c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
