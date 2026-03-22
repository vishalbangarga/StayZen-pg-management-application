import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, onSnapshot, collection, query, where, orderBy, doc, updateDoc, addDoc } from "firebase/firestore";
import { FIREBASE_CONFIG } from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail
};
