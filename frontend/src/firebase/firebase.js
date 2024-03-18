// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-mern-4aaf2.firebaseapp.com",
  projectId: "blog-mern-4aaf2",
  storageBucket: "blog-mern-4aaf2.appspot.com",
  messagingSenderId: "1040842865988",
  appId: "1:1040842865988:web:a04160467be9540f69ab11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);