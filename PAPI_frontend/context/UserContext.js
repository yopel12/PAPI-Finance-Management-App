import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
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
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const docRef = doc(db, 'users', uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          const complete =
            data.name?.trim() &&
            data.place?.trim() &&
            data.dob &&
            data.gender?.trim();

          setProfileExists(Boolean(complete));

          setUser({
            uid,
            image: require('../assets/avatar.png'),
            ...data,
          });
        } else {
          setProfileExists(false);
          setUser((prev) => ({ ...prev, uid }));
        }
      } else {
        setProfileExists(false);
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

  const updateUser = async (updates) => {
    if (!user.uid) throw new Error('No authenticated user to update');

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, updates, { merge: true });

    const updated = { ...user, ...updates };
    setUser(updated);

    const complete =
      updated.name?.trim() &&
      updated.place?.trim() &&
      updated.dob &&
      updated.gender?.trim();

    setProfileExists(Boolean(complete));
  };

  return (
    <UserContext.Provider value={{ user, profileExists, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
