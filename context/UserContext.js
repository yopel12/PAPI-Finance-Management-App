import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';                // adjust path if you still keep `config/` folder
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: null,
    name: '',
    phone: '',
    address: '',
    place: '',
    dob: null,                // Date object
    gender: '',
    image: require('../assets/avatar.png'), // default avatar
  });
  const [loading, setLoading] = useState(true);

  // listen for auth changes and load profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const docRef = doc(db, 'users', uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          // merge Firestore data, preserve default avatar if none
          setUser({
            uid,
            image: require('../assets/avatar.png'),
            ...snap.data(),
          });
        } else {
          // no profile yet—just set uid
          setUser((prev) => ({ ...prev, uid }));
        }
      } else {
        // signed out: reset to defaults
        setUser({
          uid: null,
          name: '',
          phone: '',
          address: '',
          place: '',
          dob: null,
          gender: '',
          image: require('../assets/avatar.png'),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Merge updates into Firestore and local state
   * @param {{ [key: string]: any }} updates
   */
  const updateUser = async (updates) => {
    if (!user.uid) throw new Error('No authenticated user to update');
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, updates, { merge: true });
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
