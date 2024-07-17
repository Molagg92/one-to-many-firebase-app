import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfbZ6HYretjo9X7Pq-Uv6-BrSfsHsqJbc",
  authDomain: "one-to-many-firebase-app.firebaseapp.com",
  projectId: "one-to-many-firebase-app",
  storageBucket: "one-to-many-firebase-app.appspot.com",
  messagingSenderId: "328782373946",
  appId: "1:328782373946:web:8449bdaec63f1b82b14103",
  measurementId: "G-7FKX93LQZF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const db = getFirestore(app);