import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFA5zt5zQt1Q7TZYrVj2TlJYJ-QBZunWo",
  authDomain: "album-f8cf3.firebaseapp.com",
  projectId: "album-f8cf3",
  storageBucket: "album-f8cf3.firebasestorage.app",
  messagingSenderId: "407537051447",
  appId: "1:407537051447:web:cbcebe5c7e3bb7e4f79cb2",
  measurementId: "G-0JYPNPRZ5H"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);