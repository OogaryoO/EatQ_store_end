import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBNF-GdO7fKvHl-EWnA1z3PmMixQ62vqis",
  authDomain: "eatq-2025-tw.firebaseapp.com",
  databaseURL: "https://eatq-2025-tw-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eatq-2025-tw",
  storageBucket: "eatq-2025-tw.firebasestorage.app",
  messagingSenderId: "520220680979",
  appId: "1:520220680979:web:59bc85f3b99665e2b4f0e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;