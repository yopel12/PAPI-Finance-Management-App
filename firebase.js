// firebase.js
import { initializeApp, getApps } from 'firebase/app';

// switch to the React Native–flavored auth entrypoint
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';

// import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLzcKNDbsBnySyrSVehYgqFDIRmwH0hVQ",
  authDomain: "pinansyalapp.firebaseapp.com",
  projectId: "pinansyalapp",
  storageBucket: "pinansyalapp.firebasestorage.app",
  messagingSenderId: "211753680858",
  appId: "1:211753680858:web:cb0ae27a5318fee036cae3",
  measurementId: "G-KZZXV1J2F3"
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

// **This** line hooks up AsyncStorage so your auth state persists between app launches:
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
