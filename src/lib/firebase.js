// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config - direkt tanımlandı
const firebaseConfig = {
  apiKey: "AIzaSyBc8sfXwLYR4UKqLqcudCUALcOzUJmGQ-U",
  authDomain: "biblo2.firebaseapp.com",
  projectId: "biblo2",
  storageBucket: "biblo2.firebasestorage.app",
  messagingSenderId: "919229087958",
  appId: "1:919229087958:web:fe1cc899bb2e0b24114977",
  measurementId: "G-W85CR3QNMS"
};

// Initialize Firebase (only once)
let app;
let analytics = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics (only in browser and if supported)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("🔥 Firebase Analytics aktif!");
      }
    });
  }
} else {
  app = getApps()[0];
}

// Initialize Firebase Storage
export const storage = getStorage(app);

// Export analytics
export { analytics };

export default app;
