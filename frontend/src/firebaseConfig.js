// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcJTW4BSCcp7IxOS0Q_h6na8LkLjZAxw4",
  authDomain: "hotel-management-a8994.firebaseapp.com",
  projectId: "hotel-management-a8994",
  storageBucket: "hotel-management-a8994.firebasestorage.app",
  messagingSenderId: "781769966639",
  appId: "1:781769966639:web:e93aacb6f097006f8772da",
  measurementId: "G-FTD49RPRS0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
