// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmWIqqjp5DaPkNqAM48Yb1fVTvRoYfA0A",
  authDomain: "tracking-device-13ec6.firebaseapp.com",
  databaseURL: "https://tracking-device-13ec6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tracking-device-13ec6",
  storageBucket: "tracking-device-13ec6.appspot.com",
  messagingSenderId: "857588387128",
  appId: "1:857588387128:web:2bb9fc1c1fa949b1eb05cd",
  measurementId: "G-LEXE5TR6PL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth = getAuth(app);