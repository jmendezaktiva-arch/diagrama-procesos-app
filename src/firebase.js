// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "pcs-app-c5fe6.firebaseapp.com",
  projectId: "pcs-app-c5fe6",
  storageBucket: "pcs-app-c5fe6.firebasestorage.app",
  messagingSenderId: "528107952052",
  appId: "1:528107952052:web:a9aac6f1d32cbcbd1584e1"
};

// 1. Inicializamos la App
const app = initializeApp(firebaseConfig);

// 2. Inicializamos la Base de Datos
const db = getFirestore(app);

// 3. Inicializamos la Autenticación (NUEVO)
const auth = getAuth(app);

// 4. Exportamos ambas herramientas
export { db, auth };
