import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDStBjnf2BsWkRCcreLBpZsoMpgDxaIM7Y",
  authDomain: "lascierasfirebase.firebaseapp.com",
  projectId: "lascierasfirebase",
  storageBucket: "lascierasfirebase.appspot.com",
  messagingSenderId: "459341674379",
  appId: "1:459341674379:web:7ec81b02c3326d8c0d618e",
  measurementId: "G-TY95K22BT4",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();

export { db, auth };
