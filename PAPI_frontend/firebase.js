import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBLzcKNDbsBnySyrSVehYgqFDIRmwH0hVQ",
  authDomain: "pinansyalapp.firebaseapp.com",
  projectId: "pinansyalapp",
  storageBucket: "pinansyalapp.firebasestorage.app",
  messagingSenderId: "211753680858",
  appId: "1:211753680858:web:cb0ae27a5318fee036cae3",
  measurementId: "G-KZZXV1J2F3"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Check if auth is already initialized
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth };
export const db = getFirestore(app);
