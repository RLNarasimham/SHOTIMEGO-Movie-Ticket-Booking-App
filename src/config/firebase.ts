import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyBUxDj7bQn1hLYHbgUf44u712K-M2EiI6w",
  authDomain: "movie-ticket-booking-app-2cde9.firebaseapp.com",
  projectId: "movie-ticket-booking-app-2cde9",
  storageBucket: "movie-ticket-booking-app-2cde9.firebasestorage.app",
  messagingSenderId: "547619884262",
  appId: "1:547619884262:web:193430c2d22117f58d7f27",
  measurementId: "G-XBDMR68GZG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
