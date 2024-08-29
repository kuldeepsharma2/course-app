// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  
  apiKey: "AIzaSyBFOPGVCYm-r217ejZcqASYjzU_Zu1Ueo4",
  authDomain: "course-app-43e88.firebaseapp.com",
  projectId: "course-app-43e88",
  storageBucket: "course-app-43e88.appspot.com",
  messagingSenderId: "972001144802",
  appId: "1:972001144802:web:ff8747716e6ca3bb7b93bb",
  measurementId: "G-8HG9PWVKCM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db,storage };
