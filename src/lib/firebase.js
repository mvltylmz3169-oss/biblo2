// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config - direkt tanımlandı
const firebaseConfig = {
  apiKey: "AIzaSyAmim3CaatreR8lsoSeaBLvi7PzXXJXsZs",
  authDomain: "biblo-a43d6.firebaseapp.com",
  projectId: "biblo-a43d6",
  storageBucket: "biblo-a43d6.firebasestorage.app",
  messagingSenderId: "367813650390",
  appId: "1:367813650390:web:80acb7fc196607bca26677",
  measurementId: "G-PE7YRRKDL1"
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
