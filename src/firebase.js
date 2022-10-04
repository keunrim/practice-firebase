// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKs78uQ4kucZhPQK2Ne32Gyq2VJMnsDAw",
  authDomain: "practice-firebase-60480.firebaseapp.com",
  projectId: "practice-firebase-60480",
  storageBucket: "practice-firebase-60480.appspot.com",
  messagingSenderId: "184193693647",
  appId: "1:184193693647:web:baff45d508c3fda706c4ba",
  measufirerementId: "G-Z94WLD6ZF8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);