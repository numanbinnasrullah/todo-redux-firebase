import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyC5gC1s4Tvg2uzDD4dGUR5uPU7I3WrdIeY",
    authDomain: "todoapp-835f8.firebaseapp.com",
    projectId: "todoapp-835f8",
    storageBucket: "todoapp-835f8.appspot.com",
    messagingSenderId: "247115888488",
    appId: "1:247115888488:web:5a4a5c5068e65d160908dd"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app)
const auth = getAuth(app);
export {db, storage, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut}