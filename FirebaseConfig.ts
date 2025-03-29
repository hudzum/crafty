// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHOpx9Bd3_Hr-kqhmPivCXQLhM9FcJsqc",
  authDomain: "crafty-cb884.firebaseapp.com",
  projectId: "crafty-cb884",
  storageBucket: "crafty-cb884.firebasestorage.app",
  messagingSenderId: "48648639875",
  appId: "1:48648639875:web:06137de19452ca1f7dd2b6",
  measurementId: "G-GL8TB3NRW0"
};

// Initialize Firebase
export const  app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);