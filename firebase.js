// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB2dfy1OvTTw_LIMc5BlJnvtcYX8_vMsO0",
    authDomain: "mahjong-tracker-ac2ce.firebaseapp.com",
    projectId: "mahjong-tracker-ac2ce",
    storageBucket: "mahjong-tracker-ac2ce.firebasestorage.app",
    messagingSenderId: "1051423477514",
    appId: "1:1051423477514:web:fcda81b69120b62a0f74f3"
  };
  

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  export { db, auth, provider };