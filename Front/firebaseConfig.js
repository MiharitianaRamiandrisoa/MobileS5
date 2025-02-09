// Importation correcte pour Firebase v9+
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2CL1ehxqK4LnS8g1ll5GKfA4MdyMd0Qg",
  authDomain: "api-mobile-s5.firebaseapp.com",
  projectId: "api-mobile-s5",
  storageBucket: "api-mobile-s5.appspot.com", // Correction ici
  messagingSenderId: "867481294529",
  appId: "1:867481294529:web:de2ef78e6ec9ce2e07a640",
  measurementId: "G-12MQEP7M69"
};

// Initialisation de Firebase (évite les doublons)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportation des services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };  

