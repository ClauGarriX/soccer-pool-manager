import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc_xEJI6PFL8-ssQBGFlmpcqCfwoHWsJ0",
  authDomain: "soccer-pool-app.firebaseapp.com",
  databaseURL: "https://soccer-pool-app-default-rtdb.firebaseio.com",
  projectId: "soccer-pool-app",
  storageBucket: "soccer-pool-app.firebasestorage.app",
  messagingSenderId: "361119692459",
  appId: "1:361119692459:web:2f2b4b61b1ca51a5d9a9ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);