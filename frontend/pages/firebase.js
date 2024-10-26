// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgUCexmForPE7wbwAUMCtqCQXkY5Nso8g",
  authDomain: "aijira.firebaseapp.com",
  databaseURL: "https://aijira-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aijira",
  storageBucket: "aijira.appspot.com",
  messagingSenderId: "454252345574",
  appId: "1:454252345574:web:bc7fe78ca71e52d640e327",
  measurementId: "G-N3GKHX03VN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
