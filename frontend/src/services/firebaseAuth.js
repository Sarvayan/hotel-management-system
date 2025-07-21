import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3CdyaytCcZNWXkdsw1C9BmNJ9ZIxZqw8",
  authDomain: "villa-management-system-4211f.firebaseapp.com",
  projectId: "villa-management-system-4211f",
  storageBucket: "villa-management-system-4211f.firebasestorage.app",
  messagingSenderId: "560174310772",
  appId: "1:560174310772:web:4970e396e3355300827821",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
export const db = getFirestore(app);

export default auth;
