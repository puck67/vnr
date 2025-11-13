import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAKbO7kWxO6_Wd5IR9vBOeEQsXEKXBSpks",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hcmmmmmm-1d626.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://hcmmmmmm-1d626-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcmmmmmm-1d626",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hcmmmmmm-1d626.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "215321433779",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:215321433779:web:5407188378eb645fc742c6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-WM4Q8JND4H"
};

// Initialize Firebase
let app;
let database: Database;

if (typeof window !== 'undefined') {
  // Client-side only
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

export { database };
export default app;
