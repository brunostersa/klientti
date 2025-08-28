import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Configurações do Firebase para o projeto Klientti
// Projeto: klientti-640d4
// Domínio: klientti-640d4.firebaseapp.com

const firebaseConfig = {
  apiKey: "AIzaSyDVyqJFUICzq3o7dltH6mp5hX8XyqjReVM",
  authDomain: "klientti-640d4.firebaseapp.com",
  projectId: "klientti-640d4",
  storageBucket: "klientti-640d4.firebasestorage.app",
  messagingSenderId: "312229310073",
  appId: "1:312229310073:web:853fd246d899fd73002ea8",
  measurementId: "G-426PNT15KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
