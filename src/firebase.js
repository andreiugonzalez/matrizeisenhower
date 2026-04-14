// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDRH5JzB_dxybEAMef1GW4wB6HWph3AK8",
  authDomain: "matrizeisenhower-d4fb6.firebaseapp.com",
  projectId: "matrizeisenhower-d4fb6",
  storageBucket: "matrizeisenhower-d4fb6.firebasestorage.app",
  messagingSenderId: "751849742615",
  appId: "1:751849742615:web:129647466660772d625752",
  measurementId: "G-39HGB9LTKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
